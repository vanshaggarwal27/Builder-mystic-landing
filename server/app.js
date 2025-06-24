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
mongoose.connect(config.mongodb.uri, config.mongodb.options);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
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
