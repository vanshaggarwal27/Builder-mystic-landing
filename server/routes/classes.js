const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Class = require("../models/Class");
const { User, Student, Teacher } = require("../models/User");

const router = express.Router();

// Get all classes (admin only)
router.get("/", [auth, auth.requireRole(["admin"])], async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("classTeacher", "profile teacherId")
      .populate("subjects.teacher", "profile teacherId")
      .sort({ grade: 1, section: 1 });

    // Manually populate students with their full profile data
    const classesWithStudents = await Promise.all(
      classes.map(async (classDoc) => {
        const populatedStudents = await Promise.all(
          classDoc.students.map(async (studentId) => {
            const student = await Student.findById(studentId).populate(
              "user",
              "profile",
            );
            if (student && student.user) {
              return {
                _id: student._id,
                studentId: student.studentId,
                grade: student.grade,
                section: student.section,
                admissionDate: student.admissionDate,
                parentName: student.parentName,
                parentPhone: student.parentPhone,
                emergencyContact: student.emergencyContact,
                profile: {
                  firstName: student.user.profile.firstName,
                  lastName: student.user.profile.lastName,
                  phone: student.user.profile.phone,
                  dateOfBirth: student.user.profile.dateOfBirth,
                  gender: student.user.profile.gender,
                  bloodGroup: student.user.profile.bloodGroup,
                  address: student.user.profile.address,
                },
              };
            }
            return null;
          }),
        );

        return {
          ...classDoc.toObject(),
          students: populatedStudents.filter((student) => student !== null),
        };
      }),
    );

    res.json({ classes: classesWithStudents });
  } catch (error) {
    console.error("Get classes error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new class (admin only)
router.post(
  "/",
  [
    auth,
    auth.requireRole(["admin"]),
    body("name").trim().isLength({ min: 3 }),
    body("grade").trim().isLength({ min: 1 }),
    body("section").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, grade, section, room, capacity, academicYear } = req.body;

      // Check if class already exists
      const existingClass = await Class.findOne({ name });
      if (existingClass) {
        return res.status(400).json({ error: "Class already exists" });
      }

      const newClass = new Class({
        name,
        grade,
        section,
        room: room || "Not assigned",
        capacity: capacity || 40,
        academicYear: academicYear || "2024-25",
      });

      await newClass.save();

      res.status(201).json({
        message: "Class created successfully",
        class: newClass,
      });
    } catch (error) {
      console.error("Create class error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Update class (admin only)
router.put("/:id", [auth, auth.requireRole(["admin"])], async (req, res) => {
  try {
    const { name, grade, section, room, capacity, classTeacher } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        name,
        grade,
        section,
        room,
        capacity,
        classTeacher,
      },
      { new: true },
    ).populate("classTeacher", "profile teacherId");

    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Update class error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add student to class (admin only)
router.post(
  "/:id/students",
  [auth, auth.requireRole(["admin"])],
  async (req, res) => {
    try {
      const { studentId } = req.body;

      const classDoc = await Class.findById(req.params.id);
      if (!classDoc) {
        return res.status(404).json({ error: "Class not found" });
      }

      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if student is already in this class
      if (classDoc.students.includes(studentId)) {
        return res.status(400).json({ error: "Student already in this class" });
      }

      // Check capacity
      if (classDoc.students.length >= classDoc.capacity) {
        return res.status(400).json({ error: "Class is at full capacity" });
      }

      // Add student to class
      classDoc.students.push(studentId);
      await classDoc.save();

      // Update student's class assignment
      student.grade = classDoc.name;
      student.section = classDoc.section;
      await student.save();

      res.json({
        message: "Student added to class successfully",
        class: classDoc,
      });
    } catch (error) {
      console.error("Add student to class error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Remove student from class (admin only)
router.delete(
  "/:id/students/:studentId",
  [auth, auth.requireRole(["admin"])],
  async (req, res) => {
    try {
      const classDoc = await Class.findById(req.params.id);
      if (!classDoc) {
        return res.status(404).json({ error: "Class not found" });
      }

      // Remove student from class
      classDoc.students = classDoc.students.filter(
        (student) => student.toString() !== req.params.studentId,
      );
      await classDoc.save();

      // Clear student's class assignment
      const student = await Student.findById(req.params.studentId);
      if (student) {
        student.grade = "";
        student.section = "";
        await student.save();
      }

      res.json({
        message: "Student removed from class successfully",
        class: classDoc,
      });
    } catch (error) {
      console.error("Remove student from class error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Add schedule to class (admin only)
router.post(
  "/:id/schedule",
  [auth, auth.requireRole(["admin"])],
  async (req, res) => {
    try {
      const { day, period, subject, teacher, startTime, endTime, room } =
        req.body;

      const classDoc = await Class.findById(req.params.id);
      if (!classDoc) {
        return res.status(404).json({ error: "Class not found" });
      }

      // Check if schedule slot already exists
      const existingSchedule = classDoc.schedule.find(
        (s) => s.day === day && s.period === period,
      );
      if (existingSchedule) {
        return res.status(400).json({
          error: "Schedule slot already exists for this day and period",
        });
      }

      // Add schedule entry
      classDoc.schedule.push({
        day,
        period,
        subject,
        teacher,
        startTime,
        endTime,
        room: room || classDoc.room,
      });

      await classDoc.save();

      res.json({
        message: "Schedule added successfully",
        class: classDoc,
      });
    } catch (error) {
      console.error("Add schedule error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Get class by ID with full details
router.get("/:id", [auth], async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id)
      .populate("classTeacher", "profile teacherId")
      .populate("students", "profile studentId")
      .populate("subjects.teacher", "profile teacherId")
      .populate("schedule.teacher", "profile teacherId");

    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ class: classDoc });
  } catch (error) {
    console.error("Get class error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete class (admin only)
router.delete("/:id", [auth, auth.requireRole(["admin"])], async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndDelete(req.params.id);
    if (!classDoc) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Clear class assignment from all students in this class
    await Student.updateMany(
      { _id: { $in: classDoc.students } },
      { grade: "", section: "" },
    );

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Helper function to assign student to appropriate class
async function assignStudentToClass(student) {
  if (!student.grade || !student.section) {
    console.log(`Student ${student.studentId} has no grade/section info`);
    return false;
  }

  // Parse grade from various formats
  let normalizedGrade = student.grade;

  // Handle "Grade 12-A" format - extract just the grade number
  if (normalizedGrade.includes("-")) {
    const parts = normalizedGrade.split("-");
    normalizedGrade = parts[0].replace("Grade ", "").trim();
  }
  // Handle "Grade 12" format
  else if (normalizedGrade.startsWith("Grade ")) {
    normalizedGrade = normalizedGrade.replace("Grade ", "").trim();
  }

  const className = `Grade ${normalizedGrade}-${student.section}`;
  console.log(
    `Looking for class: ${className} for student ${student.studentId}`,
  );

  const existingClass = await Class.findOne({ name: className });

  if (existingClass) {
    // Check if student is not already in the class
    if (!existingClass.students.includes(student._id)) {
      // Check if class has capacity
      if (existingClass.students.length < existingClass.capacity) {
        // Add student to class
        existingClass.students.push(student._id);
        await existingClass.save();
        console.log(
          `✅ Student ${student.studentId} assigned to class: ${className}`,
        );
        return true;
      } else {
        console.log(`⚠️ Class ${className} is at full capacity`);
        return false;
      }
    } else {
      console.log(
        `ℹ️ Student ${student.studentId} already in class: ${className}`,
      );
      return true;
    }
  } else {
    console.log(
      `❌ Class ${className} not found for student ${student.studentId}`,
    );
    return false;
  }
}

// Debug: Reassign all students to their appropriate classes (admin only)
router.post(
  "/reassign-students",
  [auth, auth.requireRole(["admin"])],
  async (req, res) => {
    try {
      console.log("Starting student reassignment process...");

      // Get all students
      const students = await Student.find();
      console.log(`Found ${students.length} students to process`);

      // Get all classes
      const classes = await Class.find();
      console.log(`Found ${classes.length} classes available`);

      // Clear all current class assignments
      await Class.updateMany({}, { students: [] });
      console.log("Cleared all current class assignments");

      let assignedCount = 0;
      let skippedCount = 0;

      for (const student of students) {
        const success = await assignStudentToClass(student);
        if (success) {
          assignedCount++;
        } else {
          skippedCount++;
        }
      }

      console.log(
        `Reassignment complete: ${assignedCount} assigned, ${skippedCount} skipped`,
      );

      res.json({
        message: "Student reassignment completed",
        assigned: assignedCount,
        skipped: skippedCount,
        totalStudents: students.length,
        totalClasses: classes.length,
      });
    } catch (error) {
      console.error("Reassign students error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

module.exports = router;
