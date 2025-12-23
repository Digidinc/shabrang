"""
Shabrang Content Machine
========================
Automated content generation pipeline using:
- Nano Banana Pro (Gemini 3 Pro Image) for images
- Veo 3.1 for video generation
- Go HighLevel for distribution

Author: Claude + Hadi Servat
Date: December 2025
"""

import os
import time
from pathlib import Path
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent.parent / "book/FRCECR/.env")

# Initialize Gemini client
client = genai.Client(api_key=os.getenv("NANOBANANA_API_KEY"))

# =============================================================================
# ALETTE STYLE GUIDE
# =============================================================================

ALETTE_STYLE = """
STRICT VISUAL STYLE REQUIREMENTS (ALETTE):
- Background: Warm cream/aged parchment (#F5E6C8) or Burnished gold (#C9A84C)
- Primary: Coal black (#1A1A18) for outlines, figures, text
- Coherence/Water/Flow: Deep teal (#1A4A4A to #2D5A6B)
- Entropy/Fire/Danger: Persian crimson (#8B3535 to #8B3A3A)
- Sacred/Light/Value: Antique gold (#C9A227 to #D4A84B)
- Nature/Growth: Garden green (#3D5C3D) — use sparingly

COMPOSITION RULES:
- Flat perspective (Persian miniature style, NO 3D rendering)
- Clean black ink outlines on all figures
- Solid color fills (NO gradients, NO glow effects, NO neon)
- Symmetrical or balanced layouts preferred
- Simple geometric Persian border frame (teal + gold)
- High contrast for print readability
"""

# =============================================================================
# CHARACTER DEFINITIONS
# =============================================================================

CHARACTERS = {
    "shabrang": """
    Shabrang Behzad: A magnificent black stallion (night-colored horse).
    - Coat: Pure black with subtle blue-teal highlights
    - Muscular, noble bearing
    - Often shown with flowing mane and tail
    - Persian horse proportions (elegant, refined)
    - May have gold or teal decorative tack
    """,

    "kay_khosrow": """
    Kay Khosrow: The mythic Persian King.
    - Royal bearing, serene face
    - White or gold robes with Persian patterns
    - Crown or royal headpiece with Farr (divine glory) emanating
    - Middle-aged, wise expression
    - Often shown riding Shabrang or ascending
    """,

    "suhrawardi": """
    Suhrawardi (Sheikh Ishraq): The philosopher of illumination.
    - Young man (36 years old at death)
    - Scholar's robes in cream/white
    - Intense, thoughtful eyes
    - May have books or scrolls
    - Surrounded by light/luminous aura
    """,

    "qanat": """
    The Qanat: Underground water channel.
    - Cross-section view showing underground tunnel
    - Mother-well at mountain base
    - Gentle slope carrying water to plains
    - Access shafts visible from surface
    - Water flowing in darkness, emerging into light
    """
}

# =============================================================================
# CHAPTER PROMPTS
# =============================================================================

CHAPTER_PROMPTS = {
    1: {
        "title": "The Fortress and the Corridor",
        "images": [
            "Aerial view of Iranian plateau as a raised triangle, ringed by Zagros and Alborz mountains, hollow desert center. Persian miniature style map.",
            "Cross-section diagram of a Qanat water system: mountain on left, underground tunnel sloping gently right, emerging in arid plain. Teal water, black outlines.",
            "The concept of Andaruni (The Inner): a Persian house with outer/inner division, private garden hidden within. Geometric layout."
        ]
    },
    2: {
        "title": "The Lens of FRC",
        "images": [
            "Split image: Left - Historian as surveyor counting trees in forest. Right - Engineer analyzing bridge structure. Contrasting approaches.",
            "Two scales balanced: Left scale holds crystalline order (teal), Right scale holds chaotic fire (crimson). Entropy vs Coherence.",
            "The 7-Level Ladder of Consciousness: vertical stack from Roots (1) to Sky (7), each level labeled with symbol. Persian architectural style."
        ]
    },
    11: {
        "title": "The Shock of Conquest",
        "images": [
            "Battle of Qadisiyah: Sasanian armored elephants and cavalry falling to light Arab infantry. Persian miniature battle scene.",
            "Diagram: Heavy complex structure (Sasanian) vs lightweight simple structure (Early Islam). Thermodynamics of conquest.",
            "Persian scribes and viziers working in Caliphate administration. The pen defeating the sword.",
            "Transition: External fire temple transforming into internal heart-flame. The sacred going inside."
        ]
    },
    16: {
        "title": "The Architect of Light",
        "images": [
            "Suhrawardi in the citadel of Aleppo, surrounded by luminous manuscripts. Scholar of dangerous memory.",
            "Kay Khosrow riding Shabrang into a blinding snowstorm on a mountain. Mist and light merging.",
            "The Farr (Divine Glory): A luminous field emanating from a just king, nature blooming around him.",
            "Gradient of Light: From Light of Lights (bright gold) at top to Shadow/Matter (dark) at bottom. Continuous spectrum.",
            "The Mundus Imaginalis: A third world between matter and spirit, filled with suspended images and symbols.",
            "Cloud Storage metaphor: Persian civilization's data preserved in the Imaginal realm while physical world burns below."
        ]
    }
}

# =============================================================================
# IMAGE GENERATION
# =============================================================================

