const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const hpp        = require("hpp");

// ── Helmet – security response headers ───────────────────────────────────────
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'"],
      styleSrc:       ["'self'", "'unsafe-inline'"],   // Next.js inline styles
      imgSrc:         ["'self'", "data:", "https:"],
      connectSrc:     ["'self'", "http://localhost:3000", "https://localhost:3000"],
      fontSrc:        ["'self'", "https:", "data:"],
      objectSrc:      ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge:            31536000,   // 1 year
    includeSubDomains: true,
    preload:           true,
  },
  referrerPolicy:             { policy: "strict-origin-when-cross-origin" },
  crossOriginEmbedderPolicy:  false,  // needed for map tile loading
  xPoweredBy:                 false,  // hide Express fingerprint
});

// ── Rate limiting ─────────────────────────────────────────────────────────────

// General API: 120 req / 15 min per IP
const apiLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            120,
  standardHeaders: true,
  legacyHeaders:  false,
  skip:           (req) => req.path === "/api/health",
  message:        { error: "Too many requests. Please slow down and try again later." },
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] ${req.ip} hit general limit on ${req.path}`);
    res.status(429).json(options.message);
  },
});

// Login: strict – 10 attempts / 15 min per IP (brute-force protection)
const loginLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            10,
  standardHeaders: true,
  legacyHeaders:  false,
  message:        { error: "Too many login attempts. Try again in 15 minutes." },
  handler: (req, res, next, options) => {
    console.warn(`[BRUTE FORCE] ${req.ip} exceeded login attempts`);
    res.status(429).json(options.message);
  },
});

// Report generation: 20 req / hour (expensive ops)
const heavyLimiter = rateLimit({
  windowMs:       60 * 60 * 1000,
  max:            20,
  standardHeaders: true,
  legacyHeaders:  false,
  message:        { error: "Rate limit exceeded for this operation. Try again in an hour." },
});

// Admin mutations: 50 req / 15 min
const adminLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            50,
  standardHeaders: true,
  legacyHeaders:  false,
  message:        { error: "Too many admin requests." },
});

// ── HTTP Parameter Pollution protection ──────────────────────────────────────
const hppMiddleware = hpp({
  whitelist: ["type", "status", "category"],  // allow arrays on these query params
});

// ── Request body size cap ─────────────────────────────────────────────────────
// Applied in index.js via express.json({ limit: "10kb" })

// ── Security logger ───────────────────────────────────────────────────────────
function securityLogger(req, res, next) {
  const suspicious = [
    /<script/i, /javascript:/i, /on\w+\s*=/i,           // XSS probes
    /union.+select/i, /drop\s+table/i, /insert\s+into/i, // SQL injection probes
    /\.\.\//,                                              // path traversal
  ];
  const payload = JSON.stringify(req.body) + JSON.stringify(req.query) + req.path;
  if (suspicious.some((rx) => rx.test(payload))) {
    console.warn(`[SECURITY] Suspicious request from ${req.ip}: ${req.method} ${req.path}`);
  }
  next();
}

module.exports = {
  helmetMiddleware,
  apiLimiter,
  loginLimiter,
  heavyLimiter,
  adminLimiter,
  hppMiddleware,
  securityLogger,
};
