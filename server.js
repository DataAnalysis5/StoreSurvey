require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "survey-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  }),
)

// View engine setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Routes
const indexRoutes = require("./routes/index")
const surveyRoutes = require("./routes/survey")
const adminRoutes = require("./routes/admin")
const responseRoutes = require("./routes/responses")

app.use("/", indexRoutes)
app.use("/survey", surveyRoutes)
app.use("/admin", adminRoutes)
app.use("/responses", responseRoutes)

// Error handling middleware
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error", {
    title: "Error",
    message: "Something went wrong!",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
