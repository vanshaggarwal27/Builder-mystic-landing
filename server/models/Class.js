const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }, // e.g., "Grade 10-A"
  grade: {
    type: String,
    required: true,
  }, // e.g., "10"
  section: {
    type: String,
    required: true,
  }, // e.g., "A"
  academicYear: {
    type: String,
    required: true,
    default: "2024-25",
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  room: {
    type: String,
    default: "Not assigned",
  },
  capacity: {
    type: Number,
    default: 40,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  subjects: [
    {
      name: String,
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    },
  ],
  schedule: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
      period: String,
      subject: String,
      teacher: {
        type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
      },
      startTime: String,
      endTime: String,
      room: String,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
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
classSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for student count
classSchema.virtual("studentCount").get(function () {
  return this.students.length;
});

// Virtual for current enrollment percentage
classSchema.virtual("enrollmentPercentage").get(function () {
  return Math.round((this.students.length / this.capacity) * 100);
});

module.exports = mongoose.model("Class", classSchema);
