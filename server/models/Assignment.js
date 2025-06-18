const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  targetGrades: [
    {
      grade: String,
      section: String,
    },
  ],
  dueDate: {
    type: Date,
    required: true,
  },
  totalMarks: {
    type: Number,
    default: 100,
  },
  materials: [
    {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  instructions: String,
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  },
  status: {
    type: String,
    enum: ["draft", "published", "completed", "archived"],
    default: "draft",
  },
  submissions: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
      files: [
        {
          filename: String,
          originalName: String,
          mimetype: String,
          size: Number,
        },
      ],
      submissionDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["submitted", "graded", "returned"],
        default: "submitted",
      },
      marks: Number,
      feedback: String,
      gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
      gradedAt: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt on save
assignmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for submission count
assignmentSchema.virtual("submissionCount").get(function () {
  return this.submissions.length;
});

// Virtual for submission percentage
assignmentSchema.virtual("submissionPercentage").get(function () {
  if (!this.targetStudentCount) return 0;
  return Math.round((this.submissions.length / this.targetStudentCount) * 100);
});

module.exports = mongoose.model("Assignment", assignmentSchema);
