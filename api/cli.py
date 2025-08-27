#!/usr/bin/env python3
"""
Current Stack Tracker - Command Line Interface

A comprehensive CLI tool for managing stack data collection and analysis.
"""

import json
import argparse
import sys
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import requests
from crawler import StackCrawler
from storage import StackStorage
from models import Stack


class CurrentCLI:
    def __init__(self):
        self.storage = StackStorage()
        self.crawler = StackCrawler()
    
    def load_config(self) -> Dict[str, Any]:
        """Load configuration from kiro.config.json"""
        try:
            with open('kiro.config.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print("❌ kiro.config.json not found")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing kiro.config.json: {e}")
            sys.exit(1)
    
    def save_config(self, config: Dict[str, Any]):
        """Save configuration to kiro.config.json"""
        try:
            with open('kiro.config.json', 'w') as f:
                json.dump(config, f, indent=2)
        except Exception as e:
            print(f"❌ Error saving configuration: {e}")
            sys.exit(1)
    
    def update_stacks(self, fast_only: bool = False):
        """Update stack data"""
        config = self.load_config()
        stacks_to_update = []
        
        if fast_only:
            # Only update fast-moving stacks (daily updates)
            fast_moving = ['react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt.js', 
                          'express', 'fastapi', 'django', 'flask', 'tailwindcss']
            stacks_to_update = [name for name in config.get('stacks', {}).keys() 
                              if name.lower() in fast_moving]
            print(f"🚀 Updating {len(stacks_to_update)} fast-moving stacks...")
        else:
            stacks_to_update = list(config.get('stacks', {}).keys())
            print(f"🔄 Updating all {len(stacks_to_update)} stacks...")
        
        updated_count = 0
        failed_count = 0
        
        for stack_name in stacks_to_update:
            try:
                print(f"📦 Updating {stack_name}...")
                stack_config = config['stacks'][stack_name]
                stack_data = self.crawler.crawl_stack(stack_name, stack_config)
                
                if stack_data:
                    self.storage.save_stack(stack_data)
                    updated_count += 1
                    print(f"✅ {stack_name} updated successfully")
                else:
                    failed_count += 1
                    print(f"❌ Failed to update {stack_name}")
                    
            except Exception as e:
                failed_count += 1
                print(f"❌ Error updating {stack_name}: {e}")
        
        print(f"\n📊 Update Summary:")
        print(f"✅ Successfully updated: {updated_count}")
        print(f"❌ Failed: {failed_count}")
        print(f"📈 Total stacks: {len(stacks_to_update)}")
    
    def list_stacks(self, category: Optional[str] = None):
        """List all stacks or filter by category"""
        config = self.load_config()
        stacks = config.get('stacks', {})
        
        if category:
            filtered_stacks = {name: data for name, data in stacks.items() 
                             if data.get('category', '').lower() == category.lower()}
            print(f"📋 Stacks in '{category}' category ({len(filtered_stacks)}):")
            stacks = filtered_stacks
        else:
            print(f"📋 All stacks ({len(stacks)}):")
        
        if not stacks:
            print("No stacks found.")
            return
        
        # Group by category
        categories = {}
        for name, data in stacks.items():
            cat = data.get('category', 'Other')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(name)
        
        for cat, stack_names in sorted(categories.items()):
            print(f"\n🏷️  {cat}:")
            for name in sorted(stack_names):
                stack_data = self.storage.load_stack(name)
                if stack_data:
                    print(f"  📦 {name} - {stack_data.description[:60]}...")
                else:
                    print(f"  📦 {name} - (no data)")
    
    def show_stack(self, name: str):
        """Show detailed information about a specific stack"""
        stack_data = self.storage.load_stack(name)
        if not stack_data:
            print(f"❌ Stack '{name}' not found")
            return
        
        print(f"📦 {stack_data.name}")
        print(f"📝 {stack_data.description}")
        print(f"🏷️  Category: {stack_data.category}")
        print(f"🌐 Website: {stack_data.website}")
        print(f"📂 Repository: {stack_data.repository}")
        print(f"📊 Downloads: {stack_data.downloads:,}")
        print(f"⭐ Stars: {stack_data.stars:,}")
        print(f"🍴 Forks: {stack_data.forks:,}")
        print(f"📅 Last Updated: {stack_data.last_updated}")
        
        if stack_data.tags:
            print(f"🏷️  Tags: {', '.join(stack_data.tags)}")
    
    def search_stacks(self, query: str):
        """Search stacks by name or description"""
        config = self.load_config()
        stacks = config.get('stacks', {})
        
        matches = []
        query_lower = query.lower()
        
        for name, data in stacks.items():
            if (query_lower in name.lower() or 
                query_lower in data.get('description', '').lower()):
                matches.append(name)
        
        if not matches:
            print(f"❌ No stacks found matching '{query}'")
            return
        
        print(f"🔍 Found {len(matches)} stacks matching '{query}':")
        for name in sorted(matches):
            stack_data = self.storage.load_stack(name)
            if stack_data:
                print(f"  📦 {name} - {stack_data.description[:60]}...")
            else:
                print(f"  📦 {name} - (no data)")
    
    def trending_stacks(self, sort_by: str = 'downloads', limit: int = 10):
        """Show trending stacks"""
        config = self.load_config()
        stacks = []
        
        for name in config.get('stacks', {}).keys():
            stack_data = self.storage.load_stack(name)
            if stack_data:
                stacks.append(stack_data)
        
        if not stacks:
            print("❌ No stack data available")
            return
        
        # Sort by specified metric
        if sort_by == 'downloads':
            stacks.sort(key=lambda x: x.downloads, reverse=True)
        elif sort_by == 'stars':
            stacks.sort(key=lambda x: x.stars, reverse=True)
        elif sort_by == 'forks':
            stacks.sort(key=lambda x: x.forks, reverse=True)
        else:
            print(f"❌ Invalid sort option: {sort_by}")
            return
        
        print(f"📈 Top {limit} stacks by {sort_by}:")
        for i, stack in enumerate(stacks[:limit], 1):
            value = getattr(stack, sort_by)
            print(f"  {i:2d}. 📦 {stack.name} - {value:,} {sort_by}")
    
    def outdated_stacks(self, days: int = 7):
        """Find stacks that haven't been updated recently"""
        config = self.load_config()
        cutoff_date = datetime.now() - timedelta(days=days)
        outdated = []
        
        for name in config.get('stacks', {}).keys():
            stack_data = self.storage.load_stack(name)
            if stack_data:
                try:
                    last_updated = datetime.fromisoformat(stack_data.last_updated.replace('Z', '+00:00'))
                    if last_updated < cutoff_date:
                        outdated.append((name, last_updated))
                except:
                    outdated.append((name, None))
        
        if not outdated:
            print(f"✅ All stacks have been updated within the last {days} days")
            return
        
        print(f"⚠️  {len(outdated)} stacks haven't been updated in {days}+ days:")
        for name, last_updated in sorted(outdated):
            if last_updated:
                days_ago = (datetime.now() - last_updated.replace(tzinfo=None)).days
                print(f"  📦 {name} - {days_ago} days ago")
            else:
                print(f"  📦 {name} - unknown")
    
    def add_stack(self):
        """Interactive stack addition"""
        print("🆕 Adding a new stack to configuration")
        print("=" * 40)
        
        name = input("Stack name: ").strip()
        if not name:
            print("❌ Stack name is required")
            return
        
        description = input("Description: ").strip()
        category = input("Category (frontend/backend/database/etc): ").strip()
        website = input("Website URL: ").strip()
        repository = input("Repository URL: ").strip()
        
        # Determine source type
        source_type = None
        source_name = None
        
        if 'npmjs.com' in repository or 'npm' in repository.lower():
            source_type = 'npm'
            source_name = input("NPM package name: ").strip()
        elif 'pypi.org' in repository or 'python' in repository.lower():
            source_type = 'pypi'
            source_name = input("PyPI package name: ").strip()
        else:
            source_type = 'github'
            # Extract from repository URL
            if 'github.com' in repository:
                parts = repository.rstrip('/').split('/')
                if len(parts) >= 2:
                    source_name = f"{parts[-2]}/{parts[-1]}"
                else:
                    source_name = input("GitHub repo (owner/name): ").strip()
        
        tags = input("Tags (comma-separated): ").strip()
        tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
        
        # Load current config
        try:
            with open('kiro.config.json', 'r') as f:
                config = json.load(f)
        except FileNotFoundError:
            print("❌ kiro.config.json not found")
            return
        
        # Add new stack
        config['stacks'][name] = {
            'description': description,
            'category': category,
            'website': website,
            'repository': repository,
            'source_type': source_type,
            'source_name': source_name,
            'tags': tag_list
        }
        
        # Save config
        try:
            with open('kiro.config.json', 'w') as f:
                json.dump(config, f, indent=2)
            print(f"✅ Successfully added {name} to configuration")
            print("Run 'python cli.py update-stacks' to fetch its data")
        except Exception as e:
            print(f"❌ Error saving configuration: {e}")


def main():
    parser = argparse.ArgumentParser(description='Current Stack Tracker CLI')
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Update stacks command
    update_parser = subparsers.add_parser('update-stacks', help='Update stack data')
    update_parser.add_argument('--fast', action='store_true', 
                              help='Update only fast-moving stacks')
    
    # List stacks command
    list_parser = subparsers.add_parser('list', help='List all stacks')
    list_parser.add_argument('--category', help='Filter by category')
    
    # Show stack command
    show_parser = subparsers.add_parser('show', help='Show detailed stack info')
    show_parser.add_argument('name', help='Stack name')
    
    # Search command
    search_parser = subparsers.add_parser('search', help='Search stacks')
    search_parser.add_argument('query', help='Search query')
    
    # Trending command
    trending_parser = subparsers.add_parser('trending', help='Show trending stacks')
    trending_parser.add_argument('--sort-by', choices=['downloads', 'stars', 'forks'],
                                default='downloads', help='Sort metric')
    trending_parser.add_argument('--limit', type=int, default=10, help='Number of results')
    
    # Outdated command
    outdated_parser = subparsers.add_parser('outdated', help='Find outdated stacks')
    outdated_parser.add_argument('--days', type=int, default=7, 
                                help='Days threshold for outdated')
    
    # Add stack command
    subparsers.add_parser('add-stack', help='Add a new stack interactively')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    cli = CurrentCLI()
    
    try:
        if args.command == 'update-stacks':
            cli.update_stacks(fast_only=args.fast)
        elif args.command == 'list':
            cli.list_stacks(category=args.category)
        elif args.command == 'show':
            cli.show_stack(args.name)
        elif args.command == 'search':
            cli.search_stacks(args.query)
        elif args.command == 'trending':
            cli.trending_stacks(sort_by=args.sort_by, limit=args.limit)
        elif args.command == 'outdated':
            cli.outdated_stacks(days=args.days)
        elif args.command == 'add-stack':
            cli.add_stack()
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()