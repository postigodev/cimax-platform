const assert = require("node:assert/strict");
const test = require("node:test");

process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cimax-test";

const { createRateLimiter } = require("../dist/middlewares/rateLimit.middlewares.js");

const makeReq = () => ({
  ip: "127.0.0.1",
  get() {
    return undefined;
  },
});

const makeRes = () => {
  const headers = new Map();

  return {
    set(name, value) {
      headers.set(name, value);
    },
    getHeader(name) {
      return headers.get(name);
    },
  };
};

test("rate limiter rejects requests over the configured limit", () => {
  let currentTime = 1_000;
  const limiter = createRateLimiter({
    windowMs: 60_000,
    max: 2,
    now: () => currentTime,
  });

  const next = () => {};

  limiter(makeReq(), makeRes(), next);
  limiter(makeReq(), makeRes(), next);

  assert.throws(
    () => limiter(makeReq(), makeRes(), next),
    /Demasiadas solicitudes/
  );

  currentTime += 60_001;
  const res = makeRes();
  assert.doesNotThrow(() => limiter(makeReq(), res, next));
  assert.equal(res.getHeader("RateLimit-Remaining"), "1");
});
