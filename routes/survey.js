const express = require("express")
const router = express.Router()
const Question = require("../models/Question")
const Response = require("../models/Response")

// Display survey form
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 })

    res.render("survey", {
      title: "Complaint Handling Survey",
      questions,
    })
  } catch (error) {
    console.error("Error loading survey:", error)
    res.render("error", {
      title: "Error",
      message: "Failed to load survey form",
    })
  }
})

// Submit survey response
router.post("/submit", async (req, res) => {
  try {
    const { storeName, storeCode, email, employeeName, department, ...answers } = req.body

    // Get all questions to build answers array
    const questions = await Question.find().sort({ order: 1 })
    const answersArray = []

    // Process each question's answer
    for (const question of questions) {
      const questionId = question._id.toString()
      let answer = answers[`question_${questionId}`]
      const followUpAnswer = answers[`followup_${questionId}`]

      // Skip basic info questions (they're stored separately)
      if (question.category === "basic") {
        continue
      }

      if (question.questionType === "checkbox") {
        // If answer is an array, join it; if single value, convert to array
        if (Array.isArray(answer)) {
          answer = answer.join(", ")
        } else if (answer) {
          answer = answer
        } else {
          answer = null
        }
      }

      // Validate required questions
      if (question.required && !answer) {
        return res.render("survey", {
          title: "Complaint Handling Survey",
          questions,
          error: `Please answer: ${question.questionText}`,
        })
      }

      if (answer) {
        answersArray.push({
          questionId: question._id,
          questionText: question.questionText,
          answer: answer,
          followUpAnswer: followUpAnswer || null,
        })
      }
    }

    // Create response document
    const response = new Response({
      storeName: storeName || "N/A",
      storeCode: storeCode || "N/A",
      email: email ? email.toLowerCase() : "N/A",
      employeeName: employeeName || "N/A",
      department: department || "N/A",
      answers: answersArray,
      ipAddress: req.ip || req.connection.remoteAddress,
    })

    await response.save()

    res.render("success", {
      title: "Survey Submitted",
    })
  } catch (error) {
    console.error("Error submitting survey:", error)
    res.render("error", {
      title: "Error",
      message: "Failed to submit survey. Please try again.",
    })
  }
})

module.exports = router
