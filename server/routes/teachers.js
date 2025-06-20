const express = require("express");
const auth = require("../middleware/auth");
const { User, Teacher } = require("../models/User");

const router = express.Router();

// Get all teachers (admin only)
router.get("/", [auth, auth.requireRole(["admin"])], async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("user", "email profile isActive lastLogin")
      .sort({ createdAt: -1 });

    res.json({ teachers });
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get teacher profile (self only)
router.get(
  "/profile",
  [auth, auth.requireRole(["teacher"])],
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ user: req.userId }).populate(
        "user",
        "email profile isActive lastLogin",
      );

      if (!teacher) {
        return res.status(404).json({ error: "Teacher profile not found" });
      }

      res.json({ teacher });
    } catch (error) {
      console.error("Get teacher profile error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

module.exports = router;
