const express = require("express");
const prisma = require("../lib/db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/prices", verifyToken, async (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 30, 90);
  const prices = await prisma.oilPrice.findMany({
    orderBy: { date: "asc" },
    take: days,
    skip: Math.max(0, 90 - days),
  });
  res.json(prices);
});

router.get("/production", verifyToken, async (req, res) => {
  const { region } = req.query;
  const fields = await prisma.productionField.findMany({
    where: region ? { region } : undefined,
    orderBy: { bbl: "desc" },
  });
  res.json(fields);
});

router.get("/refineries", verifyToken, async (req, res) => {
  const refineries = await prisma.refinery.findMany({ orderBy: { name: "asc" } });
  res.json(refineries);
});

router.get("/summary", verifyToken, async (req, res) => {
  const [fields, prices, refineries] = await Promise.all([
    prisma.productionField.findMany(),
    prisma.oilPrice.findMany({ orderBy: { date: "asc" } }),
    prisma.refinery.findMany(),
  ]);

  const totalBbl  = fields.reduce((s, f) => s + f.bbl, 0);
  const avgUtil   = fields.reduce((s, f) => s + f.utilization, 0) / fields.length;
  const latest    = prices[prices.length - 1];
  const prev7     = prices[prices.length - 8] || prices[0];
  const priceChg  = (((latest.brent - prev7.brent) / prev7.brent) * 100).toFixed(2);

  res.json({
    totalProduction:   totalBbl,
    avgUtilization:    avgUtil.toFixed(1),
    currentBrent:      latest.brent,
    priceChange7d:     parseFloat(priceChg),
    activeRefineries:  refineries.filter((r) => r.status === "Operational").length,
    alerts:            refineries.filter((r) => r.hasAlert).length,
  });
});

router.get("/export", verifyToken, (_req, res) => {
  res.json([
    { route: "Nigeria → Rotterdam",        volume: 280000, product: "Crude", status: "In Transit", eta: "Nov 18" },
    { route: "Saudi Arabia → Singapore",   volume: 420000, product: "LNG",   status: "Loading",    eta: "Nov 20" },
    { route: "Algeria → Marseille",        volume: 160000, product: "Crude", status: "Delivered",  eta: "Nov 12" },
    { route: "Ghana → Houston",            volume: 95000,  product: "Crude", status: "In Transit", eta: "Nov 22" },
    { route: "UAE → Tokyo",                volume: 380000, product: "LNG",   status: "In Transit", eta: "Nov 25" },
  ]);
});

module.exports = router;
