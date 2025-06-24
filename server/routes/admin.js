const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const { User, Student, Teacher, Admin } = require("../models/User");
const Class = require("../models/Class");

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

      const {
        email,
        password,
        role,
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        address,
        bloodGroup,
        // Student specific fields
        grade,
        studentId,
        admissionDate,
        parentName,
        parentPhone,
        emergencyContact,
        // Teacher specific fields
        department,
        teacherId,
        position,
        experience,
        subjects,
        joiningDate,
        ...otherData
      } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user with enhanced profile
      const user = new User({
        email,
        password,
        role,
        profile: {
          firstName,
          lastName,
          phone: phone || "",
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: gender || "",
          address: address || "",
          bloodGroup: bloodGroup || "",
        },
      });

      await user.save();

      // Create role-specific profile with enhanced fields
      let roleProfile;
      switch (role) {
        case "student":
          roleProfile = new Student({
            user: user._id,
            studentId: studentId || `STU${Date.now()}`,
            grade: grade || "",
            section: req.body.section || "",
            rollNumber: req.body.rollNumber || "",
            academicYear: req.body.academicYear || "2024-25",
            admissionDate: admissionDate ? new Date(admissionDate) : null,
            parentName: parentName || "",
            parentPhone: parentPhone || "",
            emergencyContact: emergencyContact || "",
            ...otherData,
          });

          await roleProfile.save();

          // Auto-assign student to appropriate class if it exists
          if (grade && req.body.section) {
            try {
              const className = `Grade ${grade}-${req.body.section}`;
              let studentClass = await Class.findOne({
                grade: grade,
                section: req.body.section,
              });

              // If class doesn't exist, create it
              if (!studentClass) {
                studentClass = new Class({
                  name: className,
                  grade: grade,
                  section: req.body.section,
                  academicYear: req.body.academicYear || "2024-25",
                  room: `Room ${grade}${req.body.section}`,
                  capacity: 40,
                  students: [roleProfile._id],
                });
                await studentClass.save();
                console.log(
                  `Created new class: ${className} for student ${studentId}`,
                );
              } else {
                // Add student to existing class
                if (!studentClass.students.includes(roleProfile._id)) {
                  studentClass.students.push(roleProfile._id);
                  await studentClass.save();
                  console.log(
                    `Added student ${studentId} to existing class: ${className}`,
                  );
                }
              }
            } catch (classError) {
              console.error("Error assigning student to class:", classError);
              // Don't fail the user creation if class assignment fails
            }
          }
          break;
        case "teacher":
          roleProfile = new Teacher({
            user: user._id,
            teacherId: teacherId || `TCH${Date.now()}`,
            department: department || "",
            position: position || "",
            experience: experience || "",
            subjects: subjects || "",
            joiningDate: joiningDate ? new Date(joiningDate) : null,
            ...otherData,
          });
          await roleProfile.save();
          break;
        case "admin":
          roleProfile = new Admin({
            user: user._id,
            adminId: `ADM${Date.now()}`,
            ...otherData,
          });
          await roleProfile.save();
          break;
      }

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

    // Get role-specific data for each user
    const usersWithRoleData = await Promise.all(
      users.map(async (user) => {
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

        // Merge role data into the profile
        const mergedProfile = {
          ...user.profile,
          ...(roleData || {}),
        };

        return {
          ...user.toObject(),
          profile: mergedProfile,
          roleData: roleData || {}, // Keep for backward compatibility
        };
      }),
    );

    res.json({ users: usersWithRoleData });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user (admin only)
