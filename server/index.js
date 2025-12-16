/**
 * index.js - Quick.ai backend (paste this file directly)
 *
 * Required packages:
 * npm i express cors dotenv openai @imgly/background-removal-node node-fetch
 *
 * NOTE: This file uses ESM `import` syntax. Make sure your package.json has:
 *   "type": "module"
 *
 * If you're using Node 18+ you can remove the node-fetch import and the fetch import usage,
 * but keeping node-fetch is safe across Node versions.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { removeBackground } from "@imgly/background-removal-node";
import fs from "fs";
import os from "os";
import path from "path";
import fetch from "node-fetch"; // safe fallback for Node < 18

dotenv.config();

/* -------------------- OPENAI / GROQ CONFIG -------------------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || undefined,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

/* -------------------- CRITICAL FIX: PAYLOAD LIMIT -------------------- */
// Allow large image payloads up to 50MB from the frontend (base64 JSON payloads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* -------------------- HEALTH CHECK -------------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Quick.ai backend is running" });
});

/* -------------------- BLOG TITLES (GROQ) -------------------- */
app.post("/api/blog-titles", async (req, res) => {
  const { keyword, category = "General", tone = "Neutral", count = 5 } = req.body || {};

  if (!keyword || !keyword.trim()) {
    return res.status(400).json({ message: "Keyword is required" });
  }
  const safeCount = Math.min(Math.max(Number(count) || 5, 3), 10);
  const cleanKeyword = keyword.trim();

  try {
    const prompt = `
You are a content marketing assistant.
Generate ${safeCount} catchy blog post titles as a JSON array of strings.
Topic: "${cleanKeyword}"
Category: ${category}
Tone: ${tone}

Return ONLY valid JSON array, nothing else. Do not add markdown.
`;
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const raw = completion.choices[0]?.message?.content || "[]";
    let titles = [];
    try {
      titles = JSON.parse(raw);
    } catch {
      titles = raw
        .split("\n")
        .map((t) => t.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
    }

    return res.json({ titles: titles.slice(0, safeCount), meta: { category, tone, count: safeCount } });
  } catch (err) {
    console.error("Blog titles error:", err?.message || err, err?.stack || "");
    return res.status(500).json({ message: "Failed to generate titles from AI." });
  }
});

/* -------------------- ARTICLE WRITER (GROQ) -------------------- */
app.post("/api/write-article", async (req, res) => {
  const { topic, tone = "Neutral", length = "Medium", includeOutline = true } = req.body || {};

  if (!topic || !topic.trim()) return res.status(400).json({ message: "Topic is required." });

  let targetWords = length === "Short" ? 500 : length === "Long" ? 1500 : 800;

  const systemPrompt = `
You are an article-writing assistant.
Write a structured article in Markdown about the given topic.
Tone: ${tone}
Target length: about ${targetWords} words.
Include headings and bullet points. Write in clear English.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Topic: ${topic.trim()}` },
      ],
      temperature: 0.8,
    });

    const article = completion.choices[0]?.message?.content || "Sorry, I couldn't generate an article.";
    return res.json({ article, meta: { tone, length, targetWords } });
  } catch (err) {
    console.error("Write article error:", err?.message || err, err?.stack || "");
    return res.status(500).json({ message: "Failed to generate article." });
  }
});

/* -------------------- RESUME REVIEWER (GROQ) -------------------- */
app.post("/api/review-resume", async (req, res) => {
  const { role, resumeText } = req.body || {};

  if (!resumeText || typeof resumeText !== "string") {
    return res.status(400).json({ message: "resumeText is required." });
  }

  const systemPrompt = `
You are a resume reviewer for tech roles.
Given a resume and a target role, return feedback as JSON with keys:
- score (0-100)
- summary (1-3 sentences)
- strengths (array of strings)
- improvements (array of strings)
Return ONLY valid JSON.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Target role: ${role || "Not specified"}\n\nResume:\n${resumeText.trim()}` },
      ],
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    let aiFeedback = {};
    try {
      aiFeedback = JSON.parse(raw);
    } catch {
      aiFeedback = {};
    }

    return res.json({
      role,
      score: aiFeedback.score ?? 70,
      summary: aiFeedback.summary ?? "Review completed.",
      strengths: aiFeedback.strengths ?? [],
      improvements: aiFeedback.improvements ?? [],
      from: "groq-llama",
    });
  } catch (err) {
    console.error("Resume review error:", err?.message || err, err?.stack || "");
    return res.status(500).json({ message: "Failed to review resume." });
  }
});

