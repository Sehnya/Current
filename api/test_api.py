#!/usr/bin/env python3
"""
Test script to verify API functionality before deployment
"""

import sys
import requests
import time
import subprocess
import signal
import os
from multiprocessing import Process

def start_api_server():
    """Start the API server in a subprocess"""
    os.chdir('/Users/sehnya/Code 2.0/OSource/api')
    os.system('source venv/bin/activate && python main.py')

def test_api_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:8000"
    
    # Wait for server to start
    print("⏳ Waiting for API server to start...")
    for i in range(30):
        try:
            response = requests.get(f"{base_url}/health", timeout=5)
            if response.status_code == 200:
                print("✅ API server is running!")
                break
        except requests.exceptions.RequestException:
            time.sleep(1)
    else:
        print("❌ API server failed to start")
        return False
    
    # Test endpoints
    endpoints = [
        ("/", "Root endpoint"),
        ("/health", "Health check"),
        ("/stacks", "List stacks"),
        ("/stacks/trending", "Trending stacks"),
        ("/stacks/search?q=react", "Search stacks"),
    ]
    
    print("\n🧪 Testing API endpoints...")
    all_passed = True
    
    for endpoint, description in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                print(f"✅ {description}: {response.status_code}")
            else:
                print(f"❌ {description}: {response.status_code}")
                all_passed = False
        except requests.exceptions.RequestException as e:
            print(f"❌ {description}: {str(e)}")
            all_passed = False
    
    return all_passed

if __name__ == "__main__":
    print("🌊 Current API Test Suite")
    print("=" * 40)
    
    # Start API server in background
    print("🚀 Starting API server...")
    server_process = Process(target=start_api_server)
    server_process.start()
    
    try:
        # Test the API
        success = test_api_endpoints()
        
        if success:
            print("\n🎉 All tests passed! API is ready for deployment.")
            sys.exit(0)
        else:
            print("\n❌ Some tests failed. Check the API before deploying.")
            sys.exit(1)
            
    finally:
        # Clean up
        print("\n🧹 Cleaning up...")
        server_process.terminate()
        server_process.join()