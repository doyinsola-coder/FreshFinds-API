import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import dns from "dns";

dotenv.config();

// Fix DNS resolution issues for MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

const startServer = async () => {
  try {
    console.log(process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();