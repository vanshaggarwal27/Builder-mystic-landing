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

// Get student's class schedule
router.get(
  "/schedule",
  [auth, auth.requireRole(["student"])],
  async (req, res) => {
    try {
      const student = await Student.findOne({ user: req.userId });

      if (!student) {
        return res.status(404).json({ error: "Student profile not found" });
      }

      // Find the class that contains this student
      const Class = require("../models/Class");
      const studentClass = await Class.findOne({
        students: student._id,
      });

      if (!studentClass) {
        return res.json({
          schedule: [],
          message: "Student not assigned to any class",
        });
      }

      // Format schedule for frontend
      const formattedSchedule = studentClass.schedule.map((scheduleItem) => ({
        id: scheduleItem._id,
        day: scheduleItem.day,
        period: scheduleItem.period,
        subject: scheduleItem.subject,
        teacher: scheduleItem.teacher || "TBA",
        time:
          scheduleItem.startTime && scheduleItem.endTime
            ? `${scheduleItem.startTime} - ${scheduleItem.endTime}`
            : "TBA",
        room: scheduleItem.room || studentClass.room,
        className: studentClass.name,
      }));

      res.json({
        schedule: formattedSchedule,
        className: studentClass.name,
        classRoom: studentClass.room,
      });
    } catch (error) {
      console.error("Get student schedule error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Get notices for students
router.get(
  "/notices",
  [auth, auth.requireRole(["student"])],
  async (req, res) => {
    try {
      const student = await Student.findOne({ user: req.userId });

      if (!student) {
        return res.status(404).json({ error: "Student profile not found" });
      }

      const Notice = require("../models/Notice");

      const query = {
        status: "published",
        $or: [
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
        ],
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
      console.error("Get student notices error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Mark notice as read for student
router.post(
  "/notices/:id/read",
  [auth, auth.requireRole(["student"])],
  async (req, res) => {
    try {
      const Notice = require("../models/Notice");
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
  },
);

module.exports = router;