router.put(
  "/users/:id",
  [auth, auth.requireRole(["admin"])],
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const {
        email,
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        address,
        bloodGroup,
        // Student specific fields
        grade,
        section,
        studentId,
        admissionDate,
        parentName,
        parentPhone,
        emergencyContact,
        rollNumber,
        academicYear,
        // Teacher specific fields
        department,
        teacherId,
        position,
        experience,
        subjects,
        joiningDate,
      } = req.body;

      // Update main user profile
      user.email = email || user.email;
      user.profile.firstName = firstName || user.profile.firstName;
      user.profile.lastName = lastName || user.profile.lastName;
      user.profile.phone = phone || user.profile.phone;
      user.profile.dateOfBirth = dateOfBirth
        ? new Date(dateOfBirth)
        : user.profile.dateOfBirth;
      user.profile.gender = gender || user.profile.gender;
      user.profile.address = address || user.profile.address;
      user.profile.bloodGroup = bloodGroup || user.profile.bloodGroup;

      await user.save();

      // Update role-specific profile
      switch (user.role) {
        case "student":
          const studentProfile = await Student.findOne({ user: user._id });
          if (studentProfile) {
            const oldGrade = studentProfile.grade;
            const oldSection = studentProfile.section;

            studentProfile.grade = grade || studentProfile.grade;
            studentProfile.section = section || studentProfile.section;
            studentProfile.studentId = studentId || studentProfile.studentId;
            studentProfile.rollNumber = rollNumber || studentProfile.rollNumber;
            studentProfile.academicYear =
              academicYear || studentProfile.academicYear;
            studentProfile.admissionDate = admissionDate
              ? new Date(admissionDate)
              : studentProfile.admissionDate;
            studentProfile.parentName = parentName || studentProfile.parentName;
            studentProfile.parentPhone =
              parentPhone || studentProfile.parentPhone;
            studentProfile.emergencyContact =
              emergencyContact || studentProfile.emergencyContact;

            await studentProfile.save();

            // Handle class reassignment if grade or section changed
            if (
              (grade && grade !== oldGrade) ||
              (section && section !== oldSection)
            ) {
              // Remove from old class
              if (oldGrade && oldSection) {
                const oldClass = await Class.findOne({
                  grade: oldGrade,
                  section: oldSection,
                });
                if (oldClass) {
                  oldClass.students = oldClass.students.filter(
                    (student) => !student.equals(studentProfile._id),
                  );
                  await oldClass.save();
                }
              }

              // Add to new class
              if (grade && section) {
                const className = `Grade ${grade}-${section}`;
                let newClass = await Class.findOne({ grade, section });

                if (!newClass) {
                  newClass = new Class({
                    name: className,
                    grade,
                    section,
                    academicYear: academicYear || "2024-25",
                    room: `Room ${grade}${section}`,
                    capacity: 40,
                    students: [studentProfile._id],
                  });
                } else {
                  if (!newClass.students.includes(studentProfile._id)) {
                    newClass.students.push(studentProfile._id);
                  }
                }
                await newClass.save();
              }
            }
          }
          break;
        case "teacher":
          const teacherProfile = await Teacher.findOne({ user: user._id });
          if (teacherProfile) {
            teacherProfile.department = department || teacherProfile.department;
            teacherProfile.teacherId = teacherId || teacherProfile.teacherId;
            teacherProfile.position = position || teacherProfile.position;
            teacherProfile.experience = experience || teacherProfile.experience;
            teacherProfile.subjects = subjects || teacherProfile.subjects;
            teacherProfile.joiningDate = joiningDate
              ? new Date(joiningDate)
              : teacherProfile.joiningDate;
            await teacherProfile.save();
          }
          break;
      }

      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

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

      // Also delete role-specific profile and remove from classes
      switch (user.role) {
        case "student":
          const studentProfile = await Student.findOneAndDelete({
            user: user._id,
          });
          if (
            studentProfile &&
            studentProfile.grade &&
            studentProfile.section
          ) {
            // Remove student from class
            const studentClass = await Class.findOne({
              grade: studentProfile.grade,
              section: studentProfile.section,
            });
            if (studentClass) {
              studentClass.students = studentClass.students.filter(
                (student) => !student.equals(studentProfile._id),
              );
              await studentClass.save();
            }
          }
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
