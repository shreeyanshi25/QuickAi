# 🚀 QuickAi – AI Productivity Platform

QuickAi is a full-stack AI-powered web application that provides multiple productivity tools such as content generation, resume analysis, image generation, and background removal — all in one platform.

🔗 **Live Repo:** https://github.com/shreeyanshi25/QuickAi

---

## ✨ Features

- ✍️ **Blog Title Generator** – AI-generated SEO-friendly titles
- 📰 **Article Writer** – Structured long-form articles using LLMs
- 📄 **Resume Reviewer** – Resume scoring with strengths & improvement suggestions
- 🖼️ **Image Generator** – AI image generation with multiple aspect ratios
- 🎯 **Background Remover** – Local AI-based background removal (no cloud dependency)
- 🧠 **Object Removal** – Planned feature (mask-based removal)

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- Groq LLaMA 3.3
- Pollinations AI
- @imgly/background-removal-node

---

## 🧩 Project Structure
QuickAi/
├── src/ # Frontend (React)
│ ├── components
│ ├── pages
│ └── App.jsx
│
├── server/ # Backend (Node + Express)
│ ├── index.js
│ ├── package.json
│ └── .env (ignored)
│
├── .gitignore
├── README.md
├── package.json
└── vite.config.js


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/shreeyanshi25/QuickAi.git
cd QuickAi

2️⃣ Frontend Setup
npm install
npm run dev


Frontend runs at:

http://localhost:5173

3️⃣ Backend Setup
cd server
npm install
node index.js


Backend runs at:

http://localhost:5000

🔐 Environment Variables

Create a .env file inside the server folder:

OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.groq.com/openai/v1
PORT=5000


⚠️ .env is ignored via .gitignore for security.

