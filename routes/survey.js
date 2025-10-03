const express = require("express")
const router = express.Router()
const Question = require("../models/Question")
const Response = require("../models/Response")

// Display survey form
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 })

    res.render("survey", {
      title: "Employee Feedback Survey",
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

    // Validate required basic fields
    if (!storeName || !storeCode || !email || !employeeName || !department) {
      return res.render("survey", {
        title: "Employee Feedback Survey",
        questions: await Question.find().sort({ order: 1 }),
        error: "Please fill in all required fields",
      })
    }

    // Get all questions to build answers array
    const questions = await Question.find().sort({ order: 1 })
    const answersArray = []

    // Process each question's answer
    for (const question of questions) {
      const questionId = question._id.toString()
      const answer = answers[`question_${questionId}`]
      const followUpAnswer = answers[`followup_${questionId}`]

      // Skip basic info questions (they're stored separately)
      if (question.category === "basic") {
        continue
      }

      // Validate required questions
      if (question.required && !answer) {
        return res.render("survey", {
          title: "Employee Feedback Survey",
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
      storeName,
      storeCode,
      email: email.toLowerCase(),
      employeeName,
      department,
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
