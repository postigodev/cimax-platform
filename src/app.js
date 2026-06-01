import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,https://cimax.postigo.sh")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

//settings
app.set("port", process.env.PORT || 3001);
//middleware
app.use(morgan("dev"));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(helmet({ crossOriginOpenerPolicy: { policy: "unsafe-none" } }));
app.use(express.json({ limit: "1mb" }));

//routes
app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "cimax-api" })
);
app.use("/v1", require("./routes/api"));
app.use("*", (req, res) =>
  res
    .status(404)
    .json({ status: 404, message: "Olvidaste ingresar algunos parámetros" })
);
//init
export default app;
