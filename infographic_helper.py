import re
import sys
import os

def extract_concepts(text):
    """
    Extracts key FRC concepts from the provided text.
    Returns a dictionary with structured data.
    """
    concepts = {
        "title": "Unknown Chapter",
        "thesis": [],
        "mu_levels": [],
        "metaphors": [],
        "quotes": []
    }

    # title extraction (simple heuristic: first line or line starting with CHAPTER)
    lines = text.split('\n')
    for line in lines[:10]:
        if "CHAPTER" in line.upper() or "PART" in line.upper():
            concepts["title"] = line.strip()
            break
        if line.strip() and not concepts["title"]:
             concepts["title"] = line.strip()

    # Regex patterns for FRC concepts
    
    # Looking for "Core Thesis" or similar triggers
    thesis_match = re.search(r'(Core Thesis|Main Idea|Summary):(.*?)(?=\n\n|\n[A-Z])', text, re.DOTALL | re.IGNORECASE)
    if thesis_match:
        concepts["thesis"].append(thesis_match.group(2).strip())

    # Looking for Mu-Levels (Level 1, Level 2, ... or Mu1, Mu2...)
    # This captures lines that look like definitions of levels
    mu_pattern = re.findall(r'(Level \d|Mu\d|μ\d|root|rhythm|fire|map|garden|story|sky)[\s\:\-]+([^\n]+)', text, re.IGNORECASE)
    for match in mu_pattern:
        concepts["mu_levels"].append(f"{match[0].title()}: {match[1].strip()}")

    # Looking for Metaphors (often introduced by "is a", "act as", "like a")
    # This is rough and will capture noise, but good for drafting
    metaphor_pattern = re.findall(r'(\w+)\s+(is a|acts as|like a)\s+([^\.]+)', text, re.IGNORECASE)
    for match in metaphor_pattern:
        if len(match[2]) > 5 and len(match[2]) < 100: # Filter short/long noise
             concepts["metaphors"].append(f"{match[0]} {match[1]} {match[2]}")

    # Looking for Quotes (text in quotes associated with famous names or just quoted)
    # Heuristic: lines starting with "*" or "-" often contain key summaries in this user's style
    bullet_points = re.findall(r'^\s*[\*\-]\s+(.*)', text, re.MULTILINE)
    concepts["quotes"].extend(bullet_points[:5]) # Take first 5 bullet points as key summaries

    return concepts

def format_for_affinity(concepts):
    """
    Formats the concepts into a text block suitable for copy-pasting into Affinity/Design tools.
    """
    output = []
    output.append(f"--- INFOGRAPHIC BRIEF: {concepts['title']} ---")
    output.append("\n[1. HEADLINE/THESIS]")
    if concepts['thesis']:
        output.append(concepts['thesis'][0])
    else:
        output.append("[No explicit thesis found - insert manual summary]")

    output.append("\n[2. THE STACK (Structural Layers)]")
    if concepts['mu_levels']:
        for level in concepts['mu_levels']:
            output.append(f"- {level}")
    else:
        output.append("No specific levels (Roots, Rhythm, etc.) detected.")

    output.append("\n[3. VISUAL METAPHORS (For Icons/Midjourney)]")
    if concepts['metaphors']:
        for meta in list(set(concepts['metaphors']))[:6]: # minimal dups
            output.append(f"- {meta}")
    else:
        output.append("No clear metaphors extracted.")

    output.append("\n[4. KEY TEXT/BULLETS]")
    if concepts['quotes']:
        for quote in concepts['quotes']:
            output.append(f"• {quote}")
            
    output.append("\n-------------------------------------------")
    return "\n".join(output)

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 infographic_helper.py <path_to_chapter.txt>")
        return

    file_path = sys.argv[1]
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
            
        data = extract_concepts(text)
        report = format_for_affinity(data)
        
        print(report)
        
        # Optionally save to a .infographic.txt file
        out_path = file_path + ".infographic.txt"
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"\n[Saved to {out_path}]")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
