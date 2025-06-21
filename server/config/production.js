require("dotenv").config();

module.exports = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      retryWrites: true,
      w: "majority",
    },
  },

  // JWT
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      "shkva_super_secret_jwt_key_change_this_in_production_2024",
    expiresIn: "7d",
    algorithm: "HS256",
  },

  // Server
  server: {
    port: process.env.PORT || 5000,
    host: "0.0.0.0",
    env: process.env.NODE_ENV || "production",
  },

  // CORS
  cors: {
    origins: process.env.FRONTEND_ORIGINS
      ? process.env.FRONTEND_ORIGINS.split(",")
      : [
          "http://localhost:8080",
          "http://localhost:3000",
          /.*\.railway\.app$/,
          /.*\.render\.com$/,
          /.*\.vercel\.app$/,
          /.*\.netlify\.app$/,
          /.*\.builder\.codes$/,
          /.*\.projects\.builder\.codes$/,
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES
      ? process.env.ALLOWED_FILE_TYPES.split(",")
      : ["pdf", "doc", "docx", "jpg", "jpeg", "png", "csv"],
    uploadDir: "./uploads",
  },

  // Security
  security: {
    helmetEnabled: process.env.HELMET_ENABLED === "true",
    trustProxy: true,
  },

  // Session
  session: {
    secret:
      process.env.SESSION_SECRET || "shkva_session_secret_change_this_2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge:
        parseInt(process.env.SESSION_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
};
