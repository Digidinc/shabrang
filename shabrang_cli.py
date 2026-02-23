#!/usr/bin/env python3
import sys
import os
import argparse
import asyncio
import json
from pathlib import Path

# Ensure we can import from core/
sys.path.append(str(Path(__file__).parent))

from shabrang_core.agent.sovereign import ShabrangSovereign

def parse_args():
    parser = argparse.ArgumentParser(description="Shabrang Sovereign Management CLI")
    parser.add_argument("command", choices=["status", "build", "checkout", "enroll"], help="Command to run")
    parser.add_argument("args", nargs="*", help="Arguments for the command")
    return parser.parse_args()

async def run_status(sovereign):
    print("\n🏮 SHABRANG SOVEREIGN: LOCAL STATUS")
    print("-" * 40)
    
    ghl_status = "✅ Connected" if sovereign.ghl and sovereign.ghl.enabled else "❌ Disconnected"
    notion_status = "✅ Connected" if sovereign.notion and sovereign.notion.enabled else "❌ Disconnected"
    drive_status = "✅ Connected" if sovereign.drive and sovereign.drive.enabled else "❌ Disconnected"
    solana_status = "✅ Active" if sovereign.solana and sovereign.solana.wallet else "❌ Offline"
    
    # Check GHL Location
    location_name = "Unknown"
    if sovereign.ghl and sovereign.ghl.enabled:
        location_info = await sovereign.ghl.get_location_info()
        location_name = location_info.get('name', 'Resolved (Location ID active)')

    print(f"GHL Academy:      {ghl_status} ({location_name})")
    print(f"Notion Board:     {notion_status}")
    print(f"Google Drive:     {drive_status}")
    print(f"Sovereign Solana: {solana_status}")
    print("-" * 40)
    
    # Check CMS Build Engine
    build_script = sovereign.engine_dir / "build.py"
    build_status = "✅ Ready" if build_script.exists() else "❌ Missing build.py"
    print(f"CMS Build Engine: {build_status}")
    print("-" * 40 + "\n")

async def main():
    args = parse_args()
    sovereign = ShabrangSovereign()
    
    if args.command == "status":
        await run_status(sovereign)
    
    elif args.command == "build":
        print("🏗️ Triggering local CMS build...")
        result = await sovereign.build_cms()
        if result.get("success"):
            print("✅ Build completed successfully.")
        else:
            print(f"❌ Build failed: {result.get('error')}")
            
    elif args.command == "checkout":
        # Usage: ./shabrang_cli.py checkout [plan] [currency] [email]
        plan = args.args[0] if len(args.args) > 0 else "academy-basic"
        currency = args.args[1] if len(args.args) > 1 else "SOL"
        email = args.args[2] if len(args.args) > 2 else "rider@shabrang.ca"
        
        print(f"💰 Testing checkout flow for {email}...")
        result = await sovereign.process_checkout(plan, currency, {"email": email})
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
