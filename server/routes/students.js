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
      }).populate("schedule.teacher", "profile teacherId");

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
        teacher: scheduleItem.teacher
          ? `${scheduleItem.teacher.profile.firstName} ${scheduleItem.teacher.profile.lastName}`
          : "TBA",
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

module.exports = router;
