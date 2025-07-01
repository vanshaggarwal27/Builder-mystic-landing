const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
require("dotenv").config();

// Import configuration
const config = require("./config/production");

const app = express();

// Function to create initial data
async function createInitialData() {
  try {
    const { User, Student, Admin } = require("./models/User");
    const Class = require("./models/Class");

    // Create admin user
    const adminUser = new User({
      email: "admin@shkva.edu",
      password: "admin123",
      role: "admin",
      profile: {
        firstName: "System",
        lastName: "Administrator",
        phone: "+1234567890",
      },
    });
    await adminUser.save();

    const adminProfile = new Admin({
      user: adminUser._id,
      adminId: "ADM001",
    });
    await adminProfile.save();
    console.log("✅ Admin user created: admin@shkva.edu / admin123");

    // Create sample classes
    const sampleClasses = [
      {
        name: "Grade 10-A",
        grade: "10",
        section: "A",
        room: "101",
        capacity: 40,
      },
      {
        name: "Grade 10-B",
        grade: "10",
        section: "B",
        room: "102",
        capacity: 40,
      },
      {
        name: "Grade 11-A",
        grade: "11",
        section: "A",
        room: "201",
        capacity: 35,
      },
      {
        name: "Grade 11-B",
        grade: "11",
        section: "B",
        room: "202",
        capacity: 35,
      },
    ];

    for (const classData of sampleClasses) {
      const newClass = new Class(classData);
      await newClass.save();
      console.log(`✅ Class created: ${classData.name}`);
    }

    // Create sample students
    const sampleStudents = [
      {
        email: "student1@shkva.edu",
        firstName: "John",
        lastName: "Smith",
        grade: "10",
        section: "A",
      },
      {
        email: "student2@shkva.edu",
        firstName: "Alice",
        lastName: "Johnson",
        grade: "10",
        section: "A",
      },
      {
        email: "student3@shkva.edu",
        firstName: "Bob",
        lastName: "Wilson",
        grade: "10",
        section: "B",
      },
      {
        email: "student4@shkva.edu",
        firstName: "Carol",
        lastName: "Davis",
        grade: "11",
        section: "A",
      },
    ];

    for (const studentData of sampleStudents) {
      const studentUser = new User({
        email: studentData.email,
        password: "student123",
        role: "student",
        profile: {
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          phone: "+1234567890",
          dateOfBirth: new Date("2005-06-15"),
          gender: "male",
        },
      });
      await studentUser.save();

      const studentProfile = new Student({
        user: studentUser._id,
        studentId: `STU${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`,
        grade: studentData.grade,
        section: studentData.section,
        rollNumber: `${studentData.grade}${studentData.section}${String(sampleStudents.indexOf(studentData) + 1).padStart(2, "0")}`,
        academicYear: "2024-25",
        admissionDate: new Date("2024-01-01"),
      });
      await studentProfile.save();

      // Auto-assign to class
      const className = `Grade ${studentData.grade}-${studentData.section}`;
      const targetClass = await Class.findOne({ name: className });
      if (targetClass) {
        targetClass.students.push(studentProfile._id);
        await targetClass.save();
        console.log(
          `✅ Student assigned: ${studentData.firstName} ${studentData.lastName} -> ${className}`,
        );
      }
    }

    // Create sample teachers
    const sampleTeachers = [
      {
        email: "teacher1@shkva.edu",
        firstName: "Ms. Sarah",
        lastName: "Johnson",
        teacherId: "TCH001",
        subjects: "Mathematics, Physics",
      },
      {
        email: "teacher2@shkva.edu",
        firstName: "Mr. David",
        lastName: "Wilson",
        teacherId: "TCH002",
        subjects: "English, Literature",
      },
      {
        email: "teacher3@shkva.edu",
        firstName: "Dr. Emma",
        lastName: "Brown",
        teacherId: "TCH003",
        subjects: "Chemistry, Biology",
      },
    ];

    for (const teacherData of sampleTeachers) {
      const teacherUser = new User({
        email: teacherData.email,
        password: "teacher123",
        role: "teacher",
        profile: {
          firstName: teacherData.firstName,
          lastName: teacherData.lastName,
          phone: "+1234567890",
          dateOfBirth: new Date("1985-06-15"),
          gender: "female",
        },
      });
      await teacherUser.save();

      const { Teacher } = require("./models/User");
      const teacherProfile = new Teacher({
        user: teacherUser._id,
        teacherId: teacherData.teacherId,
        subjects: teacherData.subjects,
        qualification: "M.Ed",
        experience: "5 Years",
        joiningDate: new Date("2020-01-01"),
      });
      await teacherProfile.save();

      console.log(
        `✅ Teacher created: ${teacherData.firstName} ${teacherData.lastName} (${teacherData.email})`,
      );
    }

    // Assign teachers to classes and subjects
    const { Teacher } = require("./models/User");
    const classes = await Class.find();
    const teachers = await Teacher.find().populate("user");

    for (const cls of classes) {
      // Add some schedule entries for teachers
      const scheduleEntries = [
        {
          day: "Monday",
          period: "1",
          subject: "Mathematics",
          teacher: `${teachers[0].user.profile.firstName} ${teachers[0].user.profile.lastName}`,
          startTime: "09:00",
          endTime: "09:45",
          room: cls.room,
        },
        {
          day: "Monday",
          period: "2",
          subject: "English",
          teacher: `${teachers[1].user.profile.firstName} ${teachers[1].user.profile.lastName}`,
          startTime: "09:45",
          endTime: "10:30",
          room: cls.room,
        },
        {
          day: "Tuesday",
          period: "1",
          subject: "Chemistry",
          teacher: `${teachers[2].user.profile.firstName} ${teachers[2].user.profile.lastName}`,
          startTime: "09:00",
          endTime: "09:45",
          room: cls.room,
        },
      ];

      cls.schedule = scheduleEntries;
      await cls.save();
      console.log(`✅ Schedule assigned to ${cls.name}`);
    }

    console.log("🎉 Sample data created successfully!");
  } catch (error) {
    console.error("❌ Error creating initial data:", error);
  }
}

