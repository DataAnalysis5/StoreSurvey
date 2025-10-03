const mongoose = require("mongoose")

const responseSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    storeCode: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        questionText: {
          type: String,
          required: true,
        },
        answer: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        followUpAnswer: {
          type: String,
          default: null,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
responseSchema.index({ submittedAt: -1 })
responseSchema.index({ email: 1 })
responseSchema.index({ storeCode: 1 })

module.exports = mongoose.model("Response", responseSchema)
