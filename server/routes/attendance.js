const express = require("express");
const auth = require("../middleware/auth");
const { Student } = require("../models/User");

const router = express.Router();

// Get student attendance (self or admin/teacher)
router.get("/student/:id?", auth, async (req, res) => {
  try {
    let studentId = req.params.id;

    // If no ID provided and user is student, use their own ID
    if (!studentId && req.userRole === "student") {
      const student = await Student.findOne({ user: req.userId });
      if (!student) {
        return res.status(404).json({ error: "Student profile not found" });
      }
      studentId = student._id;
    }

    // Check permissions
    if (req.userRole === "student" && !studentId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const student = await Student.findById(studentId).populate(
      "user",
      "profile",
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      attendance: student.attendance,
      student: {
        name: `${student.user.profile.firstName} ${student.user.profile.lastName}`,
        studentId: student.studentId,
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
