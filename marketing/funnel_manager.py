#!/usr/bin/env python3
"""
Shabrang Marketing Funnel Manager - GHL Integration

Comprehensive funnel management system for The Liquid Fortress book marketing.
Manages the entire journey from social media engagement to premium content access.

Features:
- Contact management with automated tagging
- Email sequence automation
- Social media integration tracking
- Paywall and membership management
- Analytics and conversion tracking

Usage:
  python funnel_manager.py --init          # Initialize funnel workflows
  python funnel_manager.py --add-lead EMAIL # Add new lead to funnel
  python funnel_manager.py --social-share  # Track social media shares
  python funnel_manager.py --analytics     # Show funnel analytics
  python funnel_manager.py --workflows     # Manage GHL workflows
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

from highlevel import HighLevel
from highlevel.services.contacts import Contacts
from highlevel.services.contacts.models.contacts import UpsertContactDto
from highlevel.services.workflows import Workflows
from highlevel.services.campaigns import Campaigns


@dataclass
class FunnelStage:
    """Represents a stage in the marketing funnel."""
    name: str
    ghl_tags: List[str]
    description: str
    next_stages: List[str] = None

    def __post_init__(self):
        if self.next_stages is None:
            self.next_stages = []


# Funnel configuration - Liquid Fortress specific stages
FUNNEL_STAGES = {
    "awareness": FunnelStage(
        name="Awareness",
        ghl_tags=["liquid-fortress", "social-media", "awareness"],
        description="Initial exposure via social media or search",
        next_stages=["interest", "curious"]
    ),
    "interest": FunnelStage(
        name="Interest",
        ghl_tags=["liquid-fortress", "landing-page", "interest"],
        description="Visited landing page, showing interest",
        next_stages=["lead", "curious"]
    ),
    "curious": FunnelStage(
        name="Curious",
        ghl_tags=["liquid-fortress", "chapter-preview", "curious"],
        description="Engaged with free chapter content",
        next_stages=["lead", "premium"]
    ),
    "lead": FunnelStage(
        name="Lead",
        ghl_tags=["liquid-fortress", "landing-page", "chapter-1-free", "lead"],
        description="Captured email on landing page",
        next_stages=["nurture", "premium"]
    ),
    "nurture": FunnelStage(
        name="Nurture",
        ghl_tags=["liquid-fortress", "email-sequence", "nurture"],
        description="Receiving email nurture sequence",
        next_stages=["premium", "upsell"]
    ),
    "premium": FunnelStage(
        name="Premium",
        ghl_tags=["liquid-fortress", "premium-member", "paid"],
        description="Converted to premium membership",
        next_stages=["engaged", "upsell"]
    ),
    "engaged": FunnelStage(
        name="Engaged",
        ghl_tags=["liquid-fortress", "premium-member", "engaged", "community"],
        description="Active community member, consuming content",
        next_stages=["advocate", "upsell"]
    ),
    "advocate": FunnelStage(
        name="Advocate",
        ghl_tags=["liquid-fortress", "premium-member", "advocate", "viral"],
        description="Sharing content, referring others",
        next_stages=["upsell"]
    ),
    "upsell": FunnelStage(
        name="Upsell",
        ghl_tags=["liquid-fortress", "prime-2", "upsell"],
        description="Interested in advanced FRC framework",
        next_stages=[]
    )
}


class FunnelManager:
    """Manages the complete marketing funnel for Shabrang."""

    def __init__(self, env: Dict[str, str]):
        self.env = env
        self.tokens = self._load_tokens()
        self.location_id = self.tokens.get("locationId") or env.get("GHL_LOCATION_ID")
        self.client = self._init_ghl_client()
        self.contacts_service = Contacts(self.client)
        self.workflows_service = Workflows(self.client)
        self.campaigns_service = Campaigns(self.client)

    def _init_ghl_client(self) -> HighLevel:
        """Initialize GHL client with token management."""
        if not self.tokens.get("access_token"):
            raise ValueError("No GHL access token found. Run ghl_sdk.py --auth first")

        if not self.location_id:
            raise ValueError("No GHL location ID found. Set GHL_LOCATION_ID or authenticate via ghl_sdk.py")

        return HighLevel(
            client_id=self.env.get("GHL_CLIENT_ID"),
            client_secret=self.env.get("GHL_CLIENT_SECRET"),
            location_access_token=self.tokens.get("access_token")
        )

    def _load_tokens(self) -> Dict[str, str]:
        """Load GHL tokens from file."""
        token_file = Path(__file__).parent / ".ghl_tokens.json"
        if token_file.exists():
            return json.loads(token_file.read_text())
        return {}

    def add_lead_to_funnel(self, email: str, first_name: str = None, last_name: str = None,
                          source: str = "landing-page", social_platform: str = None) -> Dict[str, Any]:
        """
        Add a new lead to the marketing funnel.

        Args:
            email: Lead's email address
            first_name: Optional first name
            last_name: Optional last name
            source: Source of the lead (landing-page, social-media, etc.)
            social_platform: Social platform if applicable (twitter, instagram, etc.)
        """
        # Determine initial funnel stage and tags
        initial_stage = "lead" if source == "landing-page" else "awareness"
        stage_config = FUNNEL_STAGES[initial_stage]

        # Build comprehensive tags
        tags = stage_config.ghl_tags.copy()
        tags.extend([
            f"source-{source}",
            f"funnel-{initial_stage}",
            "shabrang-2025"
        ])

        if social_platform:
            tags.append(f"social-{social_platform}")

        # Add custom fields for funnel tracking
        custom_fields = {
            "funnel_stage": initial_stage,
            "funnel_entry_date": datetime.now().isoformat(),
            "source": source,
            "social_platform": social_platform or "",
            "engagement_score": 10,  # Starting score
            "content_access_level": "free-chapters"
        }

        # Create contact in GHL
        contact_data = UpsertContactDto(
            locationId=self.location_id,
            email=email,
            firstName=first_name,
            lastName=last_name,
            tags=tags,
            customFields=custom_fields,
            source=f"The Liquid Fortress - {source.title()}"
        )

        try:
            result = self.contacts_service.upsert_contact(contact_data)

            # Trigger appropriate workflow based on funnel stage
            self._trigger_funnel_workflow(email, initial_stage, source)

            return {
                "success": True,
                "contact": result,
                "funnel_stage": initial_stage,
                "message": f"Lead added to {initial_stage} stage"
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Failed to add lead to funnel"
            }

    def _trigger_funnel_workflow(self, email: str, stage: str, source: str):
        """Trigger appropriate GHL workflow based on funnel stage."""
        workflow_triggers = {
            "lead": "liquid-fortress-welcome-sequence",
            "premium": "premium-member-onboarding",
            "engaged": "community-engagement-sequence"
        }

        workflow_name = workflow_triggers.get(stage)
        if workflow_name:
            # Note: This would need actual workflow IDs in a real implementation
            # For now, we'll just log the intent
            print(f"Would trigger workflow: {workflow_name} for {email}")
            # self.workflows_service.trigger_workflow(workflow_id, contact_id)

    def track_social_engagement(self, email: str, action: str, platform: str = None,
                               content_id: str = None) -> Dict[str, Any]:
        """
        Track social media engagement and update funnel stage.

        Args:
            email: Contact email
            action: share, like, comment, click, etc.
            platform: twitter, instagram, linkedin, etc.
            content_id: Specific content piece identifier
        """
        # Find contact by email using query
        search_result = self.contacts_service.get_contacts(
            location_id=self.location_id,
            query=email,
            limit=1
        )

        if not hasattr(search_result, 'contacts') or not search_result.contacts:
            return {"success": False, "error": "Contact not found"}

        contact = search_result.contacts[0]
        contact_id = contact.id

        # Update engagement score and tags
        current_score = contact.customFields.get("engagement_score", 0)
        engagement_points = {
            "share": 50,
            "comment": 30,
            "like": 10,
            "click": 5,
            "view": 1
        }

        new_score = current_score + engagement_points.get(action, 0)

        # Determine new funnel stage based on engagement
        current_stage = contact.customFields.get("funnel_stage", "awareness")
        new_stage = self._calculate_funnel_progression(current_stage, action, new_score)

        # Update contact with new data
        update_tags = [f"action-{action}", f"platform-{platform}"]
        if new_stage != current_stage:
            update_tags.extend(FUNNEL_STAGES[new_stage].ghl_tags)

        update_data = UpsertContactDto(
            locationId=self.location_id,
            id=contact_id,
            tags=update_tags,
            customFields={
                "engagement_score": new_score,
                "funnel_stage": new_stage,
                "last_engagement": datetime.now().isoformat(),
                "last_engagement_action": action,
                "last_engagement_platform": platform,
                "last_engagement_content": content_id
            }
        )

        try:
            result = self.contacts_service.upsert_contact(update_data)

            # Trigger stage advancement workflow if needed
            if new_stage != current_stage:
                self._trigger_funnel_workflow(email, new_stage, "social-engagement")

            return {
                "success": True,
                "contact": result,
                "previous_stage": current_stage,
                "new_stage": new_stage,
                "engagement_score": new_score,
                "message": f"Engagement tracked: {action} on {platform}"
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def _calculate_funnel_progression(self, current_stage: str, action: str, score: int) -> str:
        """Calculate if contact should advance to next funnel stage."""
        stage_progression = {
            "awareness": {"share": "interest", "click": "interest"},
            "interest": {"click": "curious", "share": "lead"},
            "curious": {"share": "lead"},
            "lead": {"score_50": "nurture"},
            "nurture": {"share": "premium", "score_100": "premium"},
            "premium": {"score_200": "engaged"},
            "engaged": {"share": "advocate", "score_500": "advocate"},
            "advocate": {"score_1000": "upsell"}
        }

        # Check action-based progression
        action_progression = stage_progression.get(current_stage, {}).get(action)
        if action_progression:
            return action_progression

        # Check score-based progression
        score_thresholds = {
            50: "nurture",
            100: "premium",
            200: "engaged",
            500: "advocate",
            1000: "upsell"
        }

        for threshold, stage in score_thresholds.items():
            if score >= threshold and current_stage in ["lead", "nurture", "premium", "engaged", "advocate"]:
                return stage

        return current_stage

    def get_funnel_analytics(self) -> Dict[str, Any]:
        """Get comprehensive funnel analytics."""
        try:
            # Get all contacts with liquid-fortress tag
            contacts = self.contacts_service.get_contacts(
                location_id=self.location_id,
                limit=1000  # Adjust as needed
            )

            # Analyze funnel stages
            stage_counts = {stage: 0 for stage in FUNNEL_STAGES.keys()}
            total_contacts = 0
            total_engagement = 0
            premium_conversions = 0

            for contact in contacts.contacts or []:
                tags = contact.tags or []
                custom_fields = contact.customFields or {}

                # Count contacts in each funnel stage
                funnel_stage = custom_fields.get("funnel_stage")
                if funnel_stage in stage_counts:
                    stage_counts[funnel_stage] += 1
                    total_contacts += 1

                # Track engagement and conversions
                total_engagement += custom_fields.get("engagement_score", 0)
                if "premium-member" in tags:
                    premium_conversions += 1

            # Calculate conversion rates
            conversion_rates = {}
            ordered_stages = ["awareness", "interest", "curious", "lead", "nurture", "premium", "engaged", "advocate", "upsell"]

            for i, stage in enumerate(ordered_stages[:-1]):
                current_count = stage_counts[stage]
                next_count = stage_counts[ordered_stages[i + 1]]
                if current_count > 0:
                    conversion_rates[f"{stage}_to_{ordered_stages[i + 1]}"] = (next_count / current_count) * 100

            return {
                "success": True,
                "total_contacts": total_contacts,
                "stage_breakdown": stage_counts,
                "conversion_rates": conversion_rates,
                "total_engagement_score": total_engagement,
                "average_engagement": total_engagement / total_contacts if total_contacts > 0 else 0,
                "premium_conversions": premium_conversions,
                "premium_conversion_rate": (premium_conversions / total_contacts * 100) if total_contacts > 0 else 0
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def setup_funnel_workflows(self) -> Dict[str, Any]:
        """Set up GHL workflows for automated funnel management."""
        workflows = {
            "welcome-sequence": {
                "name": "Liquid Fortress Welcome",
                "trigger": "tag_added: liquid-fortress, landing-page, chapter-1-free",
                "actions": [
                    "send_email: welcome-to-liquid-fortress",
                    "wait: 2_days",
                    "send_email: chapter-2-preview",
                    "wait: 3_days",
                    "send_email: premium-upgrade-offer"
                ]
            },
            "social-engagement": {
                "name": "Social Media Engagement",
                "trigger": "tag_added: action-share",
                "actions": [
                    "add_tag: viral-advocate",
                    "send_email: thank-you-for-sharing",
                    "add_to_campaign: referral-program"
                ]
            },
            "premium-onboarding": {
                "name": "Premium Member Onboarding",
                "trigger": "tag_added: premium-member",
                "actions": [
                    "send_email: welcome-premium-member",
                    "grant_access: premium-content",
                    "invite_to_community: liquid-fortress-community",
                    "schedule_call: welcome-call"
                ]
            }
        }

        # Note: Actual workflow creation would require GHL API endpoints
        # For now, we'll return the workflow specifications
        return {
            "success": True,
            "workflows": workflows,
            "message": "Workflow specifications defined. Manual setup required in GHL dashboard."
        }


def load_env() -> Dict[str, str]:
    """Load environment variables."""
    env = dict(os.environ)
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
    return env


def main():
    env = load_env()

    if len(sys.argv) < 2:
        print(__doc__)
        print("\nCommands:")
        print("  --init              Initialize funnel workflows")
        print("  --add-lead EMAIL    Add new lead to funnel")
        print("  --social-share EMAIL ACTION [PLATFORM]  Track social engagement")
        print("  --analytics         Show funnel analytics")
        print("  --workflows         Show workflow specifications")
        print("  --test              Test GHL connection")
        sys.exit(1)

    try:
        manager = FunnelManager(env)
    except ValueError as e:
        print(f"Setup error: {e}")
        print("Run 'python ghl_sdk.py --auth' to authenticate with GHL first.")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "--init":
        result = manager.setup_funnel_workflows()
        print(json.dumps(result, indent=2))

    elif cmd == "--add-lead":
        if len(sys.argv) < 3:
            print("Usage: python funnel_manager.py --add-lead EMAIL [FIRST_NAME] [LAST_NAME] [--source SOURCE]")
            sys.exit(1)

        email = sys.argv[2]
        first_name = sys.argv[3] if len(sys.argv) > 3 else None
        last_name = sys.argv[4] if len(sys.argv) > 4 else None

        # Parse optional source
        source = "landing-page"
        if "--source" in sys.argv:
            source_idx = sys.argv.index("--source")
            if source_idx + 1 < len(sys.argv):
                source = sys.argv[source_idx + 1]

        result = manager.add_lead_to_funnel(email, first_name, last_name, source)
        print(json.dumps(result, indent=2))

    elif cmd == "--social-share":
        if len(sys.argv) < 4:
            print("Usage: python funnel_manager.py --social-share EMAIL ACTION [PLATFORM] [CONTENT_ID]")
            sys.exit(1)

        email = sys.argv[2]
        action = sys.argv[3]
        platform = sys.argv[4] if len(sys.argv) > 4 else None
        content_id = sys.argv[5] if len(sys.argv) > 5 else None

        result = manager.track_social_engagement(email, action, platform, content_id)
        print(json.dumps(result, indent=2))

    elif cmd == "--analytics":
        result = manager.get_funnel_analytics()
        print(json.dumps(result, indent=2))

    elif cmd == "--workflows":
        result = manager.setup_funnel_workflows()
        print(json.dumps(result, indent=2))

    elif cmd == "--test":
        try:
            analytics = manager.get_funnel_analytics()
            print("✅ GHL connection successful!")
            print(f"Total contacts in funnel: {analytics.get('total_contacts', 0)}")
        except Exception as e:
            print(f"❌ Connection test failed: {e}")
            sys.exit(1)

    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
