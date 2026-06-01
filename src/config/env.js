import { config } from "dotenv";

config();

const parseOrigins = (value) =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3001),
  MONGO_URI: process.env.MONGO_URI || process.env.URI,
  PSW: process.env.PSW,
  CORS_ORIGIN: parseOrigins(
    process.env.CORS_ORIGIN ||
      "http://localhost:5173,http://localhost:3000,https://cimax.postigo.sh"
  ),
};

const required = [["MONGO_URI", env.MONGO_URI]];

const missing = required
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

export default env;
