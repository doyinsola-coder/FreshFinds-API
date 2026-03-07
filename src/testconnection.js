import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("MONGO_URL =", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("Connection error:", err));