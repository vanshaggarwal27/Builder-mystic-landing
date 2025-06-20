const mongoose = require("mongoose");
const { User, Student, Teacher } = require("../models/User");
require("dotenv").config();

const createSampleUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/shkva",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    console.log("Connected to MongoDB");

    // Sample student
    const studentExists = await User.findOne({ email: "student@shkva.edu" });
    if (!studentExists) {
      const studentUser = new User({
        email: "student@shkva.edu",
        password: "student123",
        role: "student",
        profile: {
          firstName: "John",
          lastName: "Smith",
          phone: "+1234567890",
          dateOfBirth: new Date("2005-06-15"),
          gender: "male",
        },
      });

      await studentUser.save();

      const studentProfile = new Student({
        user: studentUser._id,
        studentId: "STU2024001",
        grade: "Grade 10",
        section: "A",
        rollNumber: "10A01",
        academicYear: "2024-25",
        admissionDate: new Date("2024-01-01"),
        parentContact: {
          fatherName: "Robert Smith",
          motherName: "Mary Smith",
          guardianPhone: "+1234567891",
          emergencyContact: "+1234567892",
        },
      });

      await studentProfile.save();
      console.log("✅ Student user created: student@shkva.edu / student123");
    }

    // Sample teacher
    const teacherExists = await User.findOne({ email: "teacher@shkva.edu" });
    if (!teacherExists) {
      const teacherUser = new User({
        email: "teacher@shkva.edu",
        password: "teacher123",
        role: "teacher",
        profile: {
          firstName: "Maria",
          lastName: "Johnson",
          phone: "+1234567893",
          dateOfBirth: new Date("1985-08-20"),
          gender: "female",
        },
      });

      await teacherUser.save();

      const teacherProfile = new Teacher({
        user: teacherUser._id,
        teacherId: "TCH2024001",
        department: "Mathematics",
        position: "Senior Teacher",
        experience: 8,
        joiningDate: new Date("2020-08-01"),
        subjects: ["Mathematics", "Statistics"],
        classes: ["Grade 10-A", "Grade 10-B", "Grade 11-A"],
        qualifications: ["B.Sc Mathematics", "M.Ed"],
      });

      await teacherProfile.save();
      console.log("✅ Teacher user created: teacher@shkva.edu / teacher123");
    }

    console.log("\n🎉 Sample users created successfully!");
    console.log("You can now login with:");
    console.log("Admin: admin@shkva.edu / admin123");
    console.log("Teacher: teacher@shkva.edu / teacher123");
    console.log("Student: student@shkva.edu / student123");

    process.exit(0);
  } catch (error) {
    console.error("Error creating sample users:", error);
    process.exit(1);
  }
};

// Run the seeder
createSampleUsers();
