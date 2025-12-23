#!/usr/bin/env python3
"""
Shabrang Command Center setup:
- Ensure a Google Sheet (Control Center) exists with tabs/headers
- Ensure a Weekly Plan Google Doc exists with a starter template
- Save IDs locally for agent usage
- Optionally notify Telegram if TELEGRAM_TOKEN + TELEGRAM_CHAT_ID are set
"""

import json
import os
import sys
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from googleapiclient.discovery import build

# Reuse gdrive-cms auth helpers
GDRIVE_CMS_PATH = "/home/mumega/gdrive-cms"
CONFIG_PATH = "/home/mumega/contentngn/sites/shabrang/gdrive-config.json"
OUTPUT_PATH = "/home/mumega/shabrang-refactor/automation/command-center.json"

SHEET_TITLE = "Shabrang Command Center"
DOC_TITLE = "Shabrang Weekly Plan"

QUEUE_HEADERS = [
    "id",
    "title",
    "status",
    "priority",
    "channel",
    "source",
    "cta",
    "due_date",
    "owner",
    "notes",
]

LOG_HEADERS = [
    "timestamp",
    "action",
    "item_id",
    "status",
    "details",
]

PLAN_TEMPLATE = """# Shabrang Weekly Plan

## Intent (Community First)
- Primary: community growth + inquiry
- Secondary: Kindle + physical preorder only

## Weekly Themes
1)
2)
3)

## Content Plan
- Blog:
- Social:
- Community:

## Calls To Action
- Join community
- Read Kindle
- Preorder physical

## Review Checklist
- Grounded in book + FRC + 16D + Torivers
- No new claims without sources
- Coherent tone and intent
"""


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def load_gdrive_auth():
    sys.path.append(GDRIVE_CMS_PATH)
    from gdrive_auth import get_google_services, get_credentials  # type: ignore

    drive, sheets = get_google_services(CONFIG_PATH)
    config = load_config()
    creds = get_credentials(config.get("google", {}))
    docs = build("docs", "v1", credentials=creds)
    return drive, sheets, docs


def find_file(drive, name: str, mime_type: str, folder_id: str):
    query = (
        f"'{folder_id}' in parents and trashed=false "
        f"and name='{name}' and mimeType='{mime_type}'"
    )
    result = drive.files().list(q=query, fields="files(id, name)").execute()
    files = result.get("files", [])
    return files[0] if files else None


def move_to_folder(drive, file_id: str, folder_id: str):
    parents = drive.files().get(fileId=file_id, fields="parents").execute().get("parents", [])
    drive.files().update(
        fileId=file_id,
        addParents=folder_id,
        removeParents=",".join(parents) if parents else None,
        fields="id, parents",
    ).execute()


def ensure_sheet(drive, sheets, folder_id: str) -> str:
    existing = find_file(
        drive, SHEET_TITLE, "application/vnd.google-apps.spreadsheet", folder_id
    )
    if existing:
        sheet_id = existing["id"]
    else:
        body = {
            "properties": {"title": SHEET_TITLE},
            "sheets": [
                {"properties": {"title": "Queue"}},
                {"properties": {"title": "Log"}},
            ],
        }
        sheet = sheets.spreadsheets().create(body=body).execute()
        sheet_id = sheet["spreadsheetId"]
        move_to_folder(drive, sheet_id, folder_id)

    # Ensure headers
    sheets.spreadsheets().values().update(
        spreadsheetId=sheet_id,
        range="Queue!A1",
        valueInputOption="RAW",
        body={"values": [QUEUE_HEADERS]},
    ).execute()

    sheets.spreadsheets().values().update(
        spreadsheetId=sheet_id,
        range="Log!A1",
        valueInputOption="RAW",
        body={"values": [LOG_HEADERS]},
    ).execute()

    return sheet_id


def get_doc_text(doc) -> str:
    pieces = []
    for item in doc.get("body", {}).get("content", []):
        para = item.get("paragraph")
        if not para:
            continue
        for elem in para.get("elements", []):
            text_run = elem.get("textRun")
            if text_run and text_run.get("content"):
                pieces.append(text_run["content"])
    return "".join(pieces).strip()


def ensure_doc(drive, docs, folder_id: str) -> str:
    existing = find_file(
        drive, DOC_TITLE, "application/vnd.google-apps.document", folder_id
    )
    if existing:
        doc_id = existing["id"]
    else:
        doc = docs.documents().create(body={"title": DOC_TITLE}).execute()
        doc_id = doc["documentId"]
        move_to_folder(drive, doc_id, folder_id)

    doc = docs.documents().get(documentId=doc_id).execute()
    if not get_doc_text(doc):
        docs.documents().batchUpdate(
            documentId=doc_id,
            body={
                "requests": [
                    {"insertText": {"location": {"index": 1}, "text": PLAN_TEMPLATE}}
                ]
            },
        ).execute()

    return doc_id


def write_output(sheet_id: str, doc_id: str, folder_id: str):
    data = {
        "google": {"config_path": CONFIG_PATH},
        "drive": {"folder_id": folder_id},
        "command_center": {
            "sheet_id": sheet_id,
            "sheet_name": SHEET_TITLE,
            "doc_id": doc_id,
            "doc_name": DOC_TITLE,
        },
    }
    Path(OUTPUT_PATH).parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def notify_telegram(sheet_id: str, doc_id: str):
    token = os.getenv("TELEGRAM_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID") or os.getenv("TELEGRAM_APPROVAL_CHAT_ID")
    if not token or not chat_id:
        return False

    sheet_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}"
    doc_url = f"https://docs.google.com/document/d/{doc_id}"
    message = (
        "Shabrang Command Center ready:\\n"
        f"- Sheet: {sheet_url}\\n"
        f"- Weekly Plan: {doc_url}"
    )
    payload = urlencode({"chat_id": chat_id, "text": message}).encode("utf-8")
    req = Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urlopen(req, timeout=20) as resp:
        resp.read()
    return True


def main():
    config = load_config()
    folder_id = config.get("drive", {}).get("folder_id")
    if not folder_id:
        print("Drive folder_id missing in config.", file=sys.stderr)
        sys.exit(1)

    drive, sheets, docs = load_gdrive_auth()
    sheet_id = ensure_sheet(drive, sheets, folder_id)
    doc_id = ensure_doc(drive, docs, folder_id)
    write_output(sheet_id, doc_id, folder_id)

    notified = notify_telegram(sheet_id, doc_id)
    print(f"Command Center sheet_id: {sheet_id}")
    print(f"Weekly Plan doc_id: {doc_id}")
    print(f"Telegram notified: {'yes' if notified else 'no'}")


if __name__ == "__main__":
    main()
