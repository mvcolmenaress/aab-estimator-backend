import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { calculateEstimate } from "./pricing.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    "https://orchid-armadillo-ehb8.squarespace.com",
    "http://localhost:3000",
    /\.squarespace\.com$/,
    /\.sqsp\.net$/,
  ],
  methods: ["GET", "POST"],
}));
app.use(express.json());

// Serve widget.js from public folder
app.get("/widget.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "widget.js"));
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "AAB Estimator API is running",
    timestamp: new Date().toISOString(),
  });
});

// AI-powered estimate route
app.post("/chat", async (req, res) => {
  const { messages } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ ok: false, message: "Missing messages array" });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ ok: false, message: "API key not configured" });
  }

  try {
    const systemPrompt = `You are a friendly auto body repair estimator assistant for Addison Auto Body (AAB), a professional auto body shop. 

Your job is to:
1. Greet the customer warmly and ask about their vehicle damage
2. Gather the following info through natural conversation:
   - What was damaged (front bumper, door, hood, rear bumper, fender, etc.)
   - Severity of damage (low = minor scuffs/dents, medium = moderate damage, high = severe/structural)
   - Vehicle type (sedan, SUV, truck, van)
   - Whether airbags deployed (yes/no)
   - Whether the vehicle is still drivable (yes/no)
   - Whether they have insurance and their deductible (optional)
3. Once you have enough info, provide a friendly estimate summary

When you have enough information to estimate, end your message with a JSON block in this exact format (the system will parse it):
<ESTIMATE>
{
  "service_category": "Collision Repair",
  "damage_area": ["front bumper"],
  "severity": "medium",
  "vehicle_type": "sedan",
  "airbags_deployed": false,
  "drivable": true,
  "insurance": { "deductible": 500 }
}
</ESTIMATE>

service_category must be either "Collision Repair" or "Paint & Dent Services".
severity must be "low", "medium", or "high".
Only include the ESTIMATE block when you have enough info to give a real estimate.

Keep responses concise, warm, and professional. You represent a trusted local shop.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ ok: false, message: data.error?.message || "AI error" });
    }

    const text = data.content?.[0]?.text || "";

    // Check if AI included an ESTIMATE block
    const estimateMatch = text.match(/<ESTIMATE>([\s\S]*?)<\/ESTIMATE>/);
    let estimate = null;

    if (estimateMatch) {
      try {
        const structured = JSON.parse(estimateMatch[1].trim());
        estimate = calculateEstimate(structured);
      } catch (e) {
        console.error("Failed to parse estimate JSON", e);
      }
    }

    // Strip the ESTIMATE block from the message shown to user
    const cleanText = text.replace(/<ESTIMATE>[\s\S]*?<\/ESTIMATE>/, "").trim();

    return res.json({
      ok: true,
      message: cleanText,
      estimate,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
