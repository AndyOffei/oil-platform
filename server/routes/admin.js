const express = require("express");
const bcrypt  = require("bcryptjs");
const prisma  = require("../lib/db");
const { verifyToken, requireRole }                    = require("../middleware/auth");
const { adminLimiter }                                = require("../middleware/security");
const { createUserRules, updateUserRules, userIdRule, validate } = require("../middleware/validate");

const router = express.Router();

router.get("/users", verifyToken, requireRole("superadmin", "manager"), async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, avatar: true, active: true, createdAt: true },
  });
  res.json(users);
});

router.post("/users", verifyToken, requireRole("superadmin"), adminLimiter, createUserRules, validate, async (req, res) => {
  const { name, email, role, password } = req.body;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already in use." });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, role, password: hashed, avatar: name.slice(0, 2).toUpperCase(), active: true },
    select: { id: true, name: true, email: true, role: true, avatar: true, active: true, createdAt: true },
  });
  console.log(`[ADMIN] User created: ${email} (${role}) by ${req.user.email}`);
  res.status(201).json(user);
});

router.patch("/users/:id", verifyToken, requireRole("superadmin"), adminLimiter, updateUserRules, validate, async (req, res) => {
  // Strip password from patch — use a dedicated reset endpoint if needed
  const { password: _, email: __, ...data } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, name: true, email: true, role: true, avatar: true, active: true, createdAt: true },
    });
    console.log(`[ADMIN] User updated: ${user.email} by ${req.user.email}`);
    res.json(user);
  } catch {
    res.status(404).json({ error: "User not found." });
  }
});

router.delete("/users/:id", verifyToken, requireRole("superadmin"), adminLimiter, userIdRule, validate, async (req, res) => {
  if (req.params.id === req.user.id)
    return res.status(400).json({ error: "Cannot delete your own account." });
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    console.log(`[ADMIN] User deleted: ${req.params.id} by ${req.user.email}`);
    res.json({ message: "User deleted." });
  } catch {
    res.status(404).json({ error: "User not found." });
  }
});

module.exports = router;
