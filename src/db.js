import mongoose from "mongoose";
import { config } from 'dotenv';

config();

const mongoUri = process.env.MONGO_URI || process.env.URI;

if (!mongoUri) {
  throw new Error("Missing MONGO_URI environment variable");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("DB Connected"))
  .catch((error) => {
    console.error("DB connection failed", error);
    process.exit(1);
  });
