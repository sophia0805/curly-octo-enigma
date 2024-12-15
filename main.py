import praw
import random
from typing import List, Dict
from datetime import datetime, timedelta
import json
import os
from previous_video_maker import RedditVideoMaker  # Assuming previous code is saved as previous_video_maker.py

class RedditAITAScraper:
    def __init__(self, client_id: str, client_secret: str, user_agent: str):
        """Initialize Reddit API connection"""
        self.reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent
        )
        self.video_maker = RedditVideoMaker()
        
    def get_top_posts(self, time_filter: str = 'day', limit: int = 10) -> List[Dict]:
        """Get top posts from r/AmITheAsshole"""
        subreddit = self.reddit.subreddit('AmITheAsshole')
        posts = []
        
        for submission in subreddit.top(time_filter=time_filter, limit=limit):
            # Skip posts that are too short
            if len(submission.selftext) < 100:
                continue
                
            # Skip posts that are removed or deleted
            if submission.selftext in ['[removed]', '[deleted]']:
                continue
                
            post = {
                'id': submission.id,
                'title': submission.title,
                'text': submission.selftext,
                'score': submission.score,
                'url': f"https://reddit.com{submission.permalink}",
                'created_utc': submission.created_utc,
                'num_comments': submission.num_comments
            }
            posts.append(post)
            
        return posts
        
    def save_posts(self, posts: List[Dict], filename: str = 'aita_posts.json'):
        """Save posts to JSON file to avoid duplicates"""
        existing_posts = []
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                existing_posts = json.load(f)
                
        # Add new posts, avoid duplicates
        existing_ids = {post['id'] for post in existing_posts}
        new_posts = [post for post in posts if post['id'] not in existing_ids]
        all_posts = existing_posts + new_posts
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(all_posts, f, indent=2)
            
        return new_posts
        
    def format_post_for_video(self, post: Dict) -> str:
        """Format post text for video narration"""
        formatted_text = f"{post['title']}\n\n{post['text']}"
        
        # Clean up common Reddit formatting
        replacements = {
            'AITA': 'Am I The Asshole',
            'TL;DR': 'Too Long, Didn\'t Read',
            '\n\n': '\n',  # Reduce multiple newlines
        }
        
        for old, new in replacements.items():
            formatted_text = formatted_text.replace(old, new)
            
        return formatted_text
        
    def create_batch_videos(self, num_videos: int = 5, time_filter: str = 'week'):
        """Create multiple videos from top AITA posts"""
        # Get posts
        posts = self.get_top_posts(time_filter=time_filter, limit=num_videos * 2)
        new_posts = self.save_posts(posts)
        
        # Create videos for new posts
        videos_created = []
        for i, post in enumerate(new_posts[:num_videos]):
            try:
                # Format post text
                video_text = self.format_post_for_video(post)
                
                # Generate filenames
                base_filename = f"aita_video_{post['id']}"
                video_path = f"videos/{base_filename}.mp4"
                captioned_path = f"videos/{base_filename}_captioned.mp4"
                
                # Create video directory if it doesn't exist
                os.makedirs('videos', exist_ok=True)
                
                # Create video
                print(f"Creating video {i+1}/{num_videos} - Post ID: {post['id']}")
                self.video_maker.create_video(video_text, video_path)
                
                # Add captions
                self.video_maker.add_captions(video_path, video_text, captioned_path)
                
                videos_created.append({
                    'post_id': post['id'],
                    'title': post['title'],
                    'video_path': captioned_path,
                    'url': post['url']
                })
                
            except Exception as e:
                print(f"Error creating video for post {post['id']}: {str(e)}")
                continue
                
        return videos_created

def main():
    # Initialize scraper with your Reddit API credentials
    scraper = RedditAITAScraper(
        client_id='YOUR_CLIENT_ID',
        client_secret='YOUR_CLIENT_SECRET',
        user_agent='AITA_Video_Generator/1.0'
    )
    
    # Create 5 videos from top posts of the week
    created_videos = scraper.create_batch_videos(
        num_videos=5,
        time_filter='week'
    )
    
    # Print summary
    print("\nVideos created:")
    for video in created_videos:
        print(f"\nTitle: {video['title']}")
        print(f"Video saved as: {video['video_path']}")
        print(f"Original post: {video['url']}")

if __name__ == "__main__":
    main()