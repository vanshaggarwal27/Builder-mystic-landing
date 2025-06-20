const express = require("express");
const auth = require("../middleware/auth");
const { User, Student } = require("../models/User");

const router = express.Router();

// Get all students (admin/teacher only)
router.get(
  "/",
  [auth, auth.requireRole(["admin", "teacher"])],
  async (req, res) => {
    try {
      const students = await Student.find()
        .populate("user", "email profile isActive lastLogin")
        .sort({ createdAt: -1 });

      res.json({ students });
    } catch (error) {
      console.error("Get students error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Get student profile (self only)
router.get(
  "/profile",
  [auth, auth.requireRole(["student"])],
  async (req, res) => {
    try {
      const student = await Student.findOne({ user: req.userId }).populate(
        "user",
        "email profile isActive lastLogin",
      );

      if (!student) {
        return res.status(404).json({ error: "Student profile not found" });
      }

      res.json({ student });
    } catch (error) {
      console.error("Get student profile error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

module.exports = router;
