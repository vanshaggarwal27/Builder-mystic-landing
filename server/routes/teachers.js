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

// Get notices for teachers
router.get(
  "/notices",
  [auth, auth.requireRole(["teacher"])],
  async (req, res) => {
    try {
      const Notice = require("../models/Notice");

      const query = {
        status: "published",
        $or: [{ target: "all" }, { target: "teachers" }],
      };

      const notices = await Notice.find(query)
        .populate("author", "profile.firstName profile.lastName")
        .sort({ createdAt: -1 })
        .limit(50);

      // Transform notices to match frontend expectations
      const transformedNotices = notices.map((notice) => ({
        _id: notice._id,
        title: notice.title,
        message: notice.content,
        priority: notice.priority,
        createdAt: notice.createdAt,
        target: notice.target,
        targetGrade: notice.targetDetails?.grades?.[0],
        readBy: notice.readBy.map((r) => r.user.toString()),
        createdBy: {
          name: notice.author?.profile
            ? `${notice.author.profile.firstName} ${notice.author.profile.lastName}`
            : "System Admin",
          role: "admin",
        },
      }));

      res.json({ notices: transformedNotices });
    } catch (error) {
      console.error("Get teacher notices error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Get teacher's assigned classes
router.get(
  "/classes",
  [auth, auth.requireRole(["teacher"])],
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ user: req.userId }).populate(
        "user",
        "profile.firstName profile.lastName",
      );

      if (!teacher) {
        return res.status(404).json({ error: "Teacher profile not found" });
      }

      const Class = require("../models/Class");

      // Find classes where this teacher is assigned
      const classes = await Class.find({
        $or: [
          { "schedule.teacher": teacher._id },
          {
            "schedule.teacher": `${teacher.user.profile.firstName} ${teacher.user.profile.lastName}`,
          },
        ],
      }).populate("students", "user profile");

      const teacherClasses = classes.map((cls) => ({
        _id: cls._id,
        name: cls.name,
        grade: cls.grade,
        section: cls.section,
        room: cls.room,
        studentCount: cls.students.length,
        subjects: [
          ...new Set(
            cls.schedule
              .filter(
                (s) =>
                  s.teacher === teacher._id ||
                  s.teacher ===
                    `${teacher.user.profile.firstName} ${teacher.user.profile.lastName}`,
              )
              .map((s) => s.subject),
          ),
        ],
      }));

      res.json({ classes: teacherClasses });
    } catch (error) {
      console.error("Get teacher classes error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

module.exports = router;
