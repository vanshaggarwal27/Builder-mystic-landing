const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { User, Student, Teacher, Admin } = require("../models/User");
const auth = require("../middleware/auth");
const { isDatabaseConnected } = require("../middleware/mockData");

const router = express.Router();

// Mock login for development when database is unavailable
router.post("/mock-login", async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      return res
        .status(400)
        .json({ error: "Use regular login when database is available" });
    }

    console.log("🔧 Mock login request");

    // Return mock admin token and user data
    res.json({
      token: "mock_admin_token",
      user: {
        id: "mock_admin_1",
        email: "admin@shkva.edu",
        role: "admin",
        profile: {
          firstName: "System",
          lastName: "Administrator",
        },
        roleData: {
          adminId: "ADM001",
        },
      },
    });
  } catch (error) {
    console.error("Mock login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login endpoint
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["student", "teacher", "admin"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, role } = req.body;

      // Find user
      const user = await User.findOne({ email, role });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Get role-specific data
      let profileData = {};
      switch (role) {
        case "student":
          profileData = await Student.findOne({ user: user._id });
          break;
        case "teacher":
          profileData = await Teacher.findOne({ user: user._id });
          break;
        case "admin":
          profileData = await Admin.findOne({ user: user._id });
          break;
      }

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET || "shkva_secret_key",
        { expiresIn: "7d" },
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          roleData: profileData,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Register endpoint (for demo/testing)
router.post(
  "/register",
  [
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
        message: "User registered successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let profileData = {};

    switch (user.role) {
      case "student":
        profileData = await Student.findOne({ user: user._id });
        break;
      case "teacher":
        profileData = await Teacher.findOne({ user: user._id });
        break;
      case "admin":
        profileData = await Admin.findOne({ user: user._id });
        break;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        roleData: profileData,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user profile (for profile pages)
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let roleData = {};
    switch (user.role) {
      case "student":
        roleData = await Student.findOne({ user: user._id }).lean();
        break;
      case "teacher":
        roleData = await Teacher.findOne({ user: user._id }).lean();
        break;
      case "admin":
        roleData = await Admin.findOne({ user: user._id }).lean();
        break;
    }

    // Merge user profile with role-specific data for a complete profile
    const completeProfile = {
      id: user._id,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      email: user.email,
      role: user.role,
      phone: user.profile.phone,
      dateOfBirth: user.profile.dateOfBirth,
      gender: user.profile.gender,
      address: user.profile.address,
      bloodGroup: user.profile.bloodGroup,
      // Include role-specific fields
      ...(roleData || {}),
    };

    res.json({ profile: completeProfile });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Change password
router.post(
  "/change-password",
  [
    body("currentPassword").isLength({ min: 1 }),
    body("newPassword").isLength({ min: 6 }),
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;

      // Get the user
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isCurrentPasswordValid =
        await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Update password
      user.password = newPassword; // This will be hashed automatically by the pre-save hook
      await user.save();

      res.json({
        message: "Password changed successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Logout
router.post("/logout", auth, (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
