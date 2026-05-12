const express = require("express");
const prisma  = require("../lib/db");
const { verifyToken }                             = require("../middleware/auth");
const { heavyLimiter }                            = require("../middleware/security");
const { generateReportRules, paginationRules, validate } = require("../middleware/validate");

const router = express.Router();

router.get("/", verifyToken, paginationRules, validate, async (req, res) => {
  const page  = parseInt(req.query.page  || "1",  10);
  const limit = parseInt(req.query.limit || "50", 10);
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    skip:  (page - 1) * limit,
    take:  limit,
  });
  res.json(reports);
});

router.post("/generate", verifyToken, heavyLimiter, generateReportRules, validate, async (req, res) => {
  const { name, type } = req.body;
  const report = await prisma.report.create({
    data: {
      name,
      type,
      size:   "—",
      author: req.user.name,
      status: "Generating",
      userId: req.user.id,
    },
  });

  console.log(`[REPORTS] Generating ${type} report "${name}" for ${req.user.email}`);

  setTimeout(async () => {
    await prisma.report.update({
      where: { id: report.id },
      data: {
        status: "Ready",
        size:   `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      },
    });
  }, 5000);

  res.status(201).json(report);
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted." });
  } catch {
    res.status(404).json({ error: "Report not found." });
  }
});

module.exports = router;
