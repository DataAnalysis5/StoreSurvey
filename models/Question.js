const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    questionType: {
      type: String,
      enum: ["text", "radio", "dropdown", "textarea", "checkbox"],
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
    required: {
      type: Boolean,
      default: true,
    },
    hasFollowUp: {
      type: Boolean,
      default: false,
    },
    followUpCondition: {
      type: String,
      default: null,
    },
    followUpQuestion: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["basic", "performance", "leadership", "feedback"],
      default: "performance",
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient ordering
questionSchema.index({ order: 1 })

module.exports = mongoose.model("Question", questionSchema)
