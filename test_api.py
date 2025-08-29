#!/usr/bin/env python3
"""
Test script to verify API functionality
"""

import requests
import time
import subprocess
import sys
import os

def test_api():
    """Test the API endpoints"""
    base_url = "http://localhost:8000"
    
    # Test endpoints
    endpoints = [
        "/ready",
        "/health", 
        "/",
        "/stacks"
    ]
    
    print("🧪 Testing API endpoints...")
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                print(f"✅ {endpoint}: {response.status_code}")
            else:
                print(f"⚠️ {endpoint}: {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint}: {e}")
    
    print("🧪 API test complete!")

if __name__ == "__main__":
    # Change to app directory
    os.chdir("app")
    
    # Start server
    print("🚀 Starting API server...")
    proc = subprocess.Popen([sys.executable, "run_server.py"], 
                           stdout=subprocess.PIPE, 
                           stderr=subprocess.PIPE)
    
    # Wait for server to start
    time.sleep(5)
    
    try:
        test_api()
    finally:
        print("🛑 Stopping server...")
        proc.terminate()
        proc.wait()