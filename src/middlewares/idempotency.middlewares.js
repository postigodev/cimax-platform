import crypto from "crypto";
import env from "../config/env";
import IdempotencyRecord from "../models/IdempotencyRecord";
import ApiError from "../utils/ApiError";

const canonicalize = (value) => {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = canonicalize(value[key]);
        return result;
      }, {});
  }

  return value;
};

const hashBody = (body) =>
  crypto
    .createHash("sha256")
    .update(JSON.stringify(canonicalize(body || {})))
    .digest("hex");

const requestPath = (req) => `${req.baseUrl}${req.path}`;

export const idempotencyMiddleware = async (req, res, next) => {
  const key = req.get("idempotency-key");

  if (!key) {
    return next();
  }

  if (key.length > 128 || !/^[A-Za-z0-9._:-]+$/.test(key)) {
    throw new ApiError(400, "Idempotency-Key invalida");
  }

  const lookup = {
    key,
    method: req.method,
    path: requestPath(req),
  };
  const bodyHash = hashBody(req.body);
  const record = await IdempotencyRecord.findOne(lookup);

  if (record) {
    if (record.bodyHash !== bodyHash) {
      throw new ApiError(
        409,
        "Idempotency-Key ya fue usada con un payload diferente"
      );
    }

    if (record.state === "completed") {
      res.set("Idempotency-Replayed", "true");
      return res.status(record.statusCode).json(record.responseBody);
    }

    throw new ApiError(409, "Solicitud idempotente en progreso");
  }

  req.idempotency = {
    ...lookup,
    bodyHash,
    expiresAt: new Date(Date.now() + env.IDEMPOTENCY.TTL_MS),
  };

  return next();
};

export const reserveIdempotency = async (req, _res, next) => {
  if (!req.idempotency) {
    return next();
  }

  try {
    await IdempotencyRecord.create({
      ...req.idempotency,
      state: "pending",
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Solicitud idempotente en progreso");
    }

    throw error;
  }

  return next();
};

export const completeIdempotency = async (req, statusCode, responseBody) => {
  if (!req.idempotency) {
    return;
  }

  await IdempotencyRecord.updateOne(
    {
      key: req.idempotency.key,
      method: req.idempotency.method,
      path: req.idempotency.path,
      bodyHash: req.idempotency.bodyHash,
    },
    {
      $set: {
        state: "completed",
        statusCode,
        responseBody,
      },
    }
  );
};
