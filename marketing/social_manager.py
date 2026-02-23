#!/usr/bin/env python3
"""
Shabrang Social Media Integration Manager

Manages social media integrations within the GHL marketing funnel.
Handles cross-platform posting, engagement tracking, and viral sharing campaigns.

Features:
- Social media content scheduling
- Engagement tracking and scoring
- Cross-platform content distribution
- Viral sharing analytics
- Social proof collection

Usage:
  python social_manager.py --schedule CONTENT_ID  # Schedule content for social posting
  python social_manager.py --track EMAIL ACTION   # Track social engagement
  python social_manager.py --analytics           # Show social media analytics
  python social_manager.py --campaign CAMPAIGN   # Run viral sharing campaign
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

from funnel_manager import FunnelManager


@dataclass
class SocialContent:
    """Represents a piece of social media content."""
    content_id: str
    title: str
    excerpt: str
    image_url: str
    chapter_ref: str
    hashtags: List[str]
    call_to_action: str
    platforms: List[str]


@dataclass
class SocialCampaign:
    """Represents a viral sharing campaign."""
    campaign_id: str
    name: str
    content_sequence: List[str]  # Content IDs in order
    target_platforms: List[str]
    start_date: datetime
    duration_days: int
    goal: str
    status: str = "planned"


class SocialManager:
    """Manages social media integration for Shabrang marketing funnel."""

    def __init__(self, env: Dict[str, str]):
        self.env = env
        self.funnel_manager = FunnelManager(env)

        # Social media content library
        self.content_library = self._load_content_library()

        # Active campaigns
        self.campaigns = self._load_campaigns()

    def _load_content_library(self) -> Dict[str, SocialContent]:
        """Load the social media content library."""
        content_file = Path(__file__).parent / "social_content.json"
        if content_file.exists():
            data = json.loads(content_file.read_text())
            return {k: SocialContent(**v) for k, v in data.items()}
        return self._create_default_content_library()

    def _create_default_content_library(self) -> Dict[str, SocialContent]:
        """Create default social content library based on book chapters."""
        base_url = "https://shabrang.com"

        content = {
            "chapter1-quote1": SocialContent(
                content_id="chapter1-quote1",
                title="The Liquid Fortress",
                excerpt='"Shabrang is the avatar of the Persian Mind. He is the Carrier Wave."',
                image_url=f"{base_url}/images/chapter1-shabrang.jpg",
                chapter_ref="chapter1",
                hashtags=["#PersianHistory", "#FractalResonance", "#LiquidFortress"],
                call_to_action="Read Chapter 1 for free →",
                platforms=["twitter", "instagram", "linkedin"]
            ),
            "chapter1-quote2": SocialContent(
                content_id="chapter1-quote2",
                title="3,000 Years of Survival",
                excerpt='"States fall. Kings bleed. Cities crumble. But the Idea survives."',
                image_url=f"{base_url}/images/chapter1-survival.jpg",
                chapter_ref="chapter1",
                hashtags=["#PersianEmpire", "#CulturalSurvival", "#ImmortalIdeas"],
                call_to_action="Discover the secret →",
                platforms=["twitter", "instagram", "facebook"]
            ),
            "chapter3-binary": SocialContent(
                content_id="chapter3-binary",
                title="The First Binary",
                excerpt='"Persia invented the first binary: Crystal vs Water. Structure vs Flow."',
                image_url=f"{base_url}/images/chapter3-binary.jpg",
                chapter_ref="chapter3",
                hashtags=["#AncientWisdom", "#CrystalWater", "#PersianPhilosophy"],
                call_to_action="Unlock the ancient binary →",
                platforms=["twitter", "linkedin", "instagram"]
            ),
            "chapter5-thermodynamics": SocialContent(
                content_id="chapter5-thermodynamics",
                title="Thermodynamics of Truth",
                excerpt='"Truth is not found. Truth is forged in the fire of contradiction."',
                image_url=f"{base_url}/images/chapter5-truth.jpg",
                chapter_ref="chapter5",
                hashtags=["#Truth", "#Contradiction", "#Wisdom"],
                call_to_action="Explore the paradox →",
                platforms=["twitter", "instagram"]
            ),
            "chapter11-conquest": SocialContent(
                content_id="chapter11-conquest",
                title="The Art of Conquest",
                excerpt='"To conquer is to understand. To understand is to become."',
                image_url=f"{base_url}/images/chapter11-conquest.jpg",
                chapter_ref="chapter11",
                hashtags=["#Conquest", "#Understanding", "#Transformation"],
                call_to_action="Master the art →",
                platforms=["twitter", "linkedin", "facebook"]
            ),
            "chapter16-light": SocialContent(
                content_id="chapter16-light",
                title="The Light Within",
                excerpt='"The light you seek is already within you, waiting to be remembered."',
                image_url=f"{base_url}/images/chapter16-light.jpg",
                chapter_ref="chapter16",
                hashtags=["#InnerLight", "#SelfDiscovery", "#Awakening"],
                call_to_action="Find your light →",
                platforms=["instagram", "facebook"]
            ),
            "chapter25-garden": SocialContent(
                content_id="chapter25-garden",
                title="Garden in the Fire",
                excerpt='"Even in the heart of destruction, creation continues."',
                image_url=f"{base_url}/images/chapter25-garden.jpg",
                chapter_ref="chapter25",
                hashtags=["#Creation", "#Destruction", "#Resilience"],
                call_to_action="See the garden →",
                platforms=["twitter", "instagram", "linkedin"]
            )
        }

        # Save the content library
        content_file = Path(__file__).parent / "social_content.json"
        content_dict = {k: {
            "content_id": v.content_id,
            "title": v.title,
            "excerpt": v.excerpt,
            "image_url": v.image_url,
            "chapter_ref": v.chapter_ref,
            "hashtags": v.hashtags,
            "call_to_action": v.call_to_action,
            "platforms": v.platforms
        } for k, v in content.items()}

        content_file.write_text(json.dumps(content_dict, indent=2))
        return content

    def _load_campaigns(self) -> Dict[str, SocialCampaign]:
        """Load active social media campaigns."""
        campaigns_file = Path(__file__).parent / "social_campaigns.json"
        if campaigns_file.exists():
            data = json.loads(campaigns_file.read_text())
            return {k: SocialCampaign(**v) for k, v in data.items()}
        return {}

    def schedule_content(self, content_id: str, platforms: List[str] = None,
                        schedule_time: datetime = None) -> Dict[str, Any]:
        """
        Schedule social media content for posting.

        Args:
            content_id: ID of content to schedule
            platforms: List of platforms to post on (default: all configured)
            schedule_time: When to post (default: now)
        """
        if content_id not in self.content_library:
            return {"success": False, "error": f"Content {content_id} not found"}

        content = self.content_library[content_id]
        target_platforms = platforms or content.platforms

        if schedule_time is None:
            schedule_time = datetime.now()

        # In a real implementation, this would integrate with social media APIs
        # For now, we'll create a scheduling record and log the intent

        schedule_record = {
            "content_id": content_id,
            "platforms": target_platforms,
            "scheduled_time": schedule_time.isoformat(),
            "status": "scheduled",
            "content": {
                "title": content.title,
                "excerpt": content.excerpt,
                "image_url": content.image_url,
                "hashtags": content.hashtags,
                "call_to_action": content.call_to_action
            }
        }

        # Save to scheduling queue
        self._save_to_schedule(schedule_record)

        return {
            "success": True,
            "schedule_record": schedule_record,
            "message": f"Content scheduled for {len(target_platforms)} platforms"
        }

    def _save_to_schedule(self, schedule_record: Dict[str, Any]):
        """Save scheduling record to queue file."""
        schedule_file = Path(__file__).parent / "social_schedule.json"
        existing = []

        if schedule_file.exists():
            existing = json.loads(schedule_file.read_text())

        existing.append(schedule_record)
        schedule_file.write_text(json.dumps(existing, indent=2))

    def track_engagement(self, email: str, content_id: str, action: str,
                        platform: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Track social media engagement and update funnel.

        Args:
            email: User email (if known)
            content_id: Which content piece was engaged with
            action: share, like, comment, click, save, etc.
            platform: Platform where engagement occurred
            metadata: Additional engagement data
        """
        # Update funnel manager with social engagement
        result = self.funnel_manager.track_social_engagement(
            email=email,
            action=action,
            platform=platform,
            content_id=content_id
        )

        if result["success"]:
            # Log detailed social engagement
            engagement_record = {
                "timestamp": datetime.now().isoformat(),
                "email": email,
                "content_id": content_id,
                "action": action,
                "platform": platform,
                "funnel_stage": result.get("new_stage"),
                "engagement_score": result.get("engagement_score"),
                "metadata": metadata or {}
            }

            self._log_engagement(engagement_record)

        return result

    def _log_engagement(self, engagement_record: Dict[str, Any]):
        """Log social engagement to file."""
        log_file = Path(__file__).parent / "social_engagement.log"
        existing = []

        if log_file.exists():
            try:
                existing = [json.loads(line) for line in log_file.read_text().splitlines() if line.strip()]
            except:
                existing = []

        existing.append(engagement_record)
        log_file.write_text("\n".join(json.dumps(record) for record in existing) + "\n")

    def run_viral_campaign(self, campaign_name: str, content_sequence: List[str],
                          duration_days: int = 7) -> Dict[str, Any]:
        """
        Launch a viral sharing campaign.

        Args:
            campaign_name: Name of the campaign
            content_sequence: List of content IDs to post in sequence
            duration_days: How long the campaign should run
        """
        campaign_id = f"campaign_{int(datetime.now().timestamp())}"

        campaign = SocialCampaign(
            campaign_id=campaign_id,
            name=campaign_name,
            content_sequence=content_sequence,
            target_platforms=["twitter", "instagram", "linkedin"],
            start_date=datetime.now(),
            duration_days=duration_days,
            goal="Drive traffic to landing page and increase shares",
            status="active"
        )

        # Schedule content for the campaign
        scheduled_posts = []
        for i, content_id in enumerate(content_sequence):
            post_time = datetime.now() + timedelta(days=i)
            result = self.schedule_content(content_id, schedule_time=post_time)
            if result["success"]:
                scheduled_posts.append(result["schedule_record"])

        # Save campaign
        self.campaigns[campaign_id] = campaign
        self._save_campaigns()

        return {
            "success": True,
            "campaign": {
                "id": campaign_id,
                "name": campaign_name,
                "scheduled_posts": len(scheduled_posts),
                "duration_days": duration_days,
                "start_date": campaign.start_date.isoformat()
            },
            "message": f"Viral campaign '{campaign_name}' launched with {len(scheduled_posts)} posts"
        }

    def _save_campaigns(self):
        """Save campaigns to file."""
        campaigns_file = Path(__file__).parent / "social_campaigns.json"
        campaigns_dict = {k: {
            "campaign_id": v.campaign_id,
            "name": v.name,
            "content_sequence": v.content_sequence,
            "target_platforms": v.target_platforms,
            "start_date": v.start_date.isoformat(),
            "duration_days": v.duration_days,
            "goal": v.goal,
            "status": v.status
        } for k, v in self.campaigns.items()}

        campaigns_file.write_text(json.dumps(campaigns_dict, indent=2))

    def get_social_analytics(self) -> Dict[str, Any]:
        """Get comprehensive social media analytics."""
        try:
            # Read engagement log
            log_file = Path(__file__).parent / "social_engagement.log"
            engagements = []

            if log_file.exists():
                for line in log_file.read_text().splitlines():
                    if line.strip():
                        try:
                            engagements.append(json.loads(line))
                        except:
                            continue

            # Analyze engagement data
            platform_stats = {}
            content_stats = {}
            action_stats = {}
            daily_stats = {}

            for engagement in engagements:
                platform = engagement.get("platform", "unknown")
                content_id = engagement.get("content_id", "unknown")
                action = engagement.get("action", "unknown")
                timestamp = engagement.get("timestamp", "")

                # Platform stats
                if platform not in platform_stats:
                    platform_stats[platform] = {"total": 0, "actions": {}}
                platform_stats[platform]["total"] += 1
                platform_stats[platform]["actions"][action] = platform_stats[platform]["actions"].get(action, 0) + 1

                # Content stats
                if content_id not in content_stats:
                    content_stats[content_id] = {"total": 0, "actions": {}}
                content_stats[content_id]["total"] += 1
                content_stats[content_id]["actions"][action] = content_stats[content_id]["actions"].get(action, 0) + 1

                # Action stats
                action_stats[action] = action_stats.get(action, 0) + 1

                # Daily stats
                if timestamp:
                    try:
                        date = timestamp.split("T")[0]
                        if date not in daily_stats:
                            daily_stats[date] = 0
                        daily_stats[date] += 1
                    except:
                        pass

            return {
                "success": True,
                "total_engagements": len(engagements),
                "platform_breakdown": platform_stats,
                "content_performance": content_stats,
                "action_breakdown": action_stats,
                "daily_activity": daily_stats,
                "top_content": sorted(content_stats.items(), key=lambda x: x[1]["total"], reverse=True)[:5],
                "most_engaged_platform": max(platform_stats.items(), key=lambda x: x[1]["total"]) if platform_stats else None
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_content_suggestions(self, funnel_stage: str) -> List[Dict[str, Any]]:
        """Get content suggestions based on funnel stage."""
        stage_content_map = {
            "awareness": ["chapter1-quote1", "chapter1-quote2"],
            "interest": ["chapter3-binary", "chapter5-thermodynamics"],
            "curious": ["chapter11-conquest", "chapter16-light"],
            "lead": ["chapter25-garden"],
            "nurture": ["chapter1-quote1", "chapter3-binary", "chapter11-conquest"],
            "premium": ["chapter16-light", "chapter25-garden"],
            "engaged": ["chapter5-thermodynamics", "chapter11-conquest"],
            "advocate": ["chapter1-quote1", "chapter25-garden"]
        }

        content_ids = stage_content_map.get(funnel_stage, ["chapter1-quote1"])
        return [
            {
                "content_id": cid,
                "title": self.content_library[cid].title,
                "excerpt": self.content_library[cid].excerpt,
                "hashtags": self.content_library[cid].hashtags,
                "platforms": self.content_library[cid].platforms
            }
            for cid in content_ids if cid in self.content_library
        ]


def main():
    env = {}  # Load environment variables as in funnel_manager

    # Load env vars
    env_paths = [
        Path(__file__).parent / ".env",
        Path(__file__).parent.parent.parent / ".env",
        Path.cwd() / ".env",
    ]

    for dotenv_path in env_paths:
        if dotenv_path.exists():
            for line in dotenv_path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                env.setdefault(key.strip(), value.strip())

    if len(sys.argv) < 2:
        print(__doc__)
        print("\nCommands:")
        print("  --schedule CONTENT_ID [PLATFORMS]    Schedule content for posting")
        print("  --track EMAIL ACTION PLATFORM       Track social engagement")
        print("  --analytics                         Show social media analytics")
        print("  --campaign NAME CONTENT_IDS         Launch viral campaign")
        print("  --suggest STAGE                     Get content suggestions")
        print("  --list-content                      List available content")
        sys.exit(1)

    try:
        manager = SocialManager(env)
    except Exception as e:
        print(f"Setup error: {e}")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "--schedule":
        if len(sys.argv) < 3:
            print("Usage: python social_manager.py --schedule CONTENT_ID [PLATFORM1,PLATFORM2,...]")
            sys.exit(1)

        content_id = sys.argv[2]
        platforms = sys.argv[3].split(",") if len(sys.argv) > 3 else None

        result = manager.schedule_content(content_id, platforms)
        print(json.dumps(result, indent=2))

    elif cmd == "--track":
        if len(sys.argv) < 5:
            print("Usage: python social_manager.py --track EMAIL ACTION PLATFORM [CONTENT_ID]")
            sys.exit(1)

        email = sys.argv[2]
        action = sys.argv[3]
        platform = sys.argv[4]
        content_id = sys.argv[5] if len(sys.argv) > 5 else None

        result = manager.track_engagement(email, content_id, action, platform)
        print(json.dumps(result, indent=2))

    elif cmd == "--analytics":
        result = manager.get_social_analytics()
        print(json.dumps(result, indent=2))

    elif cmd == "--campaign":
        if len(sys.argv) < 4:
            print("Usage: python social_manager.py --campaign NAME CONTENT_ID1,CONTENT_ID2,... [DURATION_DAYS]")
            sys.exit(1)

        name = sys.argv[2]
        content_ids = sys.argv[3].split(",")
        duration = int(sys.argv[4]) if len(sys.argv) > 4 else 7

        result = manager.run_viral_campaign(name, content_ids, duration)
        print(json.dumps(result, indent=2))

    elif cmd == "--suggest":
        if len(sys.argv) < 3:
            print("Usage: python social_manager.py --suggest FUNNEL_STAGE")
            sys.exit(1)

        stage = sys.argv[2]
        suggestions = manager.get_content_suggestions(stage)
        print(json.dumps(suggestions, indent=2))

    elif cmd == "--list-content":
        content = manager.content_library
        print(f"Available content pieces: {len(content)}")
        for cid, item in content.items():
            print(f"  {cid}: {item.title} ({', '.join(item.platforms)})")

    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
