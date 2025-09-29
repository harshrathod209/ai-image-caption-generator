import os
import base64
import requests
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-caption/")
async def generate_caption(
    file: UploadFile = File(...),
    system_prompt: str = Form("Describe this image in a short caption."),
    user_prompt: str = Form("")
):
    # Validate MIME type (default to jpeg if unknown)
    content_type = file.content_type or "image/jpeg"
    if content_type not in ["image/jpeg", "image/png", "image/webp"]:
        return {"error": f"Unsupported file type: {content_type}"}

    # Read and encode image
    image_bytes = await file.read()
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    # Messages for multimodal input
    messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": user_prompt},
                {"type": "image_url", "image_url": {"url": f"data:{content_type};base64,{base64_image}"}}
            ],
        },
    ]

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-4o-mini",  # multimodal model
                "messages": messages,
                "max_tokens": 100,
            },
        )

        data = response.json()

        if "choices" not in data:
            return {"error": data}

        caption = data["choices"][0]["message"]["content"]
        return {"caption": caption}

    except Exception as e:
        return {"error": str(e)}
