import mongoose from "mongoose";
import { logger } from "@/utils/logger";

const mongoURI = "mongodb://localhost:27018/chat_db";

const dbChatConnection = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      // If the connection is already established, do not create a new one
      return;
    }

    await mongoose.connect(mongoURI);
    logger.info("Connected to MongoDB successfully");
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default dbChatConnection;
