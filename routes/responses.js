const express = require("express")
const router = express.Router()
const Response = require("../models/Response")
const { isAuthenticated } = require("../middleware/auth")
const { Parser } = require("json2csv")

// View all responses
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit

    const totalResponses = await Response.countDocuments()
    const totalPages = Math.ceil(totalResponses / limit)

    const responses = await Response.find().sort({ submittedAt: -1 }).skip(skip).limit(limit)

    res.render("responses", {
      title: "Survey Responses",
      username: req.session.username,
      responses,
      currentPage: page,
      totalPages,
      totalResponses,
    })
  } catch (error) {
    console.error("Error fetching responses:", error)
    res.render("error", {
      title: "Error",
      message: "Failed to load responses",
    })
  }
})

// View single response detail
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const response = await Response.findById(req.params.id)

    if (!response) {
      return res.render("error", {
        title: "Error",
        message: "Response not found",
      })
    }

    res.render("response-detail", {
      title: "Response Detail",
      username: req.session.username,
      response,
    })
  } catch (error) {
    console.error("Error fetching response:", error)
    res.render("error", {
      title: "Error",
      message: "Failed to load response",
    })
  }
})

// Export responses as CSV
router.get("/export/csv", isAuthenticated, async (req, res) => {
  try {
    const responses = await Response.find().sort({ submittedAt: -1 })

    if (responses.length === 0) {
      return res.render("error", {
        title: "Error",
        message: "No responses to export",
      })
    }

    // Prepare data for CSV
    const csvData = []

    responses.forEach((response) => {
      const row = {
        "Submission Date": new Date(response.submittedAt).toLocaleString(),
        "Store Name": response.storeName,
        "Store Code": response.storeCode,
        Email: response.email,
        "Employee Name": response.employeeName,
        Department: response.department,
      }

      // Add each answer as a column
      response.answers.forEach((answer, index) => {
        row[`Q${index + 1}: ${answer.questionText}`] = answer.answer

        // Add follow-up answer if exists
        if (answer.followUpAnswer) {
          row[`Q${index + 1} Follow-up`] = answer.followUpAnswer
        }
      })

      csvData.push(row)
    })

    // Convert to CSV
    const parser = new Parser()
    const csv = parser.parse(csvData)

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=survey-responses-${Date.now()}.csv`)

    res.send(csv)
  } catch (error) {
    console.error("Error exporting CSV:", error)
    res.render("error", {
      title: "Error",
      message: "Failed to export responses",
    })
  }
})

// Delete response
router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Response.findByIdAndDelete(req.params.id)
    res.redirect("/responses?success=Response deleted successfully")
  } catch (error) {
    console.error("Error deleting response:", error)
    res.redirect("/responses?error=Failed to delete response")
  }
})

module.exports = router
