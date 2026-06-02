import crypto from "crypto";
import env from "../config/env";
import { recordCacheEvent } from "../observability/metrics";
import { getRedisConnection } from "../queues/redis";

const keyHash = (value) => crypto.createHash("sha256").update(value).digest("hex");

export const cacheKey = (...parts) =>
  ["cimax", ...parts.map((part) => String(part))].join(":");

export const requestCacheKey = (namespace, req) =>
  cacheKey(namespace, keyHash(req.originalUrl));

export const getCachedJson = async (key) => {
  if (!env.CACHE.ENABLED) {
    recordCacheEvent("redis", "bypass");
    return null;
  }

  const cached = await getRedisConnection().get(key);

  if (!cached) {
    recordCacheEvent("redis", "miss");
    return null;
  }

  recordCacheEvent("redis", "hit");
  return JSON.parse(cached);
};

export const setCachedJson = async (key, value, ttlSeconds = env.CACHE.TTL_SECONDS) => {
  if (!env.CACHE.ENABLED) {
    return;
  }

  await getRedisConnection().set(key, JSON.stringify(value), "EX", ttlSeconds);
};

export const invalidateCachePattern = async (pattern) => {
  if (!env.CACHE.ENABLED) {
    return 0;
  }

  const redis = getRedisConnection();
  let cursor = "0";
  let deleted = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
    cursor = nextCursor;

    if (keys.length > 0) {
      deleted += await redis.del(...keys);
    }
  } while (cursor !== "0");

  return deleted;
};

export const cacheHeaders = {
  bypass: "bypass",
  hit: "hit",
  miss: "miss",
};
