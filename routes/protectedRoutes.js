const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Admin-only route
router.get("/admin", authMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// User-only route
router.get("/user", authMiddleware(["user", "admin"]), (req, res) => {
  res.json({ message: "Welcome, User!" });
});

module.exports = router;
