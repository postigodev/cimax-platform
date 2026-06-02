import { config } from "dotenv";

config();

const parseOrigins = (value) =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isProduction = process.env.NODE_ENV === "production";

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3001),
  MONGO_URI: process.env.MONGO_URI || process.env.URI,
  PSW: process.env.PSW,
  API_KEYS: {
    admin: process.env.ADMIN_API_KEY || (isProduction ? undefined : "local-admin-key"),
    operator:
      process.env.OPERATOR_API_KEY || (isProduction ? undefined : "local-operator-key"),
    viewer: process.env.VIEWER_API_KEY || (isProduction ? undefined : "local-viewer-key"),
  },
  RATE_LIMIT: {
    WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    MAX: Number(process.env.RATE_LIMIT_MAX || 120),
  },
  IDEMPOTENCY: {
    TTL_MS: Number(process.env.IDEMPOTENCY_TTL_MS || 86_400_000),
  },
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  QUEUES: {
    ENABLED: process.env.QUEUE_ENABLED !== "false",
  },
  CACHE: {
    ENABLED: process.env.CACHE_ENABLED !== "false",
    TTL_SECONDS: Number(process.env.CACHE_TTL_SECONDS || 30),
  },
  CORS_ORIGIN: parseOrigins(
    process.env.CORS_ORIGIN ||
      "http://localhost:5173,http://localhost:3000,https://cimax.postigo.sh"
  ),
};

const required = [["MONGO_URI", env.MONGO_URI]];

if (isProduction) {
  required.push(
    ["ADMIN_API_KEY", env.API_KEYS.admin],
    ["OPERATOR_API_KEY", env.API_KEYS.operator],
    ["VIEWER_API_KEY", env.API_KEYS.viewer]
  );
}

const missing = required
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

const configuredApiKeys = Object.values(env.API_KEYS).filter(Boolean);
const uniqueApiKeys = new Set(configuredApiKeys);

if (uniqueApiKeys.size !== configuredApiKeys.length) {
  throw new Error("API key values must be unique per role");
}

export default env;
