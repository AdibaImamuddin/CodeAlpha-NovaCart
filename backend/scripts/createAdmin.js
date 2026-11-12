
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } =
      process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGO_URI) {
      throw new Error("Admin credentials or MONGO_URI are missing in .env");
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error("Admin password must be at least 8 characters.");
    }

    await mongoose.connect(MONGO_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log("Admin account already exists.");
      } else {
        console.log("This email belongs to a customer. No changes made.");
      }

      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

createAdmin();
