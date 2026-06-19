"""
Quick test script for Gemini API (Nano Banana Pro / Veo 3.1)
Run this to verify the API key works and test image generation.
"""

import os
from pathlib import Path

# Try to import google-genai
try:
    from google import genai
    print("✓ google-genai package found")
except ImportError:
    print("✗ google-genai not installed. Run: pip install google-genai")
    exit(1)

# API Key (from .env or direct)
API_KEY = os.getenv("NANOBANANA_API_KEY") or "AIzaSyDp-FnLAezKU_gqv60hELJ3lhTJshR3LQw"

# Initialize client
client = genai.Client(api_key=API_KEY)

# =============================================================================
# TEST 1: List available models
# =============================================================================

def test_list_models():
    """Check what models are available."""
    print("\n" + "="*50)
    print("TEST 1: Listing available models...")
    print("="*50)

    try:
        models = client.models.list()
        print("\nAvailable models:")
        for model in models:
            if 'image' in model.name.lower() or 'veo' in model.name.lower() or 'flash' in model.name.lower():
                print(f"  • {model.name}")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


# =============================================================================
# TEST 2: Generate a simple image
# =============================================================================

def test_generate_image():
    """Test image generation with ALETTE style."""
    print("\n" + "="*50)
    print("TEST 2: Generating test image...")
    print("="*50)

    prompt = """
    Generate an image in Persian miniature style:

    A black horse (Shabrang) standing noble and proud.

    STRICT STYLE REQUIREMENTS:
    - Background: Warm cream/aged parchment (#F5E6C8)
    - Horse outlined in coal black (#1A1A18)
    - Decorative tack in antique gold (#C9A227) and deep teal (#2D5A6B)
    - Flat perspective (NO 3D rendering)
    - Clean black ink outlines
    - Solid color fills (NO gradients)
    - Simple geometric Persian border frame
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",  # Use available model
            contents=prompt,
        )

        print("\nResponse received!")
        print(f"Candidates: {len(response.candidates) if response.candidates else 0}")

        if response.candidates:
            for i, candidate in enumerate(response.candidates):
                print(f"\nCandidate {i}:")
                for part in candidate.content.parts:
                    if hasattr(part, 'text'):
                        print(f"  Text: {part.text[:200]}...")
                    if hasattr(part, 'inline_data'):
                        print(f"  Image data: {len(part.inline_data.data)} bytes")
                        # Save the image
                        output_path = Path(__file__).parent / "test_shabrang.png"
                        with open(output_path, 'wb') as f:
                            f.write(part.inline_data.data)
                        print(f"  ✓ Image saved to: {output_path}")

        return True

    except Exception as e:
        print(f"✗ Error: {e}")
        return False


# =============================================================================
# TEST 3: Check Veo availability
# =============================================================================

def test_veo_availability():
    """Check if Veo 3.1 is available."""
    print("\n" + "="*50)
    print("TEST 3: Checking Veo 3.1 availability...")
    print("="*50)

    try:
        # Try to get model info
        models = client.models.list()
        veo_models = [m for m in models if 'veo' in m.name.lower()]

        if veo_models:
            print("\n✓ Veo models available:")
            for m in veo_models:
                print(f"  • {m.name}")
        else:
            print("\n⚠ No Veo models found in your API tier.")
            print("  Veo 3.1 may require paid tier access.")

        return True

    except Exception as e:
        print(f"✗ Error: {e}")
        return False


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("SHABRANG CONTENT MACHINE - API TEST")
    print("="*60)
    print(f"\nUsing API key: {API_KEY[:20]}...")

    results = []

    results.append(("List Models", test_list_models()))
    results.append(("Generate Image", test_generate_image()))
    results.append(("Veo Availability", test_veo_availability()))

    print("\n" + "="*60)
    print("TEST RESULTS")
    print("="*60)
    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"  {status}: {name}")

    print("\n" + "="*60)
