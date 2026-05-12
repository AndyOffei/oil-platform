const express = require("express");
const { query } = require("express-validator");
const prisma  = require("../lib/db");
const { verifyToken }          = require("../middleware/auth");
const { alertIdRule, validate } = require("../middleware/validate");

const resolvedQueryRule = [
  query("resolved").optional().isIn(["true", "false"]).withMessage("resolved must be 'true' or 'false'."),
];

const router = express.Router();

router.get("/alerts", verifyToken, resolvedQueryRule, validate, async (req, res) => {
  const { resolved } = req.query;
  const where = resolved === "false" ? { resolved: false }
              : resolved === "true"  ? { resolved: true  }
              : undefined;
  const alerts = await prisma.alert.findMany({ where, orderBy: { time: "desc" } });
  res.json(alerts);
});

router.patch("/alerts/:id/resolve", verifyToken, alertIdRule, validate, async (req, res) => {
  try {
    const alert = await prisma.alert.update({
      where: { id: req.params.id },
      data: { resolved: true },
    });
    res.json(alert);
  } catch {
    res.status(404).json({ error: "Alert not found." });
  }
});

router.get("/live", verifyToken, async (_req, res) => {
  const [latest, refineryAlertCount, activeCount] = await Promise.all([
    prisma.oilPrice.findFirst({ orderBy: { date: "desc" } }),
    prisma.alert.count({ where: { category: "refinery", resolved: false } }),
    prisma.refinery.count({ where: { status: "Operational" } }),
  ]);

  const fluctuate = (v) => parseFloat((v + (Math.random() - 0.5) * 1.2).toFixed(2));
  res.json({
    brent:            fluctuate(latest.brent),
    wti:              fluctuate(latest.wti),
    opec:             fluctuate(latest.opec),
    timestamp:        new Date().toISOString(),
    refineryAlerts:   refineryAlertCount,
    activeRefineries: activeCount,
  });
});

module.exports = router;
