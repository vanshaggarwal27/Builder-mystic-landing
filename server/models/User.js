const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "teacher", "admin"],
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    address: String,
    avatar: String,
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Student-specific fields
const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  grade: String,
  section: String,
  rollNumber: String,
  academicYear: String,
  admissionDate: Date,
  parentName: String,
  parentPhone: String,
  emergencyContact: String,
  parentContact: {
    fatherName: String,
    motherName: String,
    guardianPhone: String,
    emergencyContact: String,
  },
  attendance: {
    totalDays: { type: Number, default: 0 },
    presentDays: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
  },
});

// Teacher-specific fields
const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
    unique: true,
  },
  department: String,
  position: String,
  experience: String, // Changed from Number to String to allow "5 Years" format
  joiningDate: Date,
  subjects: String, // Store as comma-separated string or use [String] for array
  classes: [String],
  qualifications: [String],
  salary: Number,
});

// Admin-specific fields
const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adminId: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [
    {
      module: String,
      actions: [String],
    },
  ],
  lastActivity: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hide password in JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);
const Student = mongoose.model("Student", studentSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);
const Admin = mongoose.model("Admin", adminSchema);

module.exports = { User, Student, Teacher, Admin };
