const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in environment variables. Please create a .env file with your MongoDB connection string.",
      )
    }

    if (!process.env.MONGODB_URI.startsWith("mongodb://") && !process.env.MONGODB_URI.startsWith("mongodb+srv://")) {
      throw new Error("Invalid MONGODB_URI format. It should start with 'mongodb://' or 'mongodb+srv://'")
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB Connected Successfully")
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message)
    console.error("\nPlease check your .env file and ensure MONGODB_URI is set correctly.")
    console.error("Example: MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/survey-db")
    process.exit(1)
  }
}

module.exports = connectDB
