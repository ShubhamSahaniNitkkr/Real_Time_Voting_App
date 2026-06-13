const mongoose = require("mongoose");
const { enableDemoMode } = require("./demo");

const db =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/voting";

const connectDB = async () => {
  if (process.env.DEMO_MODE === "true") {
    enableDemoMode();
    console.log("DEMO_MODE enabled — using in-memory votes");
    return;
  }

  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log("mongodb connected");
  } catch (error) {
    console.log("MongoDB unavailable, falling back to DEMO_MODE");
    enableDemoMode();
  }
};

module.exports = connectDB;
