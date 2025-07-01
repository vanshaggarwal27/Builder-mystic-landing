const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
      trim: true,
    },
    examType: {
      type: String,
      required: true,
      enum: ["monthly", "first-term", "second-term", "third-term", "final"],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    passingMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    studentResults: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        marksObtained: {
          type: Number,
          required: true,
          min: 0,
        },
        grade: {
          type: String,
          required: true,
          enum: ["A+", "A", "B+", "B", "C", "D", "F"],
        },
        percentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        status: {
          type: String,
          enum: ["pass", "fail"],
          required: true,
        },
        remarks: {
          type: String,
          trim: true,
        },
      },
    ],
    analytics: {
      totalStudents: {
        type: Number,
        default: 0,
      },
      studentsAppeared: {
        type: Number,
        default: 0,
      },
      passedStudents: {
        type: Number,
        default: 0,
      },
      failedStudents: {
        type: Number,
        default: 0,
      },
      averageMarks: {
        type: Number,
        default: 0,
      },
      averagePercentage: {
        type: Number,
        default: 0,
      },
      highestMarks: {
        type: Number,
        default: 0,
      },
      lowestMarks: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Calculate analytics before saving
resultSchema.pre("save", function (next) {
  if (this.studentResults && this.studentResults.length > 0) {
    const results = this.studentResults;

    this.analytics.totalStudents = results.length;
    this.analytics.studentsAppeared = results.length;
    this.analytics.passedStudents = results.filter(
      (r) => r.status === "pass",
    ).length;
    this.analytics.failedStudents = results.filter(
      (r) => r.status === "fail",
    ).length;

    const totalMarks = results.reduce((sum, r) => sum + r.marksObtained, 0);
    this.analytics.averageMarks =
      Math.round((totalMarks / results.length) * 100) / 100;
    this.analytics.averagePercentage =
      Math.round((this.analytics.averageMarks / this.totalMarks) * 100 * 100) /
      100;

    this.analytics.highestMarks = Math.max(
      ...results.map((r) => r.marksObtained),
    );
    this.analytics.lowestMarks = Math.min(
      ...results.map((r) => r.marksObtained),
    );
  }

  next();
});

// Helper method to calculate grade
resultSchema.statics.calculateGrade = function (marks, totalMarks) {
  const percentage = (marks / totalMarks) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

// Helper method to determine pass/fail status
resultSchema.statics.getStatus = function (marks, passingMarks) {
  return marks >= passingMarks ? "pass" : "fail";
};

module.exports = mongoose.model("Result", resultSchema);
