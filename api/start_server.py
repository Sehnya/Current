#!/usr/bin/env python3
"""
Startup script for the Current API server
This helps debug uvicorn import issues
"""

import sys
import os

def main():
    print("🔍 Python executable:", sys.executable)
    print("🔍 Python version:", sys.version)
    print("🔍 Python path:", sys.path)
    print("🔍 Current working directory:", os.getcwd())
    print("🔍 Environment PORT:", os.environ.get('PORT', 'Not set'))
    print("🔍 Environment PYTHONPATH:", os.environ.get('PYTHONPATH', 'Not set'))
    
    # Try to import uvicorn
    try:
        import uvicorn
        print(f"✅ Uvicorn imported successfully from: {uvicorn.__file__}")
        print(f"✅ Uvicorn version: {uvicorn.__version__}")
    except ImportError as e:
        print(f"❌ Failed to import uvicorn: {e}")
        sys.exit(1)
    
    # Try to import the main app
    try:
        from main import app
        print("✅ FastAPI app imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import main app: {e}")
        sys.exit(1)
    
    # Start the server
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )

if __name__ == "__main__":
    main()