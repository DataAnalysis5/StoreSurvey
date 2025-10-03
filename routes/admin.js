const express = require("express")
const router = express.Router()
const Admin = require("../models/Admin")
const Question = require("../models/Question")
const { isAuthenticated, isLoggedIn } = require("../middleware/auth")

// Admin login page
router.get("/", isLoggedIn, (req, res) => {
  res.render("admin-login", {
    title: "Admin Login",
    error: null,
  })
})

// Admin login handler
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.render("admin-login", {
        title: "Admin Login",
        error: "Please provide both username and password",
      })
    }

    // Find admin
    const admin = await Admin.findOne({ username: username.toLowerCase() })

    if (!admin) {
      return res.render("admin-login", {
        title: "Admin Login",
        error: "Invalid username or password",
      })
    }

    // Check password
    const isMatch = await admin.comparePassword(password)

    if (!isMatch) {
      return res.render("admin-login", {
        title: "Admin Login",
        error: "Invalid username or password",
      })
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    // Set session
    req.session.adminId = admin._id
    req.session.username = admin.username

    res.redirect("/admin/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    res.render("admin-login", {
      title: "Admin Login",
      error: "An error occurred. Please try again.",
    })
  }
})

// Admin dashboard
router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const questionCount = await Question.countDocuments()
    const Response = require("../models/Response")
    const responseCount = await Response.countDocuments()

    res.render("admin-dashboard", {
      title: "Admin Dashboard",
      username: req.session.username,
      questionCount,
      responseCount,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    res.render("error", {
      title: "Error",
      message: "Failed to load dashboard",
    })
  }
})

// Manage questions page
router.get("/questions", isAuthenticated, async (req, res) => {
  try {
    const questions = await Question.find().sort({ order: 1 })
    res.render("admin-questions", {
      title: "Manage Questions",
      username: req.session.username,
      questions,
      success: req.query.success || null,
      error: req.query.error || null,
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    res.render("error", {
      title: "Error",
      message: "Failed to load questions",
    })
  }
})

// Add new question
router.post("/questions/add", isAuthenticated, async (req, res) => {
  try {
    const {
      questionText,
      questionType,
      options,
      required,
      hasFollowUp,
      followUpCondition,
      followUpQuestion,
      category,
    } = req.body

    // Get the highest order number
    const lastQuestion = await Question.findOne().sort({ order: -1 })
    const newOrder = lastQuestion ? lastQuestion.order + 1 : 1

    // Parse options if provided
    let parsedOptions = []
    if (options && options.trim()) {
      parsedOptions = options.split(",").map((opt) => opt.trim())
    }

    const question = new Question({
      questionText,
      questionType,
      options: parsedOptions,
      required: required === "on",
      hasFollowUp: hasFollowUp === "on",
      followUpCondition: followUpCondition || null,
      followUpQuestion: followUpQuestion || null,
      order: newOrder,
      category: category || "performance",
    })

    await question.save()
    res.redirect("/admin/questions?success=Question added successfully")
  } catch (error) {
    console.error("Error adding question:", error)
    res.redirect("/admin/questions?error=Failed to add question")
  }
})

// Edit question page
router.get("/questions/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.redirect("/admin/questions?error=Question not found")
    }

    res.render("admin-edit-question", {
      title: "Edit Question",
      username: req.session.username,
      question,
    })
  } catch (error) {
    console.error("Error fetching question:", error)
    res.redirect("/admin/questions?error=Failed to load question")
  }
})

// Update question
router.post("/questions/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const {
      questionText,
      questionType,
      options,
      required,
      hasFollowUp,
      followUpCondition,
      followUpQuestion,
      category,
    } = req.body

    // Parse options if provided
    let parsedOptions = []
    if (options && options.trim()) {
      parsedOptions = options.split(",").map((opt) => opt.trim())
    }

    await Question.findByIdAndUpdate(req.params.id, {
      questionText,
      questionType,
      options: parsedOptions,
      required: required === "on",
      hasFollowUp: hasFollowUp === "on",
      followUpCondition: followUpCondition || null,
      followUpQuestion: followUpQuestion || null,
      category: category || "performance",
    })

    res.redirect("/admin/questions?success=Question updated successfully")
  } catch (error) {
    console.error("Error updating question:", error)
    res.redirect("/admin/questions?error=Failed to update question")
  }
})

// Delete question
router.post("/questions/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id)
    res.redirect("/admin/questions?success=Question deleted successfully")
  } catch (error) {
    console.error("Error deleting question:", error)
    res.redirect("/admin/questions?error=Failed to delete question")
  }
})

// Reorder questions
router.post("/questions/reorder", isAuthenticated, async (req, res) => {
  try {
    const { questionIds } = req.body

    // Update order for each question
    for (let i = 0; i < questionIds.length; i++) {
      await Question.findByIdAndUpdate(questionIds[i], { order: i + 1 })
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Error reordering questions:", error)
    res.status(500).json({ success: false, error: "Failed to reorder questions" })
  }
})

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
    }
    res.redirect("/admin")
  })
})

module.exports = router
