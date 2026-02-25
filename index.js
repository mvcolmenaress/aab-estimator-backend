import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve widget.js
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

// Estimate route (placeholder logic for now)
app.post("/estimate", (req, res) => {
  const { damage, vehicle } = req.body || {};

  // Basic validation
  if (!damage || !vehicle) {
    return res.status(400).json({
      ok: false,
      message: "Missing required fields: damage, vehicle",
      received: { damage, vehicle },
    });
  }

  let basePrice = 0;

  // Placeholder pricing (replace with Addison pricing sheet later)
  if (damage === "dent") basePrice = 300;
  else if (damage === "scratch") basePrice = 200;
  else if (damage === "bumper") basePrice = 800;
  else basePrice = 250;

  // Vehicle multipliers
  if (vehicle === "suv") basePrice *= 1.2;
  else if (vehicle === "truck") basePrice *= 1.3;

  basePrice = Math.round(basePrice);

  return res.json({
    ok: true,
    estimate: {
      currency: "USD",
      amount: basePrice,
      range: {
        low: Math.round(basePrice * 0.9),
        high: Math.round(basePrice * 1.15),
      },
    },
    inputs: { damage, vehicle },
    note: "Placeholder estimate — will be replaced with shop pricing data.",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
