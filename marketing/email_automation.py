#!/usr/bin/env python3
"""
Shabrang Email Automation System

Automated email sequences for the Liquid Fortress marketing funnel.
Integrates with GHL workflows and funnel progression.

Features:
- Welcome sequences for new leads
- Nurture campaigns for prospects
- Premium onboarding sequences
- Re-engagement campaigns
- A/B testing capabilities

Usage:
  python email_automation.py --sequence SEQUENCE_NAME  # Run email sequence
  python email_automation.py --test EMAIL              # Send test email
  python email_automation.py --analytics               # Show email performance
  python email_automation.py --schedule                # Schedule pending emails
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from funnel_manager import FunnelManager


@dataclass
class EmailTemplate:
    """Represents an email template."""
    template_id: str
    subject: str
    html_content: str
    text_content: str
    tags: List[str]
    variables: List[str]  # Dynamic variables like {{first_name}}, {{chapter_link}}


@dataclass
class EmailSequence:
    """Represents an email sequence."""
    sequence_id: str
    name: str
    trigger_stage: str
    emails: List[Dict[str, Any]]  # List of {"delay_days": int, "template_id": str}
    conditions: List[str]  # Conditions for sequence execution


class EmailAutomation:
    """Manages automated email sequences for the marketing funnel."""

    def __init__(self, env: Dict[str, str]):
        self.env = env
        self.funnel_manager = FunnelManager(env)

        # Load email templates and sequences
        self.templates = self._load_email_templates()
        self.sequences = self._load_email_sequences()

    def _load_email_templates(self) -> Dict[str, EmailTemplate]:
        """Load email templates from file."""
        templates_file = Path(__file__).parent / "email_templates.json"
        if templates_file.exists():
            data = json.loads(templates_file.read_text())
            return {k: EmailTemplate(**v) for k, v in data.items()}
        return self._create_default_templates()

    def _create_default_templates(self) -> Dict[str, EmailTemplate]:
        """Create default email templates for Liquid Fortress."""
        templates = {
            "welcome-free-chapter": EmailTemplate(
                template_id="welcome-free-chapter",
                subject="Welcome to The Liquid Fortress - Your Free Chapter Awaits",
                html_content="""
                <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://shabrang.com/images/shabrang_logo.png" alt="Shabrang" style="max-width: 200px;">
                    </div>

                    <h1 style="color: #C9A227; text-align: center; font-family: 'Cinzel', serif;">
                        Welcome to The Liquid Fortress
                    </h1>

                    <p>Dear {{first_name}},</p>

                    <p>Thank you for your interest in <em>The Liquid Fortress</em> — a structural history of the Persian mind that survived 3,000 years of invasion.</p>

                    <p>I've prepared your <strong>free access</strong> to the first chapter: <em>The Fortress and the Corridor</em></p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{chapter_1_link}}" style="background: #C9A227; color: #1A1A18; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Read Chapter 1 Now
                        </a>
                    </div>

                    <p>In this chapter, you'll discover:</p>
                    <ul>
                        <li>The Persian survival anomaly</li>
                        <li>The concept of the "Liquid Fortress"</li>
                        <li>Why empires fall but ideas endure</li>
                    </ul>

                    <p>Next week, I'll send you Chapter 2: <em>The Lens of FRC</em></p>

                    <p>With enduring curiosity,<br>
                    <em>The Shabrang Project</em></p>
                </div>
                """,
                text_content="""
                Welcome to The Liquid Fortress

                Dear {{first_name}},

                Thank you for your interest in The Liquid Fortress — a structural history of the Persian mind that survived 3,000 years of invasion.

                I've prepared your FREE access to the first chapter: The Fortress and the Corridor

                Read it here: {{chapter_1_link}}

                In this chapter, you'll discover:
                - The Persian survival anomaly
                - The concept of the "Liquid Fortress"
                - Why empires fall but ideas endure

                Next week, I'll send you Chapter 2.

                With enduring curiosity,
                The Shabrang Project
                """,
                tags=["welcome", "free-content"],
                variables=["first_name", "chapter_1_link"]
            ),

            "chapter-preview": EmailTemplate(
                template_id="chapter-preview",
                subject="Chapter {{chapter_number}}: {{chapter_title}} - Preview",
                html_content="""
                <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://shabrang.com/images/shabrang_logo.png" alt="Shabrang" style="max-width: 150px;">
                    </div>

                    <h2 style="color: #C9A227; text-align: center; font-family: 'Cinzel', serif;">
                        Chapter {{chapter_number}}: {{chapter_title}}
                    </h2>

                    <p>Dear {{first_name}},</p>

                    <p>Building on what you learned in Chapter {{previous_chapter}}, today I want to share a key insight from Chapter {{chapter_number}}:</p>

                    <blockquote style="border-left: 4px solid #C9A227; padding-left: 20px; margin: 20px 0; font-style: italic; color: #1A4A4A;">
                        {{chapter_quote}}
                    </blockquote>

                    <p>This concept reveals {{chapter_insight}}.</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{chapter_link}}" style="background: #C9A227; color: #1A1A18; padding: 12px 25px; text-decoration: none; border-radius: 5px;">
                            Read Full Chapter
                        </a>
                    </div>

                    <p>Share this insight with others who might find it valuable:</p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="{{share_link}}" style="color: #2D5A6B; text-decoration: none;">
                            📱 Share on Social Media
                        </a>
                    </div>

                    <p>Next: Chapter {{next_chapter}}: {{next_title}}</p>

                    <p>Persian wisdom endures,<br>
                    <em>The Shabrang Project</em></p>
                </div>
                """,
                text_content="""
                Chapter {{chapter_number}}: {{chapter_title}}

                Dear {{first_name}},

                Building on Chapter {{previous_chapter}}, here's a key insight from Chapter {{chapter_number}}:

                "{{chapter_quote}}"

                This concept reveals {{chapter_insight}}.

                Read the full chapter: {{chapter_link}}

                Share this insight: {{share_link}}

                Next: Chapter {{next_chapter}}: {{next_title}}

                Persian wisdom endures,
                The Shabrang Project
                """,
                tags=["chapter-preview", "nurture"],
                variables=["first_name", "chapter_number", "chapter_title", "previous_chapter", "chapter_quote", "chapter_insight", "chapter_link", "share_link", "next_chapter", "next_title"]
            ),

            "premium-upgrade-offer": EmailTemplate(
                template_id="premium-upgrade-offer",
                subject="Unlock The Complete Liquid Fortress - Special Access",
                html_content="""
                <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://shabrang.com/images/shabrang_logo.png" alt="Shabrang" style="max-width: 150px;">
                    </div>

                    <h2 style="color: #C9A227; text-align: center; font-family: 'Cinzel', serif;">
                        You've Experienced the Beginning
                    </h2>

                    <p>Dear {{first_name}},</p>

                    <p>By now, you've seen how Persian civilization built a "Liquid Fortress" — a cultural structure that flows around obstacles while maintaining its core identity.</p>

                    <p>The first 5 chapters reveal the <strong>pattern of survival</strong>. But the complete book shows you <strong>how to apply it</strong>.</p>

                    <div style="background: #F5E6C8; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3 style="color: #8B3535; margin-top: 0;">Premium Access Includes:</h3>
                        <ul>
                            <li>25 additional chapters of deep analysis</li>
                            <li>Audio versions of every chapter</li>
                            <li>Video explainer sessions</li>
                            <li>Private community access</li>
                            <li>Direct Q&A with the author</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{upgrade_link}}" style="background: #C9A227; color: #1A1A18; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
                            Unlock Premium Access - {{price}}
                        </a>
                    </div>

                    <p><em>Limited time offer: {{discount}} off regular price</em></p>

                    <p>Questions? Reply to this email.</p>

                    <p>The fortress awaits,<br>
                    <em>The Shabrang Project</em></p>
                </div>
                """,
                text_content="""
                You've Experienced the Beginning

                Dear {{first_name}},

                By now, you've seen how Persian civilization built a "Liquid Fortress".

                The first 5 chapters reveal the pattern. The complete book shows you how to apply it.

                Premium Access Includes:
                - 25 additional chapters of deep analysis
                - Audio versions of every chapter
                - Video explainer sessions
                - Private community access
                - Direct Q&A with the author

                Unlock Premium Access: {{upgrade_link}}

                Limited time offer: {{discount}} off regular price

                Questions? Reply to this email.

                The fortress awaits,
                The Shabrang Project
                """,
                tags=["premium-offer", "conversion"],
                variables=["first_name", "upgrade_link", "price", "discount"]
            ),

            "premium-welcome": EmailTemplate(
                template_id="premium-welcome",
                subject="Welcome to The Complete Liquid Fortress - Your Journey Begins",
                html_content="""
                <div style="font-family: 'Cormorant Garamond', serif; max-width: 600px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://shabrang.com/images/shabrang_logo.png" alt="Shabrang" style="max-width: 150px;">
                    </div>

                    <h1 style="color: #C9A227; text-align: center; font-family: 'Cinzel', serif;">
                        Welcome, Premium Member
                    </h1>

                    <p>Dear {{first_name}},</p>

                    <p><strong>Congratulations!</strong> You've joined an exclusive group of seekers who understand that true wisdom survives not through force, but through flow.</p>

                    <p>Your premium access is now active. Here's what awaits:</p>

                    <div style="background: #F5E6C8; padding: 20px; margin: 20px 0; border-radius: 5px;">
                        <h3 style="color: #2D5A6B; margin-top: 0;">Your Premium Benefits:</h3>
                        <ul>
                            <li>✅ Chapters 6-30 now unlocked</li>
                            <li>🎧 Audio versions for deep listening</li>
                            <li>🎥 Video sessions for visual learning</li>
                            <li>👥 Private community forum</li>
                            <li>💬 Direct author Q&A sessions</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{book_link}}" style="background: #C9A227; color: #1A1A18; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Start Reading Chapter 6
                        </a>
                    </div>

                    <p><strong>Next Recommended:</strong> Chapter 6 explores the thermodynamics of empire — why some civilizations collapse while others endure.</p>

                    <p>Welcome to the fortress. The journey of a thousand miles begins with a single step.</p>

                    <p>With enduring wisdom,<br>
                    <em>The Shabrang Project</em></p>
                </div>
                """,
                text_content="""
                Welcome, Premium Member

                Dear {{first_name}},

                Congratulations! You've joined seekers who understand that wisdom survives through flow.

                Your premium access is now active.

                Your Premium Benefits:
                ✅ Chapters 6-30 now unlocked
                🎧 Audio versions for deep listening
                🎥 Video sessions for visual learning
                👥 Private community forum
                💬 Direct author Q&A sessions

                Start Reading: {{book_link}}

                Next Recommended: Chapter 6 explores the thermodynamics of empire.

                Welcome to the fortress.

                With enduring wisdom,
                The Shabrang Project
                """,
                tags=["premium-welcome", "onboarding"],
                variables=["first_name", "book_link"]
            )
        }

        # Save templates
        templates_file = Path(__file__).parent / "email_templates.json"
        templates_dict = {k: {
            "template_id": v.template_id,
            "subject": v.subject,
            "html_content": v.html_content,
            "text_content": v.text_content,
            "tags": v.tags,
            "variables": v.variables
        } for k, v in templates.items()}

        templates_file.write_text(json.dumps(templates_dict, indent=2))
        return templates

    def _load_email_sequences(self) -> Dict[str, EmailSequence]:
        """Load email sequences from file."""
        sequences_file = Path(__file__).parent / "email_sequences.json"
        if sequences_file.exists():
            data = json.loads(sequences_file.read_text())
            return {k: EmailSequence(**v) for k, v in data.items()}
        return self._create_default_sequences()

    def _create_default_sequences(self) -> Dict[str, EmailSequence]:
        """Create default email sequences."""
        sequences = {
            "free-chapter-nurture": EmailSequence(
                sequence_id="free-chapter-nurture",
                name="Free Chapter Nurture Sequence",
                trigger_stage="lead",
                emails=[
                    {"delay_days": 0, "template_id": "welcome-free-chapter"},
                    {"delay_days": 3, "template_id": "chapter-preview"},  # Chapter 2 preview
                    {"delay_days": 7, "template_id": "chapter-preview"},  # Chapter 3 preview
                    {"delay_days": 10, "template_id": "chapter-preview"}, # Chapter 4 preview
                    {"delay_days": 14, "template_id": "chapter-preview"}, # Chapter 5 preview
                    {"delay_days": 17, "template_id": "premium-upgrade-offer"}
                ],
                conditions=["has_tag:chapter-1-free", "not_has_tag:premium-member"]
            ),

            "premium-onboarding": EmailSequence(
                sequence_id="premium-onboarding",
                name="Premium Member Onboarding",
                trigger_stage="premium",
                emails=[
                    {"delay_days": 0, "template_id": "premium-welcome"},
                    {"delay_days": 1, "template_id": "chapter-preview"},  # Chapter 6 preview
                    {"delay_days": 3, "template_id": "chapter-preview"},  # Chapter 7 preview
                ],
                conditions=["has_tag:premium-member", "not_has_tag:premium-onboarded"]
            )
        }

        # Save sequences
        sequences_file = Path(__file__).parent / "email_sequences.json"
        sequences_dict = {k: {
            "sequence_id": v.sequence_id,
            "name": v.name,
            "trigger_stage": v.trigger_stage,
            "emails": v.emails,
            "conditions": v.conditions
        } for k, v in sequences.items()}

        sequences_file.write_text(json.dumps(sequences_dict, indent=2))
        return sequences

    def trigger_sequence(self, sequence_id: str, contact_email: str,
                        variables: Dict[str, str] = None) -> Dict[str, Any]:
        """
        Trigger an email sequence for a contact.

        Args:
            sequence_id: ID of the sequence to trigger
            contact_email: Email of the contact
            variables: Template variables to substitute
        """
        if sequence_id not in self.sequences:
            return {"success": False, "error": f"Sequence {sequence_id} not found"}

        sequence = self.sequences[sequence_id]

        # Check if contact meets conditions (simplified - would need GHL integration)
        # For now, we'll assume conditions are met

        # Schedule emails in sequence
        scheduled_emails = []
        base_time = datetime.now()

        for email_config in sequence.emails:
            send_time = base_time + timedelta(days=email_config["delay_days"])
            template_id = email_config["template_id"]

            if template_id not in self.templates:
                continue

            # Prepare email data
            email_data = {
                "sequence_id": sequence_id,
                "contact_email": contact_email,
                "template_id": template_id,
                "scheduled_time": send_time.isoformat(),
                "status": "scheduled",
                "variables": variables or {}
            }

            scheduled_emails.append(email_data)
            self._schedule_email(email_data)

        return {
            "success": True,
            "sequence_name": sequence.name,
            "emails_scheduled": len(scheduled_emails),
            "message": f"Sequence '{sequence.name}' scheduled for {contact_email}"
        }

    def _schedule_email(self, email_data: Dict[str, Any]):
        """Schedule an individual email."""
        schedule_file = Path(__file__).parent / "email_schedule.json"
        existing = []

        if schedule_file.exists():
            existing = json.loads(schedule_file.read_text())

        existing.append(email_data)
        schedule_file.write_text(json.dumps(existing, indent=2))

    def send_scheduled_emails(self) -> Dict[str, Any]:
        """Send emails that are due to be sent."""
        schedule_file = Path(__file__).parent / "email_schedule.json"
        if not schedule_file.exists():
            return {"success": True, "message": "No emails scheduled"}

        scheduled_emails = json.loads(schedule_file.read_text())
        sent_count = 0
        current_time = datetime.now()

        # In a real implementation, this would integrate with an email service
        # For now, we'll just mark them as "sent" and log

        for email in scheduled_emails:
            scheduled_time = datetime.fromisoformat(email["scheduled_time"])

            if scheduled_time <= current_time and email.get("status") == "scheduled":
                # Send email (simulated)
                result = self._send_email(
                    email["contact_email"],
                    email["template_id"],
                    email.get("variables", {})
                )

                if result["success"]:
                    email["status"] = "sent"
                    email["sent_time"] = current_time.isoformat()
                    sent_count += 1
                else:
                    email["status"] = "failed"
                    email["error"] = result.get("error")

        # Save updated schedule
        schedule_file.write_text(json.dumps(scheduled_emails, indent=2))

        return {
            "success": True,
            "emails_sent": sent_count,
            "message": f"Sent {sent_count} scheduled emails"
        }

    def _send_email(self, to_email: str, template_id: str, variables: Dict[str, str]) -> Dict[str, Any]:
        """Send an individual email."""
        if template_id not in self.templates:
            return {"success": False, "error": f"Template {template_id} not found"}

        template = self.templates[template_id]

        # Fill in template variables
        subject = self._fill_template(template.subject, variables)
        html_content = self._fill_template(template.html_content, variables)
        text_content = self._fill_template(template.text_content, variables)

        # In a real implementation, this would send via SMTP or email service API
        # For now, we'll just log the email content

        email_record = {
            "timestamp": datetime.now().isoformat(),
            "to_email": to_email,
            "template_id": template_id,
            "subject": subject,
            "status": "sent"
        }

        # Log sent email
        self._log_sent_email(email_record)

        print(f"📧 Would send email to {to_email}: {subject}")

        return {"success": True}

    def _fill_template(self, template: str, variables: Dict[str, str]) -> str:
        """Fill in template variables."""
        result = template
        for key, value in variables.items():
            result = result.replace("{{" + key + "}}", str(value))
        return result

    def _log_sent_email(self, email_record: Dict[str, Any]):
        """Log sent email to file."""
        log_file = Path(__file__).parent / "email_log.json"
        existing = []

        if log_file.exists():
            existing = json.loads(log_file.read_text())

        existing.append(email_record)
        log_file.write_text(json.dumps(existing, indent=2))

    def get_email_analytics(self) -> Dict[str, Any]:
        """Get email performance analytics."""
        log_file = Path(__file__).parent / "email_log.json"
        if not log_file.exists():
            return {"success": True, "analytics": {"total_sent": 0}}

        sent_emails = json.loads(log_file.read_text())

        # Basic analytics
        total_sent = len(sent_emails)
        template_stats = {}
        daily_stats = {}

        for email in sent_emails:
            template_id = email.get("template_id", "unknown")

            # Template stats
            template_stats[template_id] = template_stats.get(template_id, 0) + 1

            # Daily stats
            timestamp = email.get("timestamp", "")
            if timestamp:
                try:
                    date = timestamp.split("T")[0]
                    daily_stats[date] = daily_stats.get(date, 0) + 1
                except:
                    pass

        return {
            "success": True,
            "analytics": {
                "total_sent": total_sent,
                "template_breakdown": template_stats,
                "daily_activity": daily_stats,
                "most_used_template": max(template_stats.items(), key=lambda x: x[1]) if template_stats else None
            }
        }


def main():
    # Load environment variables
    env = {}
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
        print("  --sequence SEQUENCE_ID EMAIL [VARIABLES]   Trigger email sequence")
        print("  --schedule                               Send scheduled emails")
        print("  --analytics                              Show email analytics")
        print("  --test EMAIL TEMPLATE_ID                 Send test email")
        print("  --list-templates                         List available templates")
        print("  --list-sequences                         List available sequences")
        sys.exit(1)

    try:
        automation = EmailAutomation(env)
    except Exception as e:
        print(f"Setup error: {e}")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "--sequence":
        if len(sys.argv) < 4:
            print("Usage: python email_automation.py --sequence SEQUENCE_ID EMAIL [key1=value1 key2=value2]")
            sys.exit(1)

        sequence_id = sys.argv[2]
        email = sys.argv[3]

        # Parse variables
        variables = {}
        for arg in sys.argv[4:]:
            if "=" in arg:
                key, value = arg.split("=", 1)
                variables[key] = value

        result = automation.trigger_sequence(sequence_id, email, variables)
        print(json.dumps(result, indent=2))

    elif cmd == "--schedule":
        result = automation.send_scheduled_emails()
        print(json.dumps(result, indent=2))

    elif cmd == "--analytics":
        result = automation.get_email_analytics()
        print(json.dumps(result, indent=2))

    elif cmd == "--test":
        if len(sys.argv) < 4:
            print("Usage: python email_automation.py --test EMAIL TEMPLATE_ID [key1=value1]")
            sys.exit(1)

        email = sys.argv[2]
        template_id = sys.argv[3]

        # Parse variables
        variables = {}
        for arg in sys.argv[4:]:
            if "=" in arg:
                key, value = arg.split("=", 1)
                variables[key] = value

        result = automation._send_email(email, template_id, variables)
        print(json.dumps(result, indent=2))

    elif cmd == "--list-templates":
        templates = automation.templates
        print(f"Available email templates: {len(templates)}")
        for tid, template in templates.items():
            print(f"  {tid}: {template.subject}")

    elif cmd == "--list-sequences":
        sequences = automation.sequences
        print(f"Available email sequences: {len(sequences)}")
        for sid, sequence in sequences.items():
            print(f"  {sid}: {sequence.name} (triggers on: {sequence.trigger_stage})")

    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
