import env from "../config/env";
import ApiError from "../utils/ApiError";

const getClientKey = (req) =>
  req.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.ip ||
  req.socket?.remoteAddress ||
  "unknown";

export const createRateLimiter = ({ windowMs, max, now = Date.now }) => {
  const buckets = new Map();

  return (req, res, next) => {
    if (!max || max < 1) {
      return next();
    }

    const currentTime = now();
    const key = getClientKey(req);
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= currentTime) {
      const resetAt = currentTime + windowMs;
      buckets.set(key, { count: 1, resetAt });
      res.set("RateLimit-Limit", String(max));
      res.set("RateLimit-Remaining", String(max - 1));
      res.set("RateLimit-Reset", String(Math.ceil(resetAt / 1000)));
      return next();
    }

    bucket.count += 1;
    const remaining = Math.max(max - bucket.count, 0);
    res.set("RateLimit-Limit", String(max));
    res.set("RateLimit-Remaining", String(remaining));
    res.set("RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      throw new ApiError(429, "Demasiadas solicitudes; intenta nuevamente mas tarde");
    }

    return next();
  };
};

export const apiRateLimiter = createRateLimiter(env.RATE_LIMIT);
