#!/usr/bin/env python3
"""
Railway-compatible server runner
"""

import os
import sys
import uvicorn

def main():
    """Start the FastAPI server"""
    # Get port from environment
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🌊 Starting Current API on port {port}")
    print(f"🐍 Python version: {sys.version}")
    
    # Import the app
    try:
        from main import app
        print("✅ FastAPI app imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import app: {e}")
        sys.exit(1)
    
    # Start the server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )

if __name__ == "__main__":
    main()