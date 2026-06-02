const assert = require("node:assert/strict");
const test = require("node:test");

process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cimax-test";
process.env.CACHE_ENABLED = "false";

const { cacheKey, requestCacheKey } = require("../dist/cache/redisCache.js");

test("cache keys are namespaced", () => {
  assert.equal(cacheKey("doctores", "all"), "cimax:doctores:all");
});

test("request cache keys hash full request URLs", () => {
  const first = requestCacheKey("ordenes", {
    originalUrl: "/v1/ordenes/get-all/2020-01-01/2030-01-01?page=1",
  });
  const second = requestCacheKey("ordenes", {
    originalUrl: "/v1/ordenes/get-all/2020-01-01/2030-01-01?page=2",
  });

  assert.match(first, /^cimax:ordenes:[a-f0-9]{64}$/);
  assert.match(second, /^cimax:ordenes:[a-f0-9]{64}$/);
  assert.notEqual(first, second);
});
