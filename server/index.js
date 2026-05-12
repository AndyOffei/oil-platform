require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const https    = require("https");
const http     = require("http");
const path     = require("path");
const fs       = require("fs");

const { helmetMiddleware, apiLimiter, hppMiddleware, securityLogger } = require("./middleware/security");

const authRouter       = require("./routes/auth");
const analyticsRouter  = require("./routes/analytics");
const adminRouter      = require("./routes/admin");
const monitoringRouter = require("./routes/monitoring");
const reportsRouter    = require("./routes/reports");
const aiRouter         = require("./routes/ai");

const PORT      = parseInt(process.env.PORT || "4000", 10);
const HTTPS_PORT = PORT + 443;  // 4443

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmetMiddleware);

// ── CORS — tight allowlist ────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3001",
];
app.use(cors({
  origin: (origin, cb) => {
    // Allow curl / server-to-server (no Origin header) in dev
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials:      true,
  methods:          ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders:   ["Content-Type", "Authorization"],
  exposedHeaders:   ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
  maxAge:           600,   // preflight cache 10 min
}));

// ── Body parsing — size cap ───────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// ── HTTP Parameter Pollution guard ────────────────────────────────────────────
app.use(hppMiddleware);

// ── Request security logging ─────────────────────────────────────────────────
app.use(securityLogger);

// ── General rate limit (all API routes) ──────────────────────────────────────
app.use("/api", apiLimiter);

// ── Health check (excluded from rate limit via security.js skip) ─────────────
app.get("/api/health", (_, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",       authRouter);
app.use("/api/analytics",  analyticsRouter);
app.use("/api/admin",      adminRouter);
app.use("/api/monitoring", monitoringRouter);
app.use("/api/reports",    reportsRouter);
app.use("/api/ai",         aiRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: "Route not found." }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  // Don't leak stack traces to clients
  console.error("[ERROR]", err.message);
  res.status(err.status || 500).json({ error: err.expose ? err.message : "Internal server error." });
});

// ── HTTP server (always start) ────────────────────────────────────────────────
http.createServer(app).listen(PORT, () => {
  console.log(`OilIntel API  http://localhost:${PORT}`);
});

// ── HTTPS server (auto self-signed cert) ──────────────────────────────────────
const CERT_DIR  = path.join(__dirname, "certs");
const CERT_FILE = path.join(CERT_DIR, "cert.pem");
const KEY_FILE  = path.join(CERT_DIR, "key.pem");

async function startHttps() {
  try {
    let cert, key;

    if (fs.existsSync(CERT_FILE) && fs.existsSync(KEY_FILE)) {
      cert = fs.readFileSync(CERT_FILE);
      key  = fs.readFileSync(KEY_FILE);
    } else {
      const selfsigned = require("selfsigned");
      const attrs = [{ name: "commonName", value: "localhost" }];
      const pems  = await selfsigned.generate(attrs, {
        days:       365,
        algorithm:  "sha256",
        extensions: [{ name: "subjectAltName", altNames: [{ type: 2, value: "localhost" }] }],
      });
      fs.mkdirSync(CERT_DIR, { recursive: true });
      fs.writeFileSync(CERT_FILE, pems.cert);
      fs.writeFileSync(KEY_FILE,  pems.private);
      cert = pems.cert;
      key  = pems.private;
      console.log(`[TLS] Self-signed cert generated → ${CERT_DIR}`);
    }

    https.createServer({ cert, key }, app).listen(HTTPS_PORT, () => {
      console.log(`OilIntel API  https://localhost:${HTTPS_PORT}`);
    });
  } catch (err) {
    console.warn(`[TLS] HTTPS disabled: ${err.message}`);
  }
}

startHttps();

console.log(`Default login: admin@oilintel.com / password`);
