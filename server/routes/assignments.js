const express = require("express");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");
const Assignment = require("../models/Assignment");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/assignments/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images, PDFs, and documents are allowed!"));
    }
  },
});

// Get assignments (students see assigned to them, teachers see their created assignments)
router.get("/", auth, async (req, res) => {
  try {
    let assignments;

    if (req.userRole === "student") {
      // Get assignments for student's grade/section
      const Student = require("../models/User").Student;
      const student = await Student.findOne({ user: req.userId });

      assignments = await Assignment.find({
        "targetGrades.grade": student.grade,
        "targetGrades.section": student.section,
        status: "published",
      }).populate("teacher", "profile.firstName profile.lastName");
    } else if (req.userRole === "teacher") {
      // Get assignments created by this teacher
      const Teacher = require("../models/User").Teacher;
      const teacher = await Teacher.findOne({ user: req.userId });

      assignments = await Assignment.find({
        teacher: teacher._id,
      }).populate(
        "submissions.student",
        "profile.firstName profile.lastName studentId",
      );
    } else {
      // Admin can see all assignments
      assignments = await Assignment.find({}).populate(
        "teacher",
        "profile.firstName profile.lastName",
      );
    }

    res.json(assignments);
  } catch (error) {
    console.error("Get assignments error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new assignment (teachers only)
router.post(
  "/",
  [
    auth,
    requireRole(["teacher"]),
    upload.array("materials", 5),
    body("title").trim().isLength({ min: 3 }),
    body("description").trim().isLength({ min: 10 }),
    body("subject").trim().isLength({ min: 2 }),
    body("dueDate").isISO8601(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const Teacher = require("../models/User").Teacher;
      const teacher = await Teacher.findOne({ user: req.userId });

      const materials = req.files
        ? req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          }))
        : [];

      const assignment = new Assignment({
        title: req.body.title,
        description: req.body.description,
        subject: req.body.subject,
        teacher: teacher._id,
        targetGrades: JSON.parse(req.body.targetGrades || "[]"),
        dueDate: new Date(req.body.dueDate),
        totalMarks: req.body.totalMarks || 100,
        materials: materials,
        instructions: req.body.instructions,
        priority: req.body.priority || "normal",
        status: "published",
      });

      await assignment.save();

      res.status(201).json({
        message: "Assignment created successfully",
        assignment,
      });
    } catch (error) {
      console.error("Create assignment error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Submit assignment (students only)
router.post(
  "/:id/submit",
  [auth, requireRole(["student"]), upload.array("submission", 3)],
  async (req, res) => {
    try {
      const assignment = await Assignment.findById(req.params.id);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }

      if (new Date() > assignment.dueDate) {
        return res
          .status(400)
          .json({ error: "Assignment submission deadline has passed" });
      }

      const Student = require("../models/User").Student;
      const student = await Student.findOne({ user: req.userId });

      // Check if already submitted
      const existingSubmission = assignment.submissions.find(
        (sub) => sub.student.toString() === student._id.toString(),
      );

      if (existingSubmission) {
        return res.status(400).json({ error: "Assignment already submitted" });
      }

      const submissionFiles = req.files
        ? req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          }))
        : [];

      assignment.submissions.push({
        student: student._id,
        files: submissionFiles,
        submissionDate: new Date(),
      });

      await assignment.save();

      res.json({
        message: "Assignment submitted successfully",
        submission: assignment.submissions[assignment.submissions.length - 1],
      });
    } catch (error) {
      console.error("Submit assignment error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Grade assignment (teachers only)
router.post(
  "/:assignmentId/submissions/:submissionId/grade",
  [
    auth,
    requireRole(["teacher"]),
    body("marks").isNumeric(),
    body("feedback").optional().trim(),
  ],
  async (req, res) => {
    try {
      const { marks, feedback } = req.body;

      const assignment = await Assignment.findById(req.params.assignmentId);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }

      const submission = assignment.submissions.id(req.params.submissionId);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      const Teacher = require("../models/User").Teacher;
      const teacher = await Teacher.findOne({ user: req.userId });

      submission.marks = marks;
      submission.feedback = feedback;
      submission.status = "graded";
      submission.gradedBy = teacher._id;
      submission.gradedAt = new Date();

      await assignment.save();

      res.json({
        message: "Assignment graded successfully",
        submission,
      });
    } catch (error) {
      console.error("Grade assignment error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Download assignment material or submission
router.get("/download/:filename", auth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "assignments",
      filename,
    );

    res.download(filePath, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(404).json({ error: "File not found" });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete assignment (teachers only)
router.delete("/:id", [auth, requireRole(["teacher"])], async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const Teacher = require("../models/User").Teacher;
    const teacher = await Teacher.findOne({ user: req.userId });

    if (assignment.teacher.toString() !== teacher._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this assignment" });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
