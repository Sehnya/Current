#!/usr/bin/env python3
"""
Verify all dependencies can be imported
"""

import sys

def test_imports():
    """Test that all required modules can be imported"""
    modules = [
        'fastapi',
        'uvicorn',
        'requests',
        'schedule',
        'pydantic',
        'dateutil',
        'fuzzywuzzy'
    ]
    
    print("🧪 Testing module imports...")
    
    for module in modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            return False
    
    return True

def test_uvicorn_command():
    """Test that uvicorn can be run as a module"""
    import subprocess
    
    try:
        result = subprocess.run([sys.executable, '-m', 'uvicorn', '--help'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✅ uvicorn module command works")
            return True
        else:
            print(f"❌ uvicorn module command failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ uvicorn module test failed: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Dependency Verification")
    print("=" * 30)
    
    imports_ok = test_imports()
    uvicorn_ok = test_uvicorn_command()
    
    if imports_ok and uvicorn_ok:
        print("\n🎉 All dependencies verified!")
        sys.exit(0)
    else:
        print("\n❌ Dependency verification failed!")
        sys.exit(1)