const express = require("express");
const { verifyToken }  = require("../middleware/auth");
const { heavyLimiter } = require("../middleware/security");

const router = express.Router();

const AI_URL    = process.env.AI_SERVER_URL || "http://localhost:8000";
const AI_KEY    = process.env.AI_API_KEY    || "oilintel-ai-dev-key";

// Generic proxy to FastAPI AI server — avoids exposing AI_KEY to the browser
async function proxyAI(path, body, res) {
  try {
    const upstream = await fetch(`${AI_URL}${path}`, {
      method:  body ? "POST" : "GET",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${AI_KEY}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error("[AI] Upstream error:", err.message);
    res.status(502).json({ error: "AI service unavailable." });
  }
}

// POST /api/ai/prices
router.post("/prices", verifyToken, heavyLimiter, (req, res) =>
  proxyAI("/predict/prices", req.body, res)
);

// POST /api/ai/demand
router.post("/demand", verifyToken, heavyLimiter, (req, res) =>
  proxyAI("/predict/demand", req.body, res)
);

// POST /api/ai/anomalies
router.post("/anomalies", verifyToken, heavyLimiter, (req, res) =>
  proxyAI("/predict/anomalies", req.body, res)
);

// GET /api/ai/sentiment
router.get("/sentiment", verifyToken, (req, res) =>
  proxyAI("/predict/sentiment", null, res)
);

// GET /api/ai/health
router.get("/health", verifyToken, (req, res) =>
  proxyAI("/health", null, res)
);

module.exports = router;
