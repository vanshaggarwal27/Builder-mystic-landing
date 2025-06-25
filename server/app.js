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

// MongoDB Connection with production configuration
const connectDB = async () => {
  try {
    await mongoose.connect(
      config.mongodb.uri || "mongodb://localhost:27017/shkva",
      config.mongodb.options,
    );
    console.log("✅ Connected to MongoDB");

    // Initialize sample data if database is empty
    const { User, Student, Admin } = require("./models/User");
    const Class = require("./models/Class");

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("📊 Database is empty, creating sample data...");
      await createInitialData();
    } else {
      console.log(`📊 Database has ${userCount} users`);
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️  Continuing without database (some features may not work)");
  }
};

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
