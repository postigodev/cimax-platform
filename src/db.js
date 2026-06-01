import mongoose from "mongoose";
import env from "./config/env";

mongoose.set("strictQuery", false);

mongoose
  .connect(env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((error) => {
    console.error("DB connection failed", error);
    process.exit(1);
  });
