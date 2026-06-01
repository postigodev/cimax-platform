import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env";
import { errorHandler, notFound } from "./middlewares/error.middlewares";

const app = express();

app.set("port", env.PORT);

app.use(morgan("dev"));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.CORS_ORIGIN.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("Not allowed by CORS");
      error.status = 403;
      return callback(error);
    },
  })
);
app.use(helmet({ crossOriginOpenerPolicy: { policy: "unsafe-none" } }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "cimax-api" })
);
app.use("/v1", require("./routes/api"));
app.use(notFound);
app.use(errorHandler);

export default app;
