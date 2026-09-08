import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(mongoURI);

        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        if (error instanceof Error) {
            console.error("❌ MongoDB connection failed:", error.message);
        } else {
            console.error("❌ MongoDB connection failed:", error);
        }

        process.exit(1);
    }
};

export default connectDB;