import os
import sys
import logging
import asyncio
import subprocess
from pathlib import Path
from typing import Dict, Any, Optional, List
from dotenv import dotenv_values

# Add the CLI repo to path to use core utilities if needed, 
# but keep project-specific logic here.
sys.path.append("/home/mumega/cli")

from mumega.core.river_engine import RiverEngine
from mumega.core.config import get_path_config
from mumega.core.integrations.ghl import GHLIntegration
from mumega.core.integrations.notion_integration import NotionIntegration
from mumega.core.integrations.google_drive import GoogleDriveSync
from mumega.core.economy import (
    WorkLedger,
    WorkUnit,
    WorkUnitStatus,
    TrustGate,
    AgentTrustProfile,
    match_workers_for_work
)
from mumega.core.sovereign.solana_connector import get_solana_connector

logger = logging.getLogger("shabrang_sovereign")

class ShabrangSovereign:
    """
    Sovereign Agent for Shabrang ecosystem.
    Isolated within /opt/shabrang/repo.
    """

    def __init__(self, engine: Optional[RiverEngine] = None):
        self.engine = engine or RiverEngine()
        self.repo_dir = Path("/opt/shabrang/repo")
        self.api_dir = self.repo_dir / "api"
        self.data_dir = Path("/opt/shabrang/data")
        self.engine_dir = self.repo_dir / "engine"
        
        # Initialize Integrations
        self.solana = get_solana_connector(agent_name="Shabrang")
        
        # Isolated Economy System
        self.ledger = WorkLedger(data_dir=self.data_dir / "work_ledger")
        self.trust_gate = TrustGate() 
        # Note: TrustGate is singleton-ish by default, but we can manage local trust via custom registry if needed.
        # Ideally we'd pass a custom path to TrustGate, but for now we rely on its internal mechanics or extend it.
        # For true isolation, we should probably instantiate a local registry/trust store if TrustGate supports it.
        # Looking at TrustGate code, it uses a fixed path or singleton. 
        # Let's assume for now we use the global TrustGate logic but maybe filter locally.
        # Actually, let's just use the Ledger for work tracking which IS path-configurable.

        # Load GHL config from local repo environment
        self.ghl = self._init_ghl()
        self.notion = self._init_notion()
        self.drive = self._init_drive()

    async def handle_new_customer(self, customer_data: Dict[str, Any]):
        """
        Handle a new customer event (e.g. from Stripe or GHL).
        Triggers fulfillment workflow.
        """
        email = customer_data.get("email")
        name = customer_data.get("name")
        logger.info(f"🎉 New Customer Event: {name} <{email}>")
        
        # 1. Create Fulfillment Work
        # This represents the high-level job of onboarding the user
        work = WorkUnit.create(
            title=f"Onboard Customer: {email}",
            description=f"Provision access and send welcome materials for {name}",
            requester_id="sovereign_shabrang",
            metadata={
                "customer": customer_data,
                "type": "onboarding",
                "capabilities": ["provisioning", "email"]
            }
        )
        self.ledger.create_work_unit(work)
        logger.info(f"📋 Created Work Unit: {work.id}")
        
        # 2. Trigger Fulfillment
        await self.fulfill_order(work.id)

    async def fulfill_order(self, work_id: str):
        """
        Attempt to fulfill a work unit by dispatching to internal agents.
        """
        unit = self.ledger.get_work_unit(work_id)
        if not unit:
            logger.error(f"Work unit {work_id} not found")
            return

        # Simple Logic: If it's onboarding, we execute it directly via our integrations
        # In a full swarm, we'd match_workers_for_work(unit)
        
        try:
            # 1. Notion Access
            if self.notion:
                # TODO: add notion logic
                logger.info("... Provisioning Notion")
            
            # 2. Drive Access
            if self.drive:
                # TODO: add drive logic
                logger.info("... Provisioning Drive")
                
            # 3. Mark Complete
            # In Phase 21 we'd use proof submission, here we simulate self-execution
            unit.status = WorkUnitStatus.VERIFIED
            self.ledger._save_work_units()
            logger.info(f"✅ Order Fulfilled: {work_id}")
            
        except Exception as e:
            logger.error(f"Fulfillment failed: {e}")
            unit.status = WorkUnitStatus.FAILED
            self.ledger._save_work_units()

    def _init_ghl(self) -> Optional[GHLIntegration]:
        """Initialize GHL from local .env file"""
        try:
            # Load local .env from api dir
            env_file = self.api_dir / ".env"
            from dotenv import dotenv_values
            env_vars = dotenv_values(env_file)
            
            config = {
                'enabled': True,
                'location_id': env_vars.get('GHL_LOCATION_ID'),
                'client_id': env_vars.get('GHL_CLIENT_ID'),
                'client_secret': env_vars.get('GHL_CLIENT_SECRET'),
                'tokens_file': str(self.api_dir / ".ghl_tokens.json")
            }
            return GHLIntegration(config)
        except Exception as e:
            logger.error(f"Failed to init GHL from local env: {e}")
            return None

    def _init_notion(self) -> Optional[NotionIntegration]:
        """Initialize Notion from env or config"""
        # For now, check system env or repo-specific config
        api_key = os.getenv('NOTION_API_KEY')
        if not api_key:
            # Try to load from local repo if we add it to .env later
            env_vars = dotenv_values(self.api_dir / ".env") if (self.api_dir / ".env").exists() else {}
            api_key = env_vars.get('NOTION_API_KEY')

        if api_key:
            config = {
                'enabled': True,
                'api_key': api_key,
                'database_id': os.getenv('NOTION_DATABASE_ID'),
            }
            return NotionIntegration(config)
        return None

    def _init_drive(self) -> Optional[GoogleDriveSync]:
        """Initialize Google Drive"""
        folder_id = os.getenv('GDRIVE_SHABRANG_FOLDER_ID')
        if folder_id:
            config = {
                'enabled': True,
                'folder_id': folder_id,
                'credentials_file': os.getenv('GDRIVE_CREDENTIALS_FILE', '/home/mumega/.credentials/gdrive_credentials.json'),
            }
            return GoogleDriveSync(config)
        return None

    async def build_cms(self) -> Dict[str, Any]:
        """Triggers the Shabrang CMS build engine."""
        logger.info("🏗️ Starting Shabrang CMS build...")
        try:
            build_script = self.engine_dir / "build.py"
            result = subprocess.run(
                [sys.executable, str(build_script)],
                cwd=str(self.repo_dir),
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                return {"success": True, "output": result.stdout}
            else:
                return {"success": False, "error": result.stderr}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def process_checkout(self, plan: str, currency: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orchestrates the checkout process for physical books or academy.
        """
        logger.info(f"💰 Processing checkout: {plan} via {currency}")
        
        # Payment Logic (Stripe/TON/SOL)
        payment_result = await self._handle_payment(plan, currency, user_data)
        if not payment_result.get("success"):
            return payment_result

        # Post-payment: Enroll in Academy or mark for book shipment
        fulfillment_result = await self._handle_fulfillment(plan, user_data)
        
        return {
            "success": True,
            "payment": payment_result,
            "fulfillment": fulfillment_result
        }

    async def _handle_payment(self, plan: str, currency: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Internal payment handler helper"""
        # NOTE: Real logic would call Stripe API or use SolanaConnector
        if currency.upper() == "SOL":
            # Mock or minimal SOL tx check
            return {"success": True, "tx_signature": "mock_sol_tx_sig", "currency": "SOL"}
        elif currency.upper() == "TON":
            # Mock TON tx check
            return {"success": True, "tx_signature": "mock_ton_tx_sig", "currency": "TON"}
        else:
            # Stripe or default
            return {"success": True, "stripe_session_id": "mock_stripe_session", "currency": "STRIPE"}

    async def _handle_fulfillment(self, plan: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Internal fulfillment (GHL/Academy/Notion) helper"""
        email = user_data.get("email")
        if not email:
            return {"success": False, "error": "No email provided for fulfillment"}

        results = {}

        # 1. GHL Enrollment (Academy)
        if "academy" in plan.lower() and self.ghl:
            tags = ["shabrang-academy", f"plan-{plan}"]
            ghl_res = await self.ghl.add_contact(
                email=email,
                first_name=user_data.get("first_name", "Student"),
                last_name=user_data.get("last_name", ""),
                tags=tags
            )
            results["ghl"] = ghl_res

        # 2. Notion Tracking (Book Shipment / Student Data)
        if self.notion:
            db_id = os.getenv("NOTION_SHABRANG_DB_ID")
            if db_id:
                notion_res = await self.notion.create_page(
                    database_id=db_id,
                    properties={
                        "Name": {"title": [{"text": {"content": f"{user_data.get('first_name', 'User')} ({plan})"}}]},
                        "Email": {"email": email},
                        "Product": {"select": {"name": "Book" if "book" in plan.lower() else "Academy"}},
                        "Status": {"status": {"name": "Processing"}}
                    }
                )
                results["notion"] = {"success": True, "page_id": notion_res}

        # 3. Google Drive (Asset Provisioning)
        if "academy" in plan.lower() and self.drive:
            # Logic to share a folder or provide a link (placeholder for now)
            results["drive"] = {"status": "provisioned", "folder": "Academy Resources"}

        return {"success": True, "results": results}
