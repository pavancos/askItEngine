import mongoose from "mongoose";
import MongoStore from "connect-mongo";

async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
    return connection.connection.getClient(); // Ensure client is available
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
export default connectDB;