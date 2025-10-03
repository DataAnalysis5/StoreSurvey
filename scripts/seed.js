require("dotenv").config()
const mongoose = require("mongoose")
const Question = require("../models/Question")
const Admin = require("../models/Admin")

const defaultQuestions = [
  {
    questionText: "Store Name",
    questionType: "text",
    required: true,
    order: 1,
    category: "basic",
  },
  {
    questionText: "Store Code",
    questionType: "text",
    required: true,
    order: 2,
    category: "basic",
  },
  {
    questionText: "Email ID",
    questionType: "text",
    required: true,
    order: 3,
    category: "basic",
  },
  {
    questionText: "Name",
    questionType: "dropdown",
    options: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Other"],
    required: true,
    order: 4,
    category: "basic",
  },
  {
    questionText: "Department",
    questionType: "dropdown",
    options: ["Sales", "Marketing", "Operations", "Human Resources", "IT", "Finance", "Customer Service"],
    required: true,
    order: 5,
    category: "basic",
  },
  {
    questionText: "The person prioritizes their workload effectively and meets deadlines.",
    questionType: "radio",
    options: ["Yes", "No"],
    required: true,
    order: 6,
    category: "performance",
  },
  {
    questionText: "This person communicates clearly and effectively with me and other colleagues.",
    questionType: "radio",
    options: ["Yes", "No"],
    required: true,
    hasFollowUp: true,
    followUpCondition: "No",
    followUpQuestion: "Please explain why:",
    order: 7,
    category: "performance",
  },
  {
    questionText: "This person exhibits strong leadership skills.",
    questionType: "radio",
    options: ["Yes", "No"],
    required: true,
    order: 8,
    category: "leadership",
  },
  {
    questionText: "This employee has strong interpersonal skills and helps everyone feel welcome on the team.",
    questionType: "radio",
    options: ["Yes", "No"],
    required: true,
    order: 9,
    category: "performance",
  },
  {
    questionText: "This team member strongly embodies our company values.",
    questionType: "radio",
    options: ["Yes", "No"],
    required: true,
    order: 10,
    category: "performance",
  },
  {
    questionText: "What is one thing this employee should start doing?",
    questionType: "textarea",
    required: true,
    order: 11,
    category: "feedback",
  },
  {
    questionText: "What is one thing this employee should continue doing?",
    questionType: "textarea",
    required: true,
    order: 12,
    category: "feedback",
  },
  {
    questionText: "What is one thing this employee should stop doing?",
    questionType: "textarea",
    required: true,
    order: 13,
    category: "feedback",
  },
  {
    questionText: "What are three or four words you would use to describe this employee?",
    questionType: "text",
    required: true,
    order: 14,
    category: "feedback",
  },
  {
    questionText: "If you were this leader, what would be the first action you would take?",
    questionType: "textarea",
    required: true,
    order: 15,
    category: "leadership",
  },
  {
    questionText: "What's an area you'd like to see this employee improve?",
    questionType: "textarea",
    required: true,
    order: 16,
    category: "feedback",
  },
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connected to MongoDB")

    // Clear existing questions
    await Question.deleteMany({})
    console.log("Cleared existing questions")

    // Insert default questions
    await Question.insertMany(defaultQuestions)
    console.log(`Inserted ${defaultQuestions.length} default questions`)

    // Create default admin if doesn't exist
    const adminExists = await Admin.findOne({
      username: process.env.ADMIN_USERNAME || "admin",
    })

    if (!adminExists) {
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME || "admin",
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "superadmin",
      })
      await admin.save()
      console.log("Created default admin user")
    } else {
      console.log("Admin user already exists")
    }

    console.log("Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