/* -------------------- IMAGE GENERATION (POLLINATIONS AI) -------------------- */
app.post("/api/generate-image", (req, res) => {
  const { prompt = "", style = "Default", aspectRatio = "Square (1:1)", count = 4 } = req.body || {};

  if (!prompt || !prompt.trim()) return res.status(400).json({ message: "Prompt is required" });

  const cleanPrompt = prompt.trim();
  const safeCount = Math.min(Math.max(Number(count) || 1, 1), 4);

  const images = Array.from({ length: safeCount }).map((_, i) => {
    let w = 1024, h = 1024;
    if (aspectRatio.includes("16:9")) { w = 1280; h = 720; }
    else if (aspectRatio.includes("9:16")) { w = 720; h = 1280; }
    else if (aspectRatio.includes("4:3")) { w = 1024; h = 768; }

    const enhancedPrompt = style !== "Default" ? `${cleanPrompt}, ${style} style` : cleanPrompt;
    const seed = Math.floor(Math.random() * 1000000);

    // Using Pollinations.ai (Free, no key required)
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${w}&height=${h}&seed=${seed}&model=flux&nologo=true`;

    return { id: i + 1, url, prompt: cleanPrompt, style, aspectRatio };
  });

  return res.json({ images });
});

/* -------------------- BACKGROUND REMOVAL (ROBUST) -------------------- */
app.post("/api/remove-background", async (req, res) => {
  const { imageUrl } = req.body || {};

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL (or data:) is required" });
  }

  try {
    console.log("Processing background removal...");

    // 1) Load image as a Buffer
    let imageBuffer;
    if (typeof imageUrl !== "string") {
      throw new Error("imageUrl must be a string containing a remote URL or data URL.");
    }

    if (imageUrl.startsWith("data:")) {
      // data:image/png;base64,...
      const parts = imageUrl.split(",");
      if (!parts[1]) throw new Error("Invalid data URL");
      imageBuffer = Buffer.from(parts[1], "base64");
    } else if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      // fetch remote image
      const resp = await fetch(imageUrl);
      if (!resp.ok) throw new Error(`Failed to fetch image URL, status ${resp.status}`);
      const arrayBuffer = await resp.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      // treat as a local path (rare) - attempt to read
      imageBuffer = await fs.promises.readFile(imageUrl);
    }

    // 2) Try calling removeBackground with a Buffer first
    let resultBlob = null;
    try {
      resultBlob = await removeBackground(imageBuffer);
    } catch (firstErr) {
      console.warn("removeBackground(Buffer) failed:", firstErr?.message || firstErr);

      // fallback: write a temp file and try with file path
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "bg-rem-"));
      const tmpFilePath = path.join(tmpDir, `input-${Date.now()}.png`);
      await fs.promises.writeFile(tmpFilePath, imageBuffer);

      try {
        resultBlob = await removeBackground(tmpFilePath);
      } finally {
        // cleanup
        try {
          await fs.promises.rm(tmpFilePath);
          await fs.promises.rmdir(tmpDir);
        } catch (cleanupErr) {
          console.warn("Temp cleanup failed:", cleanupErr?.message || cleanupErr);
        }
      }
    }

    if (!resultBlob) {
      throw new Error("Background removal returned empty result.");
    }

    // 3) Convert result to Buffer/base64
    let resultBuffer;
    if (Buffer.isBuffer(resultBlob)) {
      resultBuffer = resultBlob;
    } else if (typeof resultBlob.arrayBuffer === "function") {
      const ab = await resultBlob.arrayBuffer();
      resultBuffer = Buffer.from(ab);
    } else if (resultBlob.data && Buffer.isBuffer(resultBlob.data)) {
      resultBuffer = resultBlob.data;
    } else {
      throw new Error("Unknown result type from removeBackground");
    }

    const base64Image = `data:image/png;base64,${resultBuffer.toString("base64")}`;

    return res.json({
      message: "Background removed successfully",
      resultUrl: base64Image,
    });
  } catch (error) {
    console.error("Background removal error:", error?.message || error, error?.stack || "");
    return res.status(500).json({
      message: "Failed to remove background. Ensure the image is valid and check server logs for details.",
      error: (error && (error.message || String(error))),
    });
  }
});

/* -------------------- OBJECT REMOVAL (Placeholder) -------------------- */
app.post("/api/remove-object", (req, res) => {
  res.json({
    message: "To remove objects, the frontend needs a 'masking' tool. This is a placeholder.",
    resultUrl: "https://via.placeholder.com/512x512.png?text=Object+Removal+Requires+Mask"
  });
});

/* -------------------- COMMUNITY (DEMO) -------------------- */
app.get("/api/community/demo-posts", (req, res) => {
  res.json({
    posts: [
      { id: 1, author: "Demo User", content: "Just generated amazing blog titles!", tool: "Blog Generator", likes: 5, createdAt: new Date().toISOString() },
      { id: 2, author: "Creator", content: "Background removal is super fast.", tool: "BG Remover", likes: 8, createdAt: new Date().toISOString() },
    ],
  });
});

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