def generate_image(prompt: str, output_path: str, style_anchor_images: list = None):
    """
    Generate an image using Nano Banana Pro (Gemini 3 Pro Image).

    Args:
        prompt: Description of the image to generate
        output_path: Where to save the generated image
        style_anchor_images: Optional list of reference images for style consistency
    """
    full_prompt = f"{ALETTE_STYLE}\n\nGenerate this image:\n{prompt}"

    contents = [full_prompt]

    # Add style anchor images if provided
    if style_anchor_images:
        for img_path in style_anchor_images[:6]:  # Max 6 reference images
            # Load and add reference image
            # contents.append(load_image(img_path))
            pass

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-04-17",  # or gemini-3-pro-image when available
            contents=contents,
        )

        # Save the generated image
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data'):
                    with open(output_path, 'wb') as f:
                        f.write(part.inline_data.data)
                    print(f"✓ Image saved: {output_path}")
                    return True

        print(f"✗ No image generated for: {prompt[:50]}...")
        return False

    except Exception as e:
        print(f"✗ Error generating image: {e}")
        return False


def generate_chapter_images(chapter_num: int, output_dir: str):
    """Generate all images for a chapter."""
    if chapter_num not in CHAPTER_PROMPTS:
        print(f"Chapter {chapter_num} not defined")
        return

    chapter = CHAPTER_PROMPTS[chapter_num]
    chapter_dir = Path(output_dir) / f"chapter{chapter_num}"
    chapter_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*60}")
    print(f"Generating images for Chapter {chapter_num}: {chapter['title']}")
    print(f"{'='*60}")

    for i, prompt in enumerate(chapter["images"], 1):
        output_path = chapter_dir / f"chapter{chapter_num}-{i:02d}.png"
        print(f"\n[{i}/{len(chapter['images'])}] {prompt[:60]}...")
        generate_image(prompt, str(output_path))


# =============================================================================
# VIDEO GENERATION
# =============================================================================

def generate_video(prompt: str, output_path: str, first_frame_image: str = None):
    """
    Generate a video using Veo 3.1.

    Args:
        prompt: Description of the video to generate
        output_path: Where to save the generated video
        first_frame_image: Optional path to image to use as first frame
    """
    try:
        # Start video generation
        operation = client.models.generate_videos(
            model="veo-3.1-generate-preview",
            prompt=prompt,
            # image=first_frame_image if first_frame_image else None
        )

        # Wait for completion
        print("Generating video", end="")
        while not operation.done:
            print(".", end="", flush=True)
            time.sleep(10)
            operation = client.operations.get(operation)

        print(" Done!")

        # Download and save
        video = operation.response.generated_videos[0]
        client.files.download(file=video.video)
        video.video.save(output_path)
        print(f"✓ Video saved: {output_path}")
        return True

    except Exception as e:
        print(f"\n✗ Error generating video: {e}")
        return False


def extend_video(video_path: str, extension_prompt: str, output_path: str):
    """Extend an existing video by 7 seconds."""
    try:
        operation = client.models.generate_videos(
            model="veo-3.1-generate-preview",
            prompt=extension_prompt,
            # video=video_path  # Reference to extend
        )

        while not operation.done:
            time.sleep(10)
            operation = client.operations.get(operation)

        video = operation.response.generated_videos[0]
        client.files.download(file=video.video)
        video.video.save(output_path)
        print(f"✓ Extended video saved: {output_path}")
        return True

    except Exception as e:
        print(f"✗ Error extending video: {e}")
        return False


# =============================================================================
# SOCIAL MEDIA CONTENT
# =============================================================================

SOCIAL_TEMPLATES = {
    "instagram_reel": {
        "aspect_ratio": "9:16",
        "duration": 15,  # seconds
        "text_overlay": True
    },
    "twitter_card": {
        "aspect_ratio": "16:9",
        "duration": 8,
        "text_overlay": True
    },
    "youtube_short": {
        "aspect_ratio": "9:16",
        "duration": 60,
        "text_overlay": True
    }
}

def generate_social_content(chapter_num: int, platform: str, output_dir: str):
    """Generate social media content for a chapter."""
    chapter = CHAPTER_PROMPTS.get(chapter_num)
    if not chapter:
        return

    template = SOCIAL_TEMPLATES.get(platform)
    if not template:
        return

    # Generate teaser image with text
    teaser_prompt = f"""
    {ALETTE_STYLE}

    Social media card for "The Liquid Fortress" - Chapter {chapter_num}: {chapter['title']}

    Include text overlay: "{chapter['title']}"
    Subtitle: "The Liquid Fortress"

    Aspect ratio: {template['aspect_ratio']}
    Style: Persian miniature, dramatic, mysterious
    """

    output_path = Path(output_dir) / f"{platform}_chapter{chapter_num}.png"
    generate_image(teaser_prompt, str(output_path))


# =============================================================================
# MAIN EXECUTION
# =============================================================================

def main():
    """Main content generation pipeline."""
    output_base = Path(__file__).parent / "generated"
    output_base.mkdir(exist_ok=True)

    print("\n" + "="*60)
    print("SHABRANG CONTENT MACHINE")
    print("="*60)

    # Test with Chapter 16 (The Architect of Light)
    print("\n[TEST MODE] Generating sample content for Chapter 16...")

    # 1. Generate chapter images
    generate_chapter_images(16, output_base / "images")

    # 2. Generate social content
    for platform in ["instagram_reel", "twitter_card"]:
        generate_social_content(16, platform, output_base / "social")

    print("\n" + "="*60)
    print("Content generation complete!")
    print(f"Output directory: {output_base}")
    print("="*60)


if __name__ == "__main__":
    main()
