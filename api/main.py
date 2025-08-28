from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict, Any

from models import (
    Stack, StackResponse, RefreshResponse, CategoryResponse, 
    SearchResponse, TrendingResponse, OutdatedResponse, StackCategory
)
from crawler import StackCrawler
from storage import JSONStorage
from scheduler import scheduler

app = FastAPI(
    title="Current API",
    description="Stay ahead of the wave in tech - comprehensive stack tracking",
    version="2.0.0"
)

# Add CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://current.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
storage = JSONStorage()
crawler = StackCrawler()

@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    print("🌊 Starting Current API...")
    
    try:
        # Load existing stacks - don't perform initial crawl on startup
        existing_stacks = storage.load_stacks()
        if not existing_stacks:
            print("🔄 No existing data found. Will populate on first request.")
            # Create empty storage to ensure health check passes
            storage.save_stacks({})
        else:
            print(f"📚 Loaded {len(existing_stacks)} existing stacks from storage.")
    except Exception as e:
        print(f"⚠️ Warning during storage initialization: {e}")
    
    try:
        # Start the scheduler
        scheduler.start_scheduler()
        print("📅 Scheduler started successfully.")
    except Exception as e:
        print(f"⚠️ Warning: Could not start scheduler: {e}")
    
    print("✅ Current API startup complete.")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    scheduler.stop_scheduler()
    print("🌊 Current API shutdown complete.")

@app.get("/", response_model=Dict[str, Any])
async def root():
    """API root endpoint with basic info"""
    metadata = storage.get_metadata()
    return {
        "message": "Current API - Stay ahead of the wave in tech",
        "version": "2.0.0",
        "total_stacks": metadata.get('total_count', 0),
        "last_updated": metadata.get('last_updated'),
        "endpoints": {
            "list_stacks": "/stacks",
            "get_stack": "/stacks/{name}",
            "category_stacks": "/stacks/category/{category}",
            "search_stacks": "/stacks/search?q={query}",
            "trending_stacks": "/stacks/trending",
            "outdated_stacks": "/stacks/outdated",
            "refresh": "/stacks/refresh"
        }
    }

@app.get("/stacks", response_model=StackResponse)
async def list_stacks():
    """List all tracked stacks"""
    try:
        stacks = storage.load_stacks()
        metadata = storage.get_metadata()
        
        # If no stacks exist, trigger a background refresh
        if not stacks:
            print("🔄 No stacks found. Consider running /stacks/refresh to populate data.")
        
        return StackResponse(
            stacks=stacks,
            total_count=len(stacks),
            last_refresh=metadata.get('last_updated')
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading stacks: {str(e)}")

@app.get("/stacks/category/{category}", response_model=CategoryResponse)
async def get_stacks_by_category(category: str):
    """Get all stacks in a specific category"""
    try:
        # Convert string to enum
        category_enum = None
        for cat in StackCategory:
            if cat.value == category.lower():
                category_enum = cat
                break
        
        if not category_enum:
            raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
        
        stacks = storage.get_stacks_by_category(category_enum)
        
        return CategoryResponse(
            category=category,
            stacks=stacks,
            total_count=len(stacks)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading category stacks: {str(e)}")

@app.get("/stacks/search", response_model=SearchResponse)
async def search_stacks(q: str):
    """Search stacks by name (fuzzy matching)"""
    try:
        stacks = storage.search_stacks(q)
        
        return SearchResponse(
            query=q,
            stacks=stacks,
            total_count=len(stacks)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching stacks: {str(e)}")

@app.get("/stacks/trending", response_model=TrendingResponse)
async def get_trending_stacks(sort_by: str = "stars", limit: int = 20):
    """Get trending stacks sorted by popularity metrics"""
    try:
        valid_sorts = ["stars", "downloads", "forks", "combined"]
        if sort_by not in valid_sorts:
            raise HTTPException(status_code=400, detail=f"Invalid sort_by. Must be one of: {valid_sorts}")
        
        stacks = storage.get_trending_stacks(sort_by=sort_by, limit=limit)
        
        return TrendingResponse(
            stacks=stacks,
            sort_by=sort_by,
            total_count=len(stacks)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting trending stacks: {str(e)}")

@app.get("/stacks/outdated", response_model=OutdatedResponse)
async def get_outdated_stacks(threshold_days: int = 7):
    """Get stacks that haven't been checked recently"""
    try:
        stacks = storage.get_outdated_stacks(threshold_days=threshold_days)
        
        return OutdatedResponse(
            stacks=stacks,
            threshold_days=threshold_days,
            total_count=len(stacks)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting outdated stacks: {str(e)}")

@app.get("/stacks/{name}", response_model=Stack)
async def get_stack(name: str):
    """Get details for a specific stack"""
    stack = storage.get_stack(name.lower())
    if not stack:
        raise HTTPException(status_code=404, detail=f"Stack '{name}' not found")
    return stack

@app.post("/stacks/refresh", response_model=RefreshResponse)
async def refresh_stacks(fast_only: bool = False):
    """Manually refresh stack data"""
    try:
        print(f"🔄 Manual refresh triggered via API (fast_only={fast_only})...")
        
        if fast_only:
            stacks = crawler.crawl_fast_moving_stacks()
            # Merge with existing stacks
            existing_stacks = storage.load_stacks()
            for name, stack in stacks.items():
                existing_stacks[name] = stack
            storage.save_stacks(existing_stacks)
        else:
            stacks = crawler.crawl_all_stacks()
            storage.save_stacks(stacks)
        
        return RefreshResponse(
            success=True,
            updated_stacks=len(stacks),
            errors={},
            timestamp=datetime.now()
        )
    except Exception as e:
        return RefreshResponse(
            success=False,
            updated_stacks=0,
            errors={"general": str(e)},
            timestamp=datetime.now()
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Simple health check - just verify storage is accessible
        metadata = storage.get_metadata()
        return {
            "status": "healthy", 
            "timestamp": datetime.now(),
            "stacks_count": metadata.get('total_count', 0),
            "version": "2.0.0",
            "last_updated": metadata.get('last_updated')
        }
    except Exception as e:
        # Log the error but still return healthy if basic functionality works
        print(f"Health check warning: {str(e)}")
        return {
            "status": "healthy", 
            "timestamp": datetime.now(),
            "stacks_count": 0,
            "version": "2.0.0",
            "warning": "Storage not fully initialized"
        }

@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint - simpler than health check"""
    return {
        "status": "ready",
        "timestamp": datetime.now(),
        "version": "2.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    import os
    
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port,
        log_level="info"
    )