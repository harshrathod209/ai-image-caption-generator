# 🖼️ AI Image Caption Generator

A full-stack web application that generates short, descriptive captions for uploaded images using AI. 
Built with **React** on the frontend and **FastAPI** on the backend, it leverages **OpenRouter's GPT-4o-mini** model for multimodal caption generation.

---

## 🚀 Features

- Upload JPEG, PNG, or WebP images
- Provide system and user prompts for caption customization
- Generate captions using GPT-4o-mini via OpenRouter API
- Copy or download generated captions
- Responsive UI with drag-and-drop support
- Modular React components and clean CSS styling

---

## 🧱 Tech Stack

| Layer      | Technology             |
|------------|------------------------|
| Frontend   | React, Axios           |
| Backend    | FastAPI, Python        |
| AI Model   | OpenRouter GPT-4o-mini |
| Styling    | CSS                    |
| Auth       | API Key via `.env`     |
| Hosting    | Local (development)    |

---

## 📦 Backend Setup (FastAPI)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd backend


2. Create a virtual environment
  - python3 -m venv venv
  - source venv/bin/activate   # On Windows: venv\Scripts\activate

3. Install dependencies
  - pip install fastapi uvicorn python-multipart requests python-dotenv

4. Create a .env file in the backend folder
  - OPENROUTER_API_KEY=your-openrouter-api-key

5. Run the server
  - uvicorn app:app --reload


💻 Frontend Setup (React)

1. Navigate to the frontend directory
  - cd frontend

2. Install dependencies
  - npm install

3. Create a .env file in the frontend folder
  - REACT_APP_BACKEND_URL=http://127.0.0.1:8000

4. Start the development server
  - npm start
  - The frontend will be available at: http://localhost:3000


📁 Project Structure

backend/
└── app.py
└── .env

frontend/
└── src/
    ├── App.jsx
    ├── components/
    ├── hooks/
    ├── utils/
    └── styles/
└── .env
└── package.json


🛡️ Security Notes
  - Never commit .env files to version control.
  - API keys should be rotated periodically and stored securely.
  - CORS is enabled for development; restrict origins in production.

🙌 Acknowledgments
  - OpenRouter for multimodal AI access
  - FastAPI for backend framework
  - React for frontend development