// Trust proxy for production deployments
if (config.security.trustProxy) {
  app.set("trust proxy", 1);
}

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use("/api/", limiter);

// Compression middleware
app.use(compression());

// Security middleware
if (config.security.helmetEnabled) {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }),
  );
}

// CORS configuration - More permissive for mobile apps
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Allow any origin for now (can be restricted later)
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  }),
);

// Logging
app.use(morgan(config.server.env === "production" ? "combined" : "dev"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB Connection
const connectDB = async () => {
  try {
    let mongoUri;

    // Use in-memory database for development if MongoDB is not available
    if (config.server.env === "development") {
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log("🧠 Using in-memory MongoDB for development");
      } catch (memError) {
        console.log(
          "⚠️ In-memory MongoDB not available, trying regular connection...",
        );
        mongoUri =
          config.mongodb.uri ||
          process.env.MONGODB_URI ||
          "mongodb://localhost:27017/shkva";
      }
    } else {
      mongoUri =
        config.mongodb.uri ||
        process.env.MONGODB_URI ||
        "mongodb://localhost:27017/shkva";
    }

    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ Connected to MongoDB");

    // Initialize sample data if database is empty
    const { User } = require("./models/User");
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("📊 Database is empty, creating initial data...");
      await createInitialData();
    } else {
      console.log(`📊 Database has ${userCount} users`);
    }

    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️ Continuing without database connection");
    return false;
  }
};

// Connect to database
connectDB();

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("Database connection error:", error.message);
});
db.once("open", () => {
  console.log("🎉 Database connection established successfully");
});

// Import Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const teacherRoutes = require("./routes/teachers");
const adminRoutes = require("./routes/admin");
const assignmentRoutes = require("./routes/assignments");
const noticeRoutes = require("./routes/notices");
const attendanceRoutes = require("./routes/attendance");
const classRoutes = require("./routes/classes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/classes", classRoutes);

// Health Check with detailed information
app.get("/api/health", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  res.json({
    status: "OK",
    message: "SHKVA School Management System API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: config.server.env,
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    uptime: process.uptime(),
    cors: "Enabled for all origins",
  });
});

// Mobile app health check
app.get("/api/mobile/health", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({
    status: "Mobile API Ready",
    message: "SHKVA Mobile App Backend",
    timestamp: new Date().toISOString(),
    mobile: true,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "SHKVA School Management System API",
    documentation: "/api/health",
    status: "Running",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      error: "Duplicate entry",
      message: "Resource already exists",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
      message: "Authentication failed",
    });
  }

  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message:
      config.server.env === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

// Start server
app.listen(config.server.port, config.server.host, () => {
  console.log(
    `🚀 SHKVA Server running on ${config.server.host}:${config.server.port}`,
  );
  console.log(`📚 School Management System API ready!`);
  console.log(`🌐 Environment: ${config.server.env}`);
  console.log(
    `💾 Database: ${mongoose.connection.readyState === 1 ? "Connected" : "Connecting..."}`,
  );
});

module.exports = app;
