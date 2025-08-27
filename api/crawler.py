import requests
import json
import re
from datetime import datetime
from typing import Dict, Optional, Any
from models import Stack, InstallCommands, StackCategory

class StackCrawler:
    def __init__(self, config_path: str = "kiro.config.json"):
        # Handle Railway deployment path
        import os
        if not os.path.exists(config_path) and os.path.exists(f"/app/{config_path}"):
            config_path = f"/app/{config_path}"
        
        with open(config_path, 'r') as f:
            self.config = json.load(f)
    
    def normalize_version(self, version: str) -> str:
        """Strip 'v' prefix and normalize to semver format"""
        version = version.lstrip('v')
        # Ensure it matches semver pattern
        if re.match(r'^\d+\.\d+\.\d+', version):
            return version
        # Handle cases like "1.0" -> "1.0.0"
        parts = version.split('.')
        while len(parts) < 3:
            parts.append('0')
        return '.'.join(parts[:3])
    
    def fetch_npm_data(self, package_name: str) -> Optional[Dict[str, Any]]:
        """Fetch package data from npm registry"""
        try:
            url = f"https://registry.npmjs.org/{package_name}/latest"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching npm data for {package_name}: {e}")
            return None
    
    def fetch_npm_downloads(self, package_name: str) -> Dict[str, int]:
        """Fetch npm download statistics"""
        downloads = {"weekly": 0, "monthly": 0}
        try:
            # Weekly downloads
            weekly_url = f"https://api.npmjs.org/downloads/point/last-week/{package_name}"
            weekly_response = requests.get(weekly_url, timeout=10)
            if weekly_response.status_code == 200:
                weekly_data = weekly_response.json()
                downloads["weekly"] = weekly_data.get("downloads", 0)
            
            # Monthly downloads
            monthly_url = f"https://api.npmjs.org/downloads/point/last-month/{package_name}"
            monthly_response = requests.get(monthly_url, timeout=10)
            if monthly_response.status_code == 200:
                monthly_data = monthly_response.json()
                downloads["monthly"] = monthly_data.get("downloads", 0)
                
        except Exception as e:
            print(f"Error fetching npm downloads for {package_name}: {e}")
        
        return downloads
    
    def fetch_pypi_data(self, package_name: str) -> Optional[Dict[str, Any]]:
        """Fetch package data from PyPI"""
        try:
            url = f"https://pypi.org/pypi/{package_name}/json"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching PyPI data for {package_name}: {e}")
            return None
    
    def fetch_pypi_downloads(self, package_name: str) -> Dict[str, int]:
        """Fetch PyPI download statistics"""
        downloads = {"weekly": 0, "monthly": 0}
        try:
            # Try pypistats API for recent downloads
            url = f"https://pypistats.org/api/packages/{package_name}/recent"
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "data" in data:
                    downloads["weekly"] = data["data"].get("last_week", 0)
                    downloads["monthly"] = data["data"].get("last_month", 0)
        except Exception as e:
            print(f"Error fetching PyPI downloads for {package_name}: {e}")
        
        return downloads
    
    def fetch_github_release(self, repo: str) -> Optional[Dict[str, Any]]:
        """Fetch latest release from GitHub"""
        try:
            url = f"https://api.github.com/repos/{repo}/releases/latest"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching GitHub data for {repo}: {e}")
            return None
    
    def fetch_github_stats(self, repo: str) -> Dict[str, int]:
        """Fetch GitHub repository statistics"""
        stats = {"stars": 0, "forks": 0}
        try:
            url = f"https://api.github.com/repos/{repo}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            stats["stars"] = data.get("stargazers_count", 0)
            stats["forks"] = data.get("forks_count", 0)
        except Exception as e:
            print(f"Error fetching GitHub stats for {repo}: {e}")
        
        return stats 
   
    def create_install_commands(self, stack_name: str, language: str, npm_package: str = None, pypi_package: str = None) -> InstallCommands:
        """Generate install commands based on package type"""
        commands = InstallCommands()
        
        if npm_package:
            commands.npm = f"npm install {npm_package}"
            commands.bun = f"bun add {npm_package}"
            commands.yarn = f"yarn add {npm_package}"
        
        if pypi_package:
            commands.pip = f"pip install {pypi_package}"
        
        return commands
    
    def get_stack_category(self, stack_name: str) -> StackCategory:
        """Get category for a stack from config"""
        category_map = self.config.get('categories', {})
        category_str = category_map.get(stack_name, 'other')
        
        # Map string to enum
        category_mapping = {
            'frontend': StackCategory.FRONTEND,
            'backend': StackCategory.BACKEND,
            'database': StackCategory.DATABASE,
            'testing': StackCategory.TESTING,
            'styling': StackCategory.STYLING,
            'build-tools': StackCategory.BUILD_TOOLS,
            'state-management': StackCategory.STATE_MANAGEMENT,
            'data-science': StackCategory.DATA_SCIENCE,
            'animation': StackCategory.ANIMATION,
            'networking': StackCategory.NETWORKING,
            'runtime': StackCategory.RUNTIME,
            'package-manager': StackCategory.PACKAGE_MANAGER,
            'code-quality': StackCategory.CODE_QUALITY,
            'monorepo': StackCategory.MONOREPO,
            'visualization': StackCategory.VISUALIZATION,
            'ml-apps': StackCategory.ML_APPS,
            'validation': StackCategory.VALIDATION,
            'forms': StackCategory.FORMS,
            'routing': StackCategory.ROUTING,
            'realtime': StackCategory.REALTIME,
            'graphql': StackCategory.GRAPHQL,
            'utility': StackCategory.UTILITY,
            'other': StackCategory.OTHER
        }
        
        return category_mapping.get(category_str, StackCategory.OTHER)
    
    def crawl_stack(self, stack_name: str, config: Dict[str, Any]) -> Optional[Stack]:
        """Crawl a single stack and return Stack object with popularity metrics"""
        try:
            version = None
            release_date = None
            github_url = None
            github_stars = 0
            github_forks = 0
            downloads_weekly = 0
            downloads_monthly = 0
            
            # Try npm first
            if 'npm' in config:
                npm_data = self.fetch_npm_data(config['npm'])
                if npm_data:
                    version = self.normalize_version(npm_data.get('version', ''))
                    release_date = npm_data.get('time', {}).get(npm_data.get('version'), '')
                
                # Fetch npm download stats
                npm_downloads = self.fetch_npm_downloads(config['npm'])
                downloads_weekly = npm_downloads.get('weekly', 0)
                downloads_monthly = npm_downloads.get('monthly', 0)
            
            # Try PyPI if npm failed or not available
            if not version and 'pypi' in config:
                pypi_data = self.fetch_pypi_data(config['pypi'])
                if pypi_data:
                    info = pypi_data.get('info', {})
                    version = self.normalize_version(info.get('version', ''))
                    release_date = datetime.now().isoformat()
                
                # Fetch PyPI download stats
                pypi_downloads = self.fetch_pypi_downloads(config['pypi'])
                downloads_weekly = pypi_downloads.get('weekly', 0)
                downloads_monthly = pypi_downloads.get('monthly', 0)
            
            # Try GitHub if others failed
            if not version and 'github' in config:
                github_data = self.fetch_github_release(config['github'])
                if github_data:
                    version = self.normalize_version(github_data.get('tag_name', ''))
                    release_date = github_data.get('published_at', '')
            
            # Always fetch GitHub stats if available
            if 'github' in config:
                github_url = f"https://github.com/{config['github']}"
                github_stats = self.fetch_github_stats(config['github'])
                github_stars = github_stats.get('stars', 0)
                github_forks = github_stats.get('forks', 0)
            
            if not version:
                print(f"Could not fetch version for {stack_name}")
                return None
            
            # Format release date
            if release_date:
                try:
                    dt = datetime.fromisoformat(release_date.replace('Z', '+00:00'))
                    release_date = dt.strftime('%Y-%m-%d')
                except:
                    release_date = datetime.now().strftime('%Y-%m-%d')
            else:
                release_date = datetime.now().strftime('%Y-%m-%d')
            
            # Create install commands
            install_commands = self.create_install_commands(
                stack_name,
                config.get('language', 'Unknown'),
                config.get('npm'),
                config.get('pypi')
            )
            
            # Get category
            category = self.get_stack_category(stack_name)
            
            return Stack(
                name=stack_name.title(),
                language=config.get('language', 'Unknown'),
                latest_version=version,
                release_date=release_date,
                docs_url=config['docs_url'],
                github_url=github_url,
                install=install_commands,
                github_stars=github_stars,
                github_forks=github_forks,
                downloads_weekly=downloads_weekly,
                downloads_monthly=downloads_monthly,
                last_checked=datetime.now(),
                category=category,
                last_updated=datetime.now()
            )
            
        except Exception as e:
            print(f"Error crawling {stack_name}: {e}")
            return None
    
    def crawl_all_stacks(self) -> Dict[str, Stack]:
        """Crawl all configured stacks"""
        stacks = {}
        
        for stack_name, config in self.config['sources'].items():
            print(f"Crawling {stack_name}...")
            stack = self.crawl_stack(stack_name, config)
            if stack:
                stacks[stack_name] = stack
                print(f"✓ {stack_name}: v{stack.latest_version} ({stack.github_stars:,} ⭐)")
            else:
                print(f"✗ Failed to crawl {stack_name}")
        
        return stacks
    
    def crawl_fast_moving_stacks(self) -> Dict[str, Stack]:
        """Crawl only fast-moving stacks for daily updates"""
        fast_moving = self.config.get('fast_moving_stacks', [])
        stacks = {}
        
        print(f"Crawling {len(fast_moving)} fast-moving stacks...")
        for stack_name in fast_moving:
            if stack_name in self.config['sources']:
                config = self.config['sources'][stack_name]
                print(f"Crawling {stack_name}...")
                stack = self.crawl_stack(stack_name, config)
                if stack:
                    stacks[stack_name] = stack
                    print(f"✓ {stack_name}: v{stack.latest_version}")
                else:
                    print(f"✗ Failed to crawl {stack_name}")
        
        return stacks