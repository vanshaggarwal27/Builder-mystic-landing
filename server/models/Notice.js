const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  target: {
    type: String,
    required: true,
    enum: ["all", "students", "teachers", "specific_grade", "specific_class"],
  },
  targetDetails: {
    grades: [String],
    sections: [String],
    departments: [String],
  },
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  },
  status: {
    type: String,
    enum: ["draft", "scheduled", "published", "archived"],
    default: "draft",
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: Date,
  attachments: [
    {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
    },
  ],
  readBy: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  analytics: {
    totalReach: { type: Number, default: 0 },
    readCount: { type: Number, default: 0 },
    readPercentage: { type: Number, default: 0 },
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
noticeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate read percentage
noticeSchema.methods.updateReadPercentage = function () {
  if (this.analytics.totalReach > 0) {
    this.analytics.readPercentage = Math.round(
      (this.analytics.readCount / this.analytics.totalReach) * 100,
    );
  }
};

module.exports = mongoose.model("Notice", noticeSchema);
