require("dotenv").config()
const mongoose = require("mongoose")
const Question = require("../models/Question")
const Admin = require("../models/Admin")

const defaultQuestions = [
  {
    questionText: "Was the process of logging the complaint easy and clear?",
    questionType: "radio",
    options: ["Very easy", "Somewhat easy", "Neutral", "Difficult", "Very difficult"],
    required: true,
    order: 1,
    category: "feedback",
  },
  {
    questionText: "Were you able to reach the right department/person quickly?",
    questionType: "radio",
    options: ["Yes", "No"],
    required: true,
    order: 2,
    category: "feedback",
  },
  {
    questionText: "How long did it take to receive an initial response?",
    questionType: "radio",
    options: ["Within 12 hour", "Within 24 hours", "More than 24 hours", "No response received"],
    required: true,
    order: 3,
    category: "feedback",
  },
  {
    questionText: "Was the issue resolved to your satisfaction?",
    questionType: "radio",
    options: ["Fully resolved", "Partially resolved", "Not resolved"],
    required: true,
    order: 4,
    category: "feedback",
  },
  {
    questionText: "How would you rate the quality of the resolution?",
    questionType: "radio",
    options: ["Excellent", "Good", "Fair", "Poor"],
    required: true,
    order: 5,
    category: "feedback",
  },
  {
    questionText: "How did this issue impact your store's operations?",
    questionType: "textarea",
    required: true,
    order: 6,
    category: "feedback",
  },
  {
    questionText: "Were you kept informed throughout the complaint handling process?",
    questionType: "radio",
    options: ["Yes, regularly", "Occasionally", "Not at all"],
    required: true,
    order: 7,
    category: "feedback",
  },
  {
    questionText: "Was the communication professional and helpful?",
    questionType: "radio",
    options: ["Yes", "No"],
    required: true,
    hasFollowUp: true,
    followUpCondition: "No",
    followUpQuestion: "If no, please explain:",
    order: 8,
    category: "feedback",
  },
  {
    questionText: "What could have been done better in handling your complaint?",
    questionType: "textarea",
    required: true,
    order: 9,
    category: "feedback",
  },
  {
    questionText: "Any suggestions to improve the complaint resolution process?",
    questionType: "textarea",
    required: true,
    order: 10,
    category: "feedback",
  },
  {
    questionText: "Overall, how satisfied are you with how the complaint was handled?",
    questionType: "radio",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
    required: true,
    order: 11,
    category: "feedback",
  },
]

async function seedDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ ERROR: MONGODB_URI is not defined!")
      console.error("\nPlease follow these steps:")
      console.error("1. Create a .env file in the root directory")
      console.error("2. Add your MongoDB connection string:")
      console.error("   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/survey-db")
      console.error("\nTo get your MongoDB connection string:")
      console.error("1. Go to https://cloud.mongodb.com/")
      console.error("2. Click 'Connect' on your cluster")
      console.error("3. Choose 'Connect your application'")
      console.error("4. Copy the connection string and replace <password> with your actual password")
      process.exit(1)
    }

    if (!process.env.MONGODB_URI.startsWith("mongodb://") && !process.env.MONGODB_URI.startsWith("mongodb+srv://")) {
      console.error("❌ ERROR: Invalid MONGODB_URI format!")
      console.error("Your connection string should start with 'mongodb://' or 'mongodb+srv://'")
      console.error("\nCurrent value:", process.env.MONGODB_URI)
      console.error("\nCorrect format:")
      console.error("MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/survey-db")
      process.exit(1)
    }

    console.log("Connecting to MongoDB...")
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✓ Connected to MongoDB")

    // Clear existing questions
    await Question.deleteMany({})
    console.log("✓ Cleared existing questions")

    // Insert default questions
    await Question.insertMany(defaultQuestions)
    console.log(`✓ Inserted ${defaultQuestions.length} default questions`)

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
      console.log("✓ Created default admin user")
      console.log(`  Username: ${admin.username}`)
      console.log(`  Password: ${process.env.ADMIN_PASSWORD || "admin123"}`)
    } else {
      console.log("✓ Admin user already exists")
    }

    console.log("\n✅ Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Error seeding database:", error.message)

    if (error.message.includes("ENOTFOUND") || error.message.includes("querySrv")) {
      console.error("\n🔍 This looks like a DNS/connection string issue.")
      console.error("Please verify:")
      console.error("1. Your MongoDB connection string is correct")
      console.error("2. You've replaced <password> with your actual password")
      console.error("3. You've replaced the cluster URL with your actual cluster URL")
      console.error("4. Your IP address is whitelisted in MongoDB Atlas (Network Access)")
    } else if (error.message.includes("authentication failed")) {
      console.error("\n🔍 Authentication failed.")
      console.error("Please check that your username and password are correct in the connection string.")
    }

    process.exit(1)
  }
}

seedDatabase()
