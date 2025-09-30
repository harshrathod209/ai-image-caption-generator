import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from app import app

# Use FastAPI's test client for sync tests or httpx.AsyncClient for async
client = TestClient(app)

# -------------------- Positive Test Case --------------------
def test_valid_image_upload(monkeypatch):
    # Mock OpenRouter API response
    def mock_post(*args, **kwargs):
        class MockResponse:
            def json(self):
                return {
                    "choices": [
                        {"message": {"content": "A beautiful sunset over the ocean."}}
                    ]
                }
        return MockResponse()

    monkeypatch.setattr("requests.post", mock_post)

    # Prepare test image
    with open("tests/sample.jpg", "rb") as img:
        response = client.post(
            "/generate-caption/",
            files={"file": ("sample.jpg", img, "image/jpeg")},
            data={"system_prompt": "Describe this image", "user_prompt": "sunset"}
        )

    assert response.status_code == 200
    assert "caption" in response.json()
    assert response.json()["caption"] == "A beautiful sunset over the ocean."

# -------------------- Negative Test Case --------------------
def test_unsupported_file_type():
    response = client.post(
        "/generate-caption/",
        files={"file": ("sample.txt", b"dummy text", "text/plain")},
        data={"system_prompt": "Describe this image", "user_prompt": ""}
    )

    assert response.status_code == 200
    assert "error" in response.json()
    assert "Unsupported file type" in response.json()["error"]

# -------------------- Missing File Test --------------------
def test_missing_file():
    response = client.post(
        "/generate-caption/",
        data={"system_prompt": "Describe this image", "user_prompt": ""}
    )

    assert response.status_code == 422  # FastAPI returns 422 for missing required fields
