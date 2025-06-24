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
          // Parse grade and section if grade is in format "10-A"
          let parsedGrade = grade || "";
          let parsedSection = "";
          if (grade && grade.includes("-")) {
            const parts = grade.split("-");
            parsedGrade = parts[0];
            parsedSection = parts[1];
          } else {
            parsedGrade = grade || "";
            parsedSection = section || "";
          }

          roleProfile = new Student({
            user: user._id,
            studentId: studentId || `STU${Date.now()}`,
            grade: parsedGrade,
            section: parsedSection,
            admissionDate: admissionDate ? new Date(admissionDate) : null,
            parentName: parentName || "",
            parentPhone: parentPhone || "",
            emergencyContact: emergencyContact || "",
            ...otherData,
          });
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

      // Auto-assign student to class if it exists
      if (role === "student" && roleProfile.grade && roleProfile.section) {
        try {
          const className = `Grade ${roleProfile.grade}-${roleProfile.section}`;
          const existingClass = await Class.findOne({ name: className });

          if (existingClass) {
            // Check if class has capacity
            if (existingClass.students.length < existingClass.capacity) {
              // Add student to class
              existingClass.students.push(roleProfile._id);
              await existingClass.save();

              console.log(
                `Student ${roleProfile.studentId} automatically assigned to class: ${className}`,
              );
            } else {
              console.log(
                `Class ${className} is at full capacity, student not auto-assigned`,
              );
            }
          } else {
            console.log(
              `Class ${className} not found, student not auto-assigned`,
            );
          }
        } catch (classError) {
          console.error("Error auto-assigning student to class:", classError);
          // Don't fail user creation if class assignment fails
        }
      }

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          roleData: roleProfile,
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

    // Get role-specific data for each user and merge into profile
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

        // Merge role data into profile for frontend compatibility
        const mergedProfile = {
          ...user.profile,
          ...(roleData || {}),
        };

        return {
          ...user.toObject(),
          profile: mergedProfile,
          roleData: roleData || {},
        };
      }),
    );

    res.json({ users: usersWithRoleData });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single user details (admin only)
router.get(
  "/users/:id",
  [auth, auth.requireRole(["admin"])],
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get role-specific data
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

      // Merge role data into profile for frontend compatibility
      const mergedProfile = {
        ...user.profile,
        ...(roleData || {}),
      };

      res.json({
        user: {
          ...user.toObject(),
          profile: mergedProfile,
          roleData: roleData || {},
        },
      });
    } catch (error) {
      console.error("Get user details error:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Update user (admin only)
router.put(
  "/users/:id",
  [
    auth,
    auth.requireRole(["admin"]),
    body("email").optional().isEmail().normalizeEmail(),
    body("firstName").optional().trim().isLength({ min: 2 }),
    body("lastName").optional().trim().isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.params.id;
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

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "Email already exists" });
        }
        user.email = email;
      }

      // Update user profile
      if (firstName !== undefined) user.profile.firstName = firstName;
      if (lastName !== undefined) user.profile.lastName = lastName;
      if (phone !== undefined) user.profile.phone = phone;
      if (dateOfBirth !== undefined)
        user.profile.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
      if (gender !== undefined) user.profile.gender = gender;
      if (address !== undefined) user.profile.address = address;
      if (bloodGroup !== undefined) user.profile.bloodGroup = bloodGroup;

      await user.save();

      // Update role-specific profile
      let roleProfile;
      switch (user.role) {
        case "student":
          roleProfile = await Student.findOne({ user: user._id });
          if (roleProfile) {
            // Parse grade and section if grade is in format "10-A"
            if (grade !== undefined) {
              if (grade.includes("-")) {
                const parts = grade.split("-");
                roleProfile.grade = parts[0];
                roleProfile.section = parts[1];
              } else {
                roleProfile.grade = grade;
              }
            }
            if (studentId !== undefined) roleProfile.studentId = studentId;
            if (admissionDate !== undefined)
              roleProfile.admissionDate = admissionDate
                ? new Date(admissionDate)
                : null;
            if (parentName !== undefined) roleProfile.parentName = parentName;
            if (parentPhone !== undefined)
              roleProfile.parentPhone = parentPhone;
            if (emergencyContact !== undefined)
              roleProfile.emergencyContact = emergencyContact;

            // Update other fields
            Object.keys(otherData).forEach((key) => {
              if (otherData[key] !== undefined) {
                roleProfile[key] = otherData[key];
              }
            });

            await roleProfile.save();
          }
          break;

        case "teacher":
          roleProfile = await Teacher.findOne({ user: user._id });
          if (roleProfile) {
            if (teacherId !== undefined) roleProfile.teacherId = teacherId;
            if (department !== undefined) roleProfile.department = department;
            if (position !== undefined) roleProfile.position = position;
            if (experience !== undefined) roleProfile.experience = experience;
            if (subjects !== undefined) roleProfile.subjects = subjects;
            if (joiningDate !== undefined)
              roleProfile.joiningDate = joiningDate
                ? new Date(joiningDate)
                : null;

            // Update other fields
            Object.keys(otherData).forEach((key) => {
              if (otherData[key] !== undefined) {
                roleProfile[key] = otherData[key];
              }
            });

            await roleProfile.save();
          }
          break;

        case "admin":
          roleProfile = await Admin.findOne({ user: user._id });
          if (roleProfile) {
            // Update other fields
            Object.keys(otherData).forEach((key) => {
              if (otherData[key] !== undefined) {
                roleProfile[key] = otherData[key];
              }
            });

            await roleProfile.save();
          }
          break;
      }

      // Return updated user with role data
      const updatedUser = await User.findById(userId);
      let updatedRoleData = {};
      switch (user.role) {
        case "student":
          updatedRoleData = await Student.findOne({ user: user._id }).lean();
          break;
        case "teacher":
          updatedRoleData = await Teacher.findOne({ user: user._id }).lean();
          break;
        case "admin":
          updatedRoleData = await Admin.findOne({ user: user._id }).lean();
          break;
      }

      res.json({
        message: "User updated successfully",
        user: {
          ...updatedUser.toObject(),
          roleData: updatedRoleData || {},
        },
      });
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

      // Also delete role-specific profile
      switch (user.role) {
        case "student":
          await Student.findOneAndDelete({ user: user._id });
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
