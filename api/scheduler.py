import schedule
import time
import threading
from datetime import datetime, timedelta
from crawler import StackCrawler
from storage import JSONStorage

class StackScheduler:
    def __init__(self):
        self.crawler = StackCrawler()
        self.storage = JSONStorage()
        self.running = False
        self.thread = None
    
    def update_all_stacks_job(self):
        """Job function to update all stacks (weekly)"""
        print(f"[{datetime.now()}] Starting weekly full stack update...")
        try:
            stacks = self.crawler.crawl_all_stacks()
            
            # Merge with existing stacks to preserve history
            existing_stacks = self.storage.load_stacks()
            for name, stack in stacks.items():
                existing_stacks[name] = stack
            
            self.storage.save_stacks(existing_stacks)
            print(f"[{datetime.now()}] Successfully updated {len(stacks)} stacks")
        except Exception as e:
            print(f"[{datetime.now()}] Error during weekly update: {e}")
    
    def update_fast_moving_stacks_job(self):
        """Job function to update fast-moving stacks (daily)"""
        print(f"[{datetime.now()}] Starting daily fast-moving stack update...")
        try:
            fast_stacks = self.crawler.crawl_fast_moving_stacks()
            
            # Merge with existing stacks
            existing_stacks = self.storage.load_stacks()
            for name, stack in fast_stacks.items():
                existing_stacks[name] = stack
            
            self.storage.save_stacks(existing_stacks)
            print(f"[{datetime.now()}] Successfully updated {len(fast_stacks)} fast-moving stacks")
        except Exception as e:
            print(f"[{datetime.now()}] Error during daily update: {e}")
    
    def start_scheduler(self):
        """Start the background scheduler"""
        if self.running:
            return
        
        # Schedule weekly updates (every Sunday at midnight UTC)
        schedule.every().sunday.at("00:00").do(self.update_all_stacks_job)
        
        # Schedule daily updates for fast-moving stacks (every day at 2 AM UTC)
        schedule.every().day.at("02:00").do(self.update_fast_moving_stacks_job)
        
        self.running = True
        self.thread = threading.Thread(target=self._run_scheduler, daemon=True)
        self.thread.start()
        print("Stack scheduler started:")
        print("  - Weekly full updates: Sundays at 00:00 UTC")
        print("  - Daily fast-moving updates: Every day at 02:00 UTC")
    
    def stop_scheduler(self):
        """Stop the background scheduler"""
        self.running = False
        schedule.clear()
        print("Stack scheduler stopped")
    
    def _run_scheduler(self):
        """Internal method to run the scheduler loop"""
        while self.running:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    
    def manual_update(self, fast_only: bool = False):
        """Trigger manual update"""
        if fast_only:
            print("Manual fast-moving stack update triggered...")
            self.update_fast_moving_stacks_job()
        else:
            print("Manual full stack update triggered...")
            self.update_all_stacks_job()
    
    def get_outdated_stacks(self, threshold_days: int = 7) -> dict:
        """Get stacks that haven't been checked in threshold_days"""
        stacks = self.storage.load_stacks()
        outdated = {}
        threshold_date = datetime.now() - timedelta(days=threshold_days)
        
        for name, stack in stacks.items():
            if not stack.last_checked or stack.last_checked < threshold_date:
                outdated[name] = stack
        
        return outdated

# Global scheduler instance
scheduler = StackScheduler()