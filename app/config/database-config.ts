import mongoose from "mongoose";

const databaseConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const ConnectionUrl = process.env.MONGODB_URI || "";
  if (!ConnectionUrl) {
    throw new Error("Connection uri not found");
  }

  try {
    await mongoose.connect(ConnectionUrl);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Error connecting to MongoDB");
  }
};

export default databaseConnection;