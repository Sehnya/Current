import json
import os
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from models import Stack, StackCategory, HistoricalSnapshot

class JSONStorage:
    """Enhanced JSON file storage with historical data support"""
    
    def __init__(self, file_path: str = "stacks_data.json"):
        # Handle Railway deployment - use persistent volume if available
        import os
        if os.environ.get('RAILWAY_ENVIRONMENT'):
            # Use /app/data for persistent storage on Railway
            data_dir = "/app/data"
            os.makedirs(data_dir, exist_ok=True)
            self.file_path = os.path.join(data_dir, file_path)
        else:
            self.file_path = file_path
        self.ensure_file_exists()
    
    def ensure_file_exists(self):
        """Create empty storage file if it doesn't exist"""
        if not os.path.exists(self.file_path):
            self.save_stacks({})
    
    def load_stacks(self) -> Dict[str, Stack]:
        """Load stacks from JSON file"""
        try:
            with open(self.file_path, 'r') as f:
                data = json.load(f)
                stacks = {}
                for name, stack_data in data.get('stacks', {}).items():
                    # Convert dict back to Stack object
                    stacks[name] = Stack(**stack_data)
                return stacks
        except Exception as e:
            print(f"Error loading stacks: {e}")
            return {}
    
    def save_stacks(self, stacks: Dict[str, Stack]):
        """Save stacks to JSON file with historical snapshots"""
        try:
            # Load existing data to preserve history
            existing_data = {}
            if os.path.exists(self.file_path):
                with open(self.file_path, 'r') as f:
                    existing_data = json.load(f)
            
            # Convert Stack objects to dicts for JSON serialization
            stacks_data = {}
            for name, stack in stacks.items():
                stack_dict = stack.model_dump()
                
                # Add historical snapshot if this is an update
                if name in existing_data.get('stacks', {}):
                    existing_stack = existing_data['stacks'][name]
                    history = existing_stack.get('history', [])
                    
                    # Add snapshot if version or popularity changed significantly
                    should_snapshot = (
                        existing_stack.get('latest_version') != stack.latest_version or
                        abs(existing_stack.get('github_stars', 0) - stack.github_stars) > 100 or
                        abs(existing_stack.get('downloads_weekly', 0) - stack.downloads_weekly) > 10000
                    )
                    
                    if should_snapshot:
                        snapshot = HistoricalSnapshot(
                            timestamp=datetime.now(),
                            version=existing_stack.get('latest_version', ''),
                            github_stars=existing_stack.get('github_stars', 0),
                            downloads_weekly=existing_stack.get('downloads_weekly', 0)
                        )
                        history.append(snapshot.model_dump())
                        
                        # Keep only last 10 snapshots
                        history = history[-10:]
                    
                    stack_dict['history'] = history
                
                stacks_data[name] = stack_dict
            
            data = {
                'stacks': stacks_data,
                'last_updated': datetime.now().isoformat(),
                'total_count': len(stacks)
            }
            
            with open(self.file_path, 'w') as f:
                json.dump(data, f, indent=2, default=str)
                
        except Exception as e:
            print(f"Error saving stacks: {e}")
    
    def get_stack(self, name: str) -> Optional[Stack]:
        """Get a specific stack by name"""
        stacks = self.load_stacks()
        return stacks.get(name.lower())
    
    def get_stacks_by_category(self, category: StackCategory) -> Dict[str, Stack]:
        """Get all stacks in a specific category"""
        stacks = self.load_stacks()
        return {name: stack for name, stack in stacks.items() if stack.category == category}
    
    def search_stacks(self, query: str) -> Dict[str, Stack]:
        """Search stacks by name (fuzzy matching)"""
        stacks = self.load_stacks()
        query_lower = query.lower()
        
        # Exact matches first, then partial matches
        exact_matches = {name: stack for name, stack in stacks.items() 
                        if query_lower == name.lower() or query_lower == stack.name.lower()}
        
        partial_matches = {name: stack for name, stack in stacks.items() 
                          if query_lower in name.lower() or query_lower in stack.name.lower()}
        
        # Combine results, exact matches first
        results = {**exact_matches}
        for name, stack in partial_matches.items():
            if name not in results:
                results[name] = stack
        
        return results
    
    def get_trending_stacks(self, sort_by: str = "stars", limit: int = 20) -> List[Stack]:
        """Get trending stacks sorted by popularity metrics"""
        stacks = list(self.load_stacks().values())
        
        if sort_by == "stars":
            stacks.sort(key=lambda x: x.github_stars or 0, reverse=True)
        elif sort_by == "downloads":
            stacks.sort(key=lambda x: x.downloads_weekly or 0, reverse=True)
        elif sort_by == "forks":
            stacks.sort(key=lambda x: x.github_forks or 0, reverse=True)
        else:
            # Default to combined score
            stacks.sort(key=lambda x: (x.github_stars or 0) + (x.downloads_weekly or 0) / 1000, reverse=True)
        
        return stacks[:limit]
    
    def get_outdated_stacks(self, threshold_days: int = 7) -> Dict[str, Stack]:
        """Get stacks that haven't been checked recently"""
        stacks = self.load_stacks()
        outdated = {}
        threshold_date = datetime.now() - timedelta(days=threshold_days)
        
        for name, stack in stacks.items():
            if not stack.last_checked or stack.last_checked < threshold_date:
                outdated[name] = stack
        
        return outdated
    
    def get_metadata(self) -> Dict:
        """Get storage metadata"""
        try:
            with open(self.file_path, 'r') as f:
                data = json.load(f)
                return {
                    'last_updated': data.get('last_updated'),
                    'total_count': data.get('total_count', 0)
                }
        except:
            return {'last_updated': None, 'total_count': 0}