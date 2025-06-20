const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { User, Student, Teacher, Admin } = require("../models/User");

const router = express.Router();

// Create new user (admin only)
router.post(
  "/users",
  [
    auth,
    auth.requireRole(["admin"]),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["student", "teacher", "admin"]),
    body("firstName").trim().isLength({ min: 2 }),
    body("lastName").trim().isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, role, firstName, lastName, ...otherData } =
        req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user
      const user = new User({
        email,
        password,
        role,
        profile: {
          firstName,
          lastName,
          ...otherData.profile,
        },
      });

      await user.save();

      // Create role-specific profile
      let roleProfile;
      switch (role) {
        case "student":
          roleProfile = new Student({
            user: user._id,
            studentId: `STU${Date.now()}`,
            ...otherData,
          });
          break;
        case "teacher":
          roleProfile = new Teacher({
            user: user._id,
            teacherId: `TCH${Date.now()}`,
            ...otherData,
          });
          break;
        case "admin":
          roleProfile = new Admin({
            user: user._id,
            adminId: `ADM${Date.now()}`,
            ...otherData,
          });
          break;
      }

      await roleProfile.save();

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Get all users (admin only)
router.get("/users", [auth, auth.requireRole(["admin"])], async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete user (admin only)
router.delete(
  "/users/:id",
  [auth, auth.requireRole(["admin"])],
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Also delete role-specific profile
      switch (user.role) {
        case "student":
          await Student.findOneAndDelete({ user: user._id });
          break;
        case "teacher":
          await Teacher.findOneAndDelete({ user: user._id });
          break;
        case "admin":
          await Admin.findOneAndDelete({ user: user._id });
          break;
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

module.exports = router;
