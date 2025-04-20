import mongoose from "mongoose";

const connectDB = async () => {
  if(!process.env.SERVER_DB) throw new Error("SERVER_DB not found in .env")

  try {
    const conn = await mongoose.connect(process.env.SERVER_DB, {
      maxPoolSize: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
