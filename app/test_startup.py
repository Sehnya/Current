#!/usr/bin/env python3
"""
Simple test script to verify the API starts up correctly
"""

import requests
import time
import subprocess
import sys
import os

def test_api_startup():
    """Test that the API starts up and responds to health checks"""
    print("🧪 Testing API startup...")
    
    # Start the server in the background
    env = os.environ.copy()
    env['PORT'] = '8001'  # Use different port for testing
    
    try:
        # Start server
        print("🚀 Starting server...")
        process = subprocess.Popen([
            sys.executable, '-m', 'uvicorn', 'main:app', 
            '--host', '0.0.0.0', '--port', '8001'
        ], env=env)
        
        # Wait a bit for startup
        time.sleep(3)
        
        # Test readiness endpoint
        print("🔍 Testing /ready endpoint...")
        response = requests.get('http://localhost:8001/ready', timeout=5)
        if response.status_code == 200:
            print("✅ /ready endpoint working")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ /ready endpoint failed: {response.status_code}")
            return False
        
        # Test health endpoint
        print("🔍 Testing /health endpoint...")
        response = requests.get('http://localhost:8001/health', timeout=5)
        if response.status_code == 200:
            print("✅ /health endpoint working")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ /health endpoint failed: {response.status_code}")
            return False
        
        # Test root endpoint
        print("🔍 Testing / endpoint...")
        response = requests.get('http://localhost:8001/', timeout=5)
        if response.status_code == 200:
            print("✅ Root endpoint working")
            data = response.json()
            print(f"API version: {data.get('version')}")
            print(f"Total stacks: {data.get('total_stacks')}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
        
        print("🎉 All tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False
    
    finally:
        # Clean up
        if 'process' in locals():
            process.terminate()
            process.wait()
            print("🧹 Server stopped")

if __name__ == "__main__":
    success = test_api_startup()
    sys.exit(0 if success else 1)