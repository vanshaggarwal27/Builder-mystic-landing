const express = require("express");
const { body, validationResult } = require("express-validator");
const Notice = require("../models/Notice");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

// Get notices based on user role
router.get("/", auth, async (req, res) => {
  try {
    let notices;
    const { page = 1, limit = 10, priority, status } = req.query;

    const query = { status: "published" };

    if (priority) query.priority = priority;

    if (req.userRole === "student") {
      // Students see notices targeted to them
      const Student = require("../models/User").Student;
      const student = await Student.findOne({ user: req.userId });

      query.$or = [
        { target: "all" },
        { target: "students" },
        {
          target: "specific_grade",
          "targetDetails.grades": student.grade,
        },
        {
          target: "specific_class",
          "targetDetails.grades": student.grade,
          "targetDetails.sections": student.section,
        },
      ];
    } else if (req.userRole === "teacher") {
      // Teachers see notices targeted to them
      query.$or = [{ target: "all" }, { target: "teachers" }];
    } else {
      // Admin sees all notices
      delete query.status; // Admins can see drafts too
      if (status) query.status = status;
    }

    notices = await Notice.find(query)
      .populate("author", "profile.firstName profile.lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notice.countDocuments(query);

    res.json({
      notices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get notices error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create notice (admin only)
router.post(
  "/",
  [
    auth,
    requireRole(["admin"]),
    body("title").trim().isLength({ min: 3 }),
    body("content").trim().isLength({ min: 10 }),
    body("target").isIn([
      "all",
      "students",
      "teachers",
      "specific_grade",
      "specific_class",
    ]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const Admin = require("../models/User").Admin;
      const admin = await Admin.findOne({ user: req.userId });

      const notice = new Notice({
        title: req.body.title,
        content: req.body.content,
        author: admin._id,
        target: req.body.target,
        targetDetails: req.body.targetDetails || {},
        priority: req.body.priority || "normal",
        status: req.body.status || "published",
        publishDate: req.body.publishDate
          ? new Date(req.body.publishDate)
          : new Date(),
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
      });

      await notice.save();

      // Calculate total reach (simplified calculation)
      let totalReach = 0;
      switch (notice.target) {
        case "all":
          const { User } = require("../models/User");
          totalReach = await User.countDocuments({ isActive: true });
          break;
        case "students":
          const { Student } = require("../models/User");
          totalReach = await Student.countDocuments();
          break;
        case "teachers":
          const { Teacher } = require("../models/User");
          totalReach = await Teacher.countDocuments();
          break;
        // Add more specific targeting logic as needed
      }

      notice.analytics.totalReach = totalReach;
      await notice.save();

      res.status(201).json({
        message: "Notice created successfully",
        notice,
      });
    } catch (error) {
      console.error("Create notice error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Mark notice as read
router.post("/:id/read", auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    // Check if already read
    const alreadyRead = notice.readBy.find(
      (read) => read.user.toString() === req.userId,
    );

    if (!alreadyRead) {
      notice.readBy.push({ user: req.userId });
      notice.analytics.readCount += 1;
      notice.updateReadPercentage();
      await notice.save();
    }

    res.json({ message: "Notice marked as read" });
  } catch (error) {
    console.error("Mark notice read error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get notice analytics (admin only)
router.get(
  "/:id/analytics",
  [auth, requireRole(["admin"])],
  async (req, res) => {
    try {
      const notice = await Notice.findById(req.params.id).populate(
        "readBy.user",
        "profile.firstName profile.lastName role",
      );

      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }

      res.json({
        analytics: notice.analytics,
        readBy: notice.readBy,
      });
    } catch (error) {
      console.error("Get notice analytics error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Update notice (admin only)
router.put(
  "/:id",
  [
    auth,
    requireRole(["admin"]),
    body("title").optional().trim().isLength({ min: 3 }),
    body("content").optional().trim().isLength({ min: 10 }),
  ],
  async (req, res) => {
    try {
      const notice = await Notice.findById(req.params.id);
      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }

      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          notice[key] = req.body[key];
        }
      });

      await notice.save();

      res.json({
        message: "Notice updated successfully",
        notice,
      });
    } catch (error) {
      console.error("Update notice error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Delete notice (admin only)
router.delete("/:id", [auth, requireRole(["admin"])], async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    console.error("Delete notice error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
