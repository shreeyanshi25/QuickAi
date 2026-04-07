# 🚀 QuickAi – AI Productivity Platform

[![React](https://img.shields.io/badge/Frontend-React%20+%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20+%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![AI Models](https://img.shields.io/badge/AI_Models-LLaMA%203.3%20|%20Pollinations-FF9900?style=for-the-badge&logo=ai&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

> **Built by**: Shreeyanshi Yadav · B.Tech CSE (AI/ML) · GLBITM · 2026 Batch  
> **Target roles**: Full-Stack SWE Intern / AI Engineer Intern

**QuickAi** is a full-stack AI-powered productivity platform engineered to centralize content creation, resume analysis, and image processing tools within a single, highly responsive web application. The platform leverages modern LLMs and local AI processing to deliver rapid, low-latency productivity tools.

---

## ✨ Features

- ✍️ **Blog Title Generator** – AI-generated, highly optimized, SEO-friendly titles.
- 📰 **Article Writer** – Structured long-form article generation powered by LLaMA 3.3.
- 📄 **Resume Reviewer** – Intelligent resume scoring mechanism highlighting strengths & improvement suggestions.
- 🖼️ **Image Generator** – High-quality AI image generation with configurable aspect ratios.
- 🎯 **Background Remover** – **Local AI-based** (no external cloud APIs needed) zero-latency background removal utilizing `@imgly`.
- 🧠 **Object Removal** – *(Planned)* Mask-based custom object removal.
- ⚙️ **Clean Architecture** – Developed with a deeply modular REST API architecture ensuring clean frontend–backend separation.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** React + Vite (for instantaneous HMR dev experience)
- **Styling:** Tailwind CSS (utility-first, responsive design)
- **Icons:** Lucide React
- **Language:** JavaScript (ES6+)

### Backend
- **Server:** Node.js + Express.js
- **Text Models:** Groq Cloud API (LLaMA 3.3 for sub-second inference)
- **Image Generation:** Pollinations AI
- **Computer Vision:** `@imgly/background-removal-node`

---

## 🧩 Project Structure

```text
QuickAi/
├── src/                  # Frontend (React)
│   ├── components/       # Reusable UI elements
│   ├── pages/            # Application views
│   └── App.jsx           # React Router and global state
│
├── server/               # Backend (Node + Express REST API)
│   ├── index.js          # Main Express server and API routes
│   └── package.json      # Backend dependencies
│
├── .env                  # Ignored env constraints
├── package.json          # Root Vite / React dependencies
└── vite.config.js        # Vite configurations
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shreeyanshi25/QuickAi.git
cd QuickAi
```

### 2️⃣ Frontend Setup

```bash
# Install Vite/React dependencies
npm install

# Start the dev server
npm run dev
```

> **The Frontend runs at:** `http://localhost:5173`

### 3️⃣ Backend Setup

```bash
cd server

# Install Express and AI dependencies
npm install

# Start the backend API
node index.js
```

> **The Backend runs at:** `http://localhost:5000`

---

## 🔐 Environment Variables

You must create a `.env` file inside the strictly `server/` folder to run the backend correctly:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.groq.com/openai/v1
PORT=5000
```
> *⚠️ Note: `.env` is properly ignored via `.gitignore` for security. Never commit your API keys.*

---

## 📸 Screenshots

### 📊 Dashboard
![Dashboard](screenshots/dashboard.png)

### ✍️ Blog Title Generator
![Blog Title Generator](screenshots/blog-titles.png)

### 🖼️ Background Remover
![Background Remover](screenshots/background-remover.png)
