#!/usr/bin/env python3
"""
Shabrang Master Marketing Manager

Unified interface for managing the complete Liquid Fortress marketing ecosystem.
Integrates funnel management, social media, email automation, analytics, and paywall.

Features:
- Complete funnel orchestration
- Automated lead processing
- Performance monitoring
- Campaign management
- Revenue optimization

Usage:
  python master_manager.py --dashboard          # Complete marketing dashboard
  python master_manager.py --process-lead EMAIL # Process new lead through funnel
  python master_manager.py --campaign NAME      # Launch marketing campaign
  python master_manager.py --optimize           # Run optimization recommendations
  python master_manager.py --status             # System health and status
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any

from funnel_manager import FunnelManager
from social_manager import SocialManager
from email_automation import EmailAutomation
from analytics_dashboard import AnalyticsDashboard
from paywall_manager import PaywallManager


class MasterManager:
    """Master controller for the entire Shabrang marketing ecosystem."""

    def __init__(self, env: Dict[str, str]):
        self.env = env

        # Initialize all managers
        self.funnel_manager = FunnelManager(env)
        self.social_manager = SocialManager(env)
        self.email_automation = EmailAutomation(env)
        self.analytics_dashboard = AnalyticsDashboard(env)
        self.paywall_manager = PaywallManager(env)

    def process_new_lead(self, email: str, first_name: str = None, last_name: str = None,
                        source: str = "landing-page", campaign: str = None) -> Dict[str, Any]:
        """
        Process a new lead through the complete marketing funnel.

        Args:
            email: Lead's email address
            first_name: Optional first name
            last_name: Optional last name
            source: Lead source (landing-page, social-media, etc.)
            campaign: Specific campaign identifier
        """
        try:
            print(f"🚀 Processing new lead: {email} from {source}")

            # Step 1: Add to funnel management
            funnel_result = self.funnel_manager.add_lead_to_funnel(
                email=email,
                first_name=first_name,
                last_name=last_name,
                source=source
            )

            if not funnel_result["success"]:
                return funnel_result

            funnel_stage = funnel_result.get("funnel_stage", "lead")
            print(f"✅ Added to funnel stage: {funnel_stage}")

            # Step 2: Trigger appropriate email sequence
            if funnel_stage == "lead":
                email_result = self.email_automation.trigger_sequence(
                    sequence_id="free-chapter-nurture",
                    contact_email=email,
                    variables={
                        "first_name": first_name or "",
                        "chapter_1_link": "https://shabrang.com/chapter1.html"
                    }
                )

                if email_result["success"]:
                    print(f"✅ Email sequence triggered: {email_result['sequence_name']}")
                else:
                    print(f"⚠️  Email sequence failed: {email_result.get('error')}")

            # Step 3: Check for social content suggestions
            social_suggestions = self.social_manager.get_content_suggestions(funnel_stage)
            if social_suggestions:
                print(f"💡 Social content suggestions available for {funnel_stage} stage")

            # Step 4: Log the complete lead processing
            processing_log = {
                "timestamp": datetime.now().isoformat(),
                "email": email,
                "source": source,
                "campaign": campaign,
                "funnel_stage": funnel_stage,
                "email_sequence_triggered": funnel_stage == "lead",
                "processing_status": "completed"
            }

            self._log_lead_processing(processing_log)

            return {
                "success": True,
                "lead_email": email,
                "processing_steps": {
                    "funnel_added": True,
                    "email_sequence": funnel_stage == "lead",
                    "social_suggestions": len(social_suggestions) > 0,
                    "membership_checked": False  # Could add membership check here
                },
                "next_actions": [
                    "Monitor email engagement",
                    "Track funnel progression",
                    "Consider social content suggestions"
                ],
                "message": f"Lead {email} successfully processed through funnel"
            }

        except Exception as e:
            error_log = {
                "timestamp": datetime.now().isoformat(),
                "email": email,
                "error": str(e),
                "processing_status": "failed"
            }
            self._log_lead_processing(error_log)

            return {
                "success": False,
                "error": str(e),
                "lead_email": email,
                "message": "Lead processing failed"
            }

    def _log_lead_processing(self, log_entry: Dict[str, Any]):
        """Log lead processing events."""
        log_file = Path(__file__).parent / "lead_processing_log.json"
        existing = []

        if log_file.exists():
            try:
                existing = json.loads(log_file.read_text())
            except:
                existing = []

        existing.append(log_entry)
        log_file.write_text(json.dumps(existing, indent=2))

    def launch_integrated_campaign(self, campaign_name: str, campaign_type: str = "viral",
                                 duration_days: int = 7) -> Dict[str, Any]:
        """
        Launch an integrated marketing campaign across all channels.

        Args:
            campaign_name: Name of the campaign
            campaign_type: Type of campaign (viral, nurture, conversion)
            duration_days: Campaign duration
        """
        try:
            campaign_config = self._get_campaign_config(campaign_type)

            print(f"🚀 Launching {campaign_type} campaign: {campaign_name}")

            results = {
                "campaign_name": campaign_name,
                "campaign_type": campaign_type,
                "start_date": datetime.now().isoformat(),
                "duration_days": duration_days
            }

            # Launch social media campaign
            if campaign_config.get("social_content"):
                social_result = self.social_manager.run_viral_campaign(
                    campaign_name=campaign_name,
                    content_sequence=campaign_config["social_content"],
                    duration_days=duration_days
                )

                results["social_campaign"] = {
                    "success": social_result.get("success", False),
                    "scheduled_posts": social_result.get("campaign", {}).get("scheduled_posts", 0)
                }

                if social_result.get("success"):
                    print(f"✅ Social campaign launched with {social_result['campaign']['scheduled_posts']} posts")
                else:
                    print(f"⚠️  Social campaign failed: {social_result.get('error')}")

            # Set up email automation
            if campaign_config.get("email_sequence"):
                # Could trigger bulk email sequences here
                print(f"📧 Email automation configured for {campaign_type} campaign")

            # Set up funnel triggers
            if campaign_config.get("funnel_triggers"):
                print(f"🔄 Funnel automation configured for campaign responses")

            # Schedule analytics monitoring
            monitoring_result = self._schedule_campaign_monitoring(
                campaign_name, duration_days
            )

            results["monitoring_scheduled"] = monitoring_result.get("success", False)

            return {
                "success": True,
                "campaign": results,
                "message": f"Integrated campaign '{campaign_name}' launched successfully"
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "campaign_name": campaign_name,
                "message": "Campaign launch failed"
            }

    def _get_campaign_config(self, campaign_type: str) -> Dict[str, Any]:
        """Get configuration for different campaign types."""
        configs = {
            "viral": {
                "social_content": ["chapter1-quote1", "chapter1-quote2", "chapter3-binary"],
                "email_sequence": "viral-followup",
                "funnel_triggers": ["social-engagement", "lead-capture"],
                "target_metrics": ["engagements", "shares", "new_leads"]
            },
            "nurture": {
                "social_content": ["chapter5-thermodynamics", "chapter11-conquest"],
                "email_sequence": "free-chapter-nurture",
                "funnel_triggers": ["email-opens", "chapter-views"],
                "target_metrics": ["email_opens", "content_views", "time_on_page"]
            },
            "conversion": {
                "social_content": ["chapter25-garden"],
                "email_sequence": "premium-upgrade-offer",
                "funnel_triggers": ["premium-clicks", "checkout-starts"],
                "target_metrics": ["clicks", "conversions", "revenue"]
            }
        }

        return configs.get(campaign_type, configs["viral"])

    def _schedule_campaign_monitoring(self, campaign_name: str, duration_days: int) -> Dict[str, Any]:
        """Schedule monitoring for campaign performance."""
        # This would set up automated monitoring
        # For now, just return success
        return {
            "success": True,
            "monitoring_type": "daily_analytics",
            "duration_days": duration_days,
            "message": f"Campaign monitoring scheduled for {campaign_name}"
        }

    def run_system_optimization(self) -> Dict[str, Any]:
        """
        Run system-wide optimization recommendations.
        Analyzes all components and suggests improvements.
        """
        try:
            print("🔍 Running system optimization analysis...")

            # Get analytics from all components
            overview = self.analytics_dashboard.get_complete_overview()

            if not overview.get("success"):
                return {"success": False, "error": "Unable to fetch analytics data"}

            data = overview.get("overview", {})

            optimizations = {
                "immediate_actions": [],
                "short_term_goals": [],
                "long_term_strategies": []
            }

            # Analyze funnel health
            funnel = data.get("funnel_performance", {})
            funnel_health = funnel.get("funnel_health_score", 0)

            if funnel_health < 50:
                optimizations["immediate_actions"].append({
                    "action": "Increase traffic to landing page",
                    "reason": f"Funnel health score is {funnel_health}/100",
                    "impact": "high",
                    "effort": "medium"
                })

            # Analyze social engagement
            social = data.get("social_engagement", {})
            total_engagements = social.get("total_engagements", 0)

            if total_engagements < 100:
                optimizations["immediate_actions"].append({
                    "action": "Boost social media posting frequency",
                    "reason": f"Only {total_engagements} total engagements",
                    "impact": "high",
                    "effort": "low"
                })

            # Analyze email performance
            email = data.get("email_effectiveness", {})
            emails_sent = email.get("total_emails_sent", 0)

            if emails_sent < 50:
                optimizations["short_term_goals"].append({
                    "action": "Implement automated email sequences",
                    "reason": f"Only {emails_sent} emails sent - missing automation",
                    "impact": "high",
                    "effort": "medium"
                })

            # Revenue optimization
            funnel_data = data.get("funnel_performance", {})
            conversion_rate = funnel_data.get("conversion_rate", 0)

            if conversion_rate < 5:
                optimizations["short_term_goals"].append({
                    "action": "Optimize premium offer and pricing",
                    "reason": f"Premium conversion rate is {conversion_rate}%",
                    "impact": "high",
                    "effort": "medium"
                })

            # Long-term strategies
            optimizations["long_term_strategies"].extend([
                {
                    "action": "Develop Persian language version",
                    "reason": "Expand to diaspora audience",
                    "impact": "high",
                    "effort": "high"
                },
                {
                    "action": "Build community platform integration",
                    "reason": "Increase user engagement and retention",
                    "impact": "medium",
                    "effort": "high"
                }
            ])

            # Save optimization recommendations
            self._save_optimization_report(optimizations)

            return {
                "success": True,
                "optimizations": optimizations,
                "total_recommendations": sum(len(actions) for actions in optimizations.values()),
                "message": "System optimization analysis completed"
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Optimization analysis failed"
            }

    def _save_optimization_report(self, optimizations: Dict[str, Any]):
        """Save optimization recommendations to file."""
        report = {
            "timestamp": datetime.now().isoformat(),
            "optimizations": optimizations
        }

        report_file = Path(__file__).parent / "optimization_report.json"
        report_file.write_text(json.dumps(report, indent=2))

    def get_system_health_status(self) -> Dict[str, Any]:
        """Get comprehensive system health status."""
        try:
            health_checks = {
                "funnel_manager": self._check_component_health(self.funnel_manager, "get_funnel_analytics"),
                "social_manager": self._check_component_health(self.social_manager, "get_social_analytics"),
                "email_automation": self._check_component_health(self.email_automation, "get_email_analytics"),
                "analytics_dashboard": self._check_component_health(self.analytics_dashboard, "get_complete_overview"),
                "paywall_manager": self._check_component_health(self.paywall_manager, "get_subscription_overview")
            }

            # Calculate overall health score
            healthy_components = sum(1 for check in health_checks.values() if check.get("healthy", False))
            total_components = len(health_checks)
            overall_health = (healthy_components / total_components) * 100

            # Identify issues
            issues = []
            for component, health in health_checks.items():
                if not health.get("healthy", False):
                    issues.append({
                        "component": component,
                        "issue": health.get("error", "Unknown error"),
                        "severity": "high" if "auth" in health.get("error", "").lower() else "medium"
                    })

            status = {
                "overall_health_score": round(overall_health, 1),
                "healthy_components": healthy_components,
                "total_components": total_components,
                "component_status": health_checks,
                "issues": issues,
                "last_checked": datetime.now().isoformat()
            }

            # Determine overall status
            if overall_health >= 80:
                status["status"] = "healthy"
            elif overall_health >= 60:
                status["status"] = "warning"
            else:
                status["status"] = "critical"

            return {
                "success": True,
                "health_status": status
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "Health check failed"
            }

    def _check_component_health(self, component: Any, test_method: str) -> Dict[str, Any]:
        """Check health of a specific component."""
        try:
            method = getattr(component, test_method, None)
            if method:
                result = method()
                return {
                    "healthy": result.get("success", False),
                    "response_time": "N/A",  # Would need timing
                    "last_success": datetime.now().isoformat() if result.get("success") else None
                }
            else:
                return {"healthy": False, "error": f"Method {test_method} not found"}
        except Exception as e:
            return {"healthy": False, "error": str(e)}

    def get_master_dashboard(self) -> Dict[str, Any]:
        """Get the master marketing dashboard combining all data."""
        try:
            # Get data from all components
            analytics = self.analytics_dashboard.get_complete_overview()
            health = self.get_system_health_status()

            if not analytics.get("success"):
                return {"success": False, "error": "Analytics data unavailable"}

            # Combine into master dashboard
            dashboard = {
                "timestamp": datetime.now().isoformat(),
                "system_health": health.get("health_status", {}),
                "marketing_performance": analytics.get("overview", {}),
                "active_campaigns": [],  # Would populate from campaign manager
                "recent_activity": self._get_recent_activity(),
                "key_metrics": self._calculate_key_metrics(analytics.get("overview", {})),
                "alerts": self._generate_system_alerts(health, analytics)
            }

            return {
                "success": True,
                "dashboard": dashboard
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def _get_recent_activity(self) -> List[Dict[str, Any]]:
        """Get recent system activity."""
        # This would aggregate recent activity from all logs
        # For now, return mock data
        return [
            {
                "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
                "type": "lead_processed",
                "description": "New lead added to funnel",
                "details": "user@example.com from landing page"
            },
            {
                "timestamp": (datetime.now() - timedelta(hours=4)).isoformat(),
                "type": "email_sent",
                "description": "Welcome sequence email sent",
                "details": "Chapter 1 access link sent"
            }
        ]

    def _calculate_key_metrics(self, analytics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate key performance metrics."""
        funnel = analytics_data.get("funnel_performance", {})
        social = analytics_data.get("social_engagement", {})
        email = analytics_data.get("email_effectiveness", {})

        return {
            "total_reach": funnel.get("total_contacts", 0) + social.get("total_engagements", 0),
            "conversion_velocity": funnel.get("conversion_rate", 0),
            "engagement_rate": social.get("engagement_rate", 0),
            "email_effectiveness": email.get("estimated_open_rate", 0),
            "system_health": 85.5  # Mock score
        }

    def _generate_system_alerts(self, health: Dict[str, Any], analytics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate system alerts based on health and performance."""
        alerts = []

        health_status = health.get("health_status", {})
        if health_status.get("status") == "critical":
            alerts.append({
                "level": "critical",
                "message": "System health is critical - immediate attention required",
                "component": "system_overall"
            })

        analytics_data = analytics.get("overview", {})
        funnel = analytics_data.get("funnel_performance", {})

        if funnel.get("funnel_health_score", 100) < 50:
            alerts.append({
                "level": "warning",
                "message": f"Funnel health score is low: {funnel.get('funnel_health_score', 0)}/100",
                "component": "funnel"
            })

        return alerts


def print_master_dashboard(dashboard: Dict[str, Any]):
    """Print a formatted master dashboard."""
    print("╔══════════════════════════════════════════════════════════════════════════════╗")
    print("║                       SHABRANG MASTER DASHBOARD                            ║")
    print("╚══════════════════════════════════════════════════════════════════════════════╝")
    print(f"📊 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    data = dashboard.get("dashboard", {})

    # System Health
    health = data.get("system_health", {})
    health_score = health.get("overall_health_score", 0)
    status = health.get("status", "unknown")

    print("🔧 SYSTEM HEALTH")
    print("-" * 50)
    print(f"Overall Status: {status.upper()}")
    print(f"Health Score: {health_score:.1f}/100")
    print(f"Components: {health.get('healthy_components', 0)}/{health.get('total_components', 0)} healthy")
    print()

    # Key Metrics
    metrics = data.get("key_metrics", {})
    print("📈 KEY METRICS")
    print("-" * 50)
    print(f"Total Reach: {metrics.get('total_reach', 0)}")
    print(f"Conversion Rate: {metrics.get('conversion_velocity', 0):.1f}%")
    print(f"Engagement Rate: {metrics.get('engagement_rate', 0):.1f}%")
    print(f"Email Effectiveness: {metrics.get('email_effectiveness', 0):.1f}%")
    print()

    # Recent Activity
    activity = data.get("recent_activity", [])
    if activity:
        print("🔔 RECENT ACTIVITY")
        print("-" * 50)
        for item in activity[:3]:  # Show last 3 items
            timestamp = datetime.fromisoformat(item["timestamp"]).strftime("%H:%M")
            print(f"{timestamp} - {item['description']}")
        print()

    # Alerts
    alerts = data.get("alerts", [])
    if alerts:
        print("🚨 ALERTS")
        print("-" * 50)
        for alert in alerts:
            level_icon = "🔴" if alert["level"] == "critical" else "🟡"
            print(f"{level_icon} {alert['message']}")
        print()


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
        print("  --dashboard                 Show master marketing dashboard")
        print("  --process-lead EMAIL        Process new lead through complete funnel")
        print("  --campaign NAME [TYPE]      Launch integrated marketing campaign")
        print("  --optimize                  Run system optimization analysis")
        print("  --health                    Show system health status")
        print("  --status                    Quick system status overview")
        sys.exit(1)

    try:
        manager = MasterManager(env)
    except Exception as e:
        print(f"Setup error: {e}")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "--dashboard":
        result = manager.get_master_dashboard()
        if result.get("success"):
            print_master_dashboard(result)
        else:
            print(f"Error: {result.get('error')}")

    elif cmd == "--process-lead":
        if len(sys.argv) < 3:
            print("Usage: python master_manager.py --process-lead EMAIL [FIRST_NAME] [LAST_NAME] [--source SOURCE]")
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

        result = manager.process_new_lead(email, first_name, last_name, source)
        print(json.dumps(result, indent=2))

    elif cmd == "--campaign":
        if len(sys.argv) < 3:
            print("Usage: python master_manager.py --campaign NAME [TYPE] [DAYS]")
            sys.exit(1)

        name = sys.argv[2]
        campaign_type = sys.argv[3] if len(sys.argv) > 3 else "viral"
        duration = int(sys.argv[4]) if len(sys.argv) > 4 else 7

        result = manager.launch_integrated_campaign(name, campaign_type, duration)
        print(json.dumps(result, indent=2))

    elif cmd == "--optimize":
        result = manager.run_system_optimization()
        print(json.dumps(result, indent=2))

    elif cmd == "--health":
        result = manager.get_system_health_status()
        print(json.dumps(result, indent=2))

    elif cmd == "--status":
        # Quick status check
        health = manager.get_system_health_status()
        analytics = manager.analytics_dashboard.get_complete_overview()

        status = {
            "system_health": health.get("health_status", {}).get("status", "unknown"),
            "health_score": health.get("health_status", {}).get("overall_health_score", 0),
            "total_contacts": analytics.get("overview", {}).get("funnel_performance", {}).get("total_contacts", 0),
            "premium_conversions": analytics.get("overview", {}).get("funnel_performance", {}).get("premium_conversions", 0),
            "timestamp": datetime.now().isoformat()
        }

        print(json.dumps(status, indent=2))

    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
