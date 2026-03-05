import express from "express";
import cors from "cors";
import extractRouter from "./routes/extract.js";
import recombineRouter from "./routes/recombine.js";

const PORT = 3001;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }),
);

app.use(express.json({ limit: "50mb" }));

// ── Routes ────────────────────────────────────────────────────────
app.post("/api/extract", extractRouter);
app.post("/api/recombine", recombineRouter);

// ── Health check ──────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(
    `Michelangelo extraction server running on http://localhost:${PORT}`,
  );
  console.log(`  POST /api/extract    { url: "https://..." }`);
  console.log(`  POST /api/recombine  { target, parts, tasteProfile? }`);
  console.log(`  GET  /api/health`);
});
