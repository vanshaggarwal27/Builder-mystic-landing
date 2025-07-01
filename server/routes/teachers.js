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

      const teacherClasses = classes.map((cls) => {
        // Get subjects this teacher teaches in this class
        const teacherSubjects = cls.schedule
          .filter(
            (s) =>
              s.teacher === teacher._id ||
              s.teacher ===
                `${teacher.user.profile.firstName} ${teacher.user.profile.lastName}`,
          )
          .map((s) => s.subject);

        // Also include subjects from teacher's profile if no schedule subjects found
        let subjects = [...new Set(teacherSubjects)];
        if (subjects.length === 0 && teacher.subjects) {
          subjects = teacher.subjects.split(",").map((s) => s.trim());
        }

        return {
          _id: cls._id,
          name: cls.name,
          grade: cls.grade,
          section: cls.section,
          room: cls.room,
          studentCount: cls.students.length,
          subjects: subjects,
          students: cls.students.map((student) => ({
            _id: student._id,
            name: student.user?.profile
              ? `${student.user.profile.firstName} ${student.user.profile.lastName}`
              : "Unknown Student",
            rollNumber: student.rollNumber,
            studentId: student.studentId,
          })),
        };
      });

      res.json({ classes: teacherClasses });
    } catch (error) {
      console.error("Get teacher classes error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Upload results for a class
router.post(
  "/results/upload",
  [auth, auth.requireRole(["teacher"])],
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ user: req.userId });
      if (!teacher) {
        return res.status(404).json({ error: "Teacher profile not found" });
      }

      const {
        examName,
        examType,
        subject,
        classId,
        examDate,
        totalMarks,
        passingMarks,
        studentResults,
      } = req.body;

      // Validate required fields
      if (
        !examName ||
        !examType ||
        !subject ||
        !classId ||
        !examDate ||
        !totalMarks ||
        !passingMarks ||
        !studentResults
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Verify teacher is assigned to this class
      const Class = require("../models/Class");
      const teacherName = `${teacher.user.profile.firstName} ${teacher.user.profile.lastName}`;
      const classObj = await Class.findOne({
        _id: classId,
        $or: [
          { "schedule.teacher": teacher._id },
          { "schedule.teacher": teacherName },
        ],
      });

      if (!classObj) {
        return res
          .status(403)
          .json({ error: "You are not assigned to teach this class" });
      }

      const Result = require("../models/Result");

      // Process student results
      const processedResults = studentResults.map((result) => {
        const percentage = (result.marksObtained / totalMarks) * 100;
        const grade = Result.calculateGrade(result.marksObtained, totalMarks);
        const status = Result.getStatus(result.marksObtained, passingMarks);

        return {
          student: result.studentId,
          marksObtained: result.marksObtained,
          grade: grade,
          percentage: Math.round(percentage * 100) / 100,
          status: status,
          remarks: result.remarks || "",
        };
      });

      // Create new result entry
      const newResult = new Result({
        examName,
        examType,
        subject,
        class: classId,
        teacher: teacher._id,
        examDate: new Date(examDate),
        totalMarks: Number(totalMarks),
        passingMarks: Number(passingMarks),
        studentResults: processedResults,
        status: "published",
        publishedAt: new Date(),
      });

      await newResult.save();

      res.status(201).json({
        message: "Results uploaded successfully",
        resultId: newResult._id,
        analytics: newResult.analytics,
      });
    } catch (error) {
      console.error("Upload results error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Get teacher's uploaded results
router.get(
  "/results",
  [auth, auth.requireRole(["teacher"])],
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ user: req.userId });
      if (!teacher) {
        return res.status(404).json({ error: "Teacher profile not found" });
      }

      const Result = require("../models/Result");

      const results = await Result.find({ teacher: teacher._id })
        .populate("class", "name grade section")
        .sort({ createdAt: -1 })
        .limit(20);

      const formattedResults = results.map((result) => ({
        _id: result._id,
        examName: result.examName,
        examType: result.examType,
        subject: result.subject,
        class: result.class?.name || "Unknown Class",
        examDate: result.examDate,
        totalMarks: result.totalMarks,
        analytics: result.analytics,
        status: result.status,
        createdAt: result.createdAt,
      }));

      res.json({ results: formattedResults });
    } catch (error) {
      console.error("Get teacher results error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Get specific result details
router.get(
  "/results/:id",
  [auth, auth.requireRole(["teacher"])],
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ user: req.userId });
      if (!teacher) {
        return res.status(404).json({ error: "Teacher profile not found" });
      }

      const Result = require("../models/Result");

      const result = await Result.findOne({
        _id: req.params.id,
        teacher: teacher._id,
      })
        .populate("class", "name grade section")
        .populate("studentResults.student", "user rollNumber studentId");

      if (!result) {
        return res.status(404).json({ error: "Result not found" });
      }

      res.json({ result });
    } catch (error) {
      console.error("Get result details error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

module.exports = router;
