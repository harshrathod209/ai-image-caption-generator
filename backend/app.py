# -------------------- Imports --------------------
import os
import base64
import requests
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# -------------------- Environment Setup --------------------
# Load environment variables from .env file
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")  # API key for OpenRouter

# -------------------- FastAPI App Initialization --------------------
app = FastAPI()

# Enable CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Caption Generation Endpoint --------------------
@app.post("/generate-caption/")
async def generate_caption(
    file: UploadFile = File(...),  # Image file uploaded by user
    system_prompt: str = Form("Describe this image in a short caption."),  # Default system prompt
    user_prompt: str = Form("")  # Optional user prompt
):
    # Validate MIME type (fallback to JPEG if unknown)
    content_type = file.content_type or "image/jpeg"
    if content_type not in ["image/jpeg", "image/png", "image/webp"]:
        return {"error": f"Unsupported file type: {content_type}"}

    # Read image bytes and encode to base64 for API compatibility
    image_bytes = await file.read()
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    # Construct multimodal message payload for GPT-4o-mini
    messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": user_prompt},
                {"type": "image_url", "image_url": {
                    "url": f"data:{content_type};base64,{base64_image}"}
                }
            ],
        },
    ]

    try:
        # Send POST request to OpenRouter API
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-4o-mini",  # Multimodal model
                "messages": messages,
                "max_tokens": 100,  # Limit response length
            },
        )

        # Parse response JSON
        data = response.json()

        # Handle missing or malformed response
        if "choices" not in data:
            return {"error": data}

        # Extract caption from response
        caption = data["choices"][0]["message"]["content"]
        return {"caption": caption}

    except Exception as e:
        # Catch and return any runtime errors
        return {"error": str(e)}
