const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));

test("Railway API config uses Railpack and production API commands", () => {
  const config = readJson("railway.json");

  assert.equal(config.build.builder, "RAILPACK");
  assert.equal(config.build.buildCommand, "npm run build");
  assert.deepEqual(config.deploy.preDeployCommand, ["npm run db:migrate"]);
  assert.equal(config.deploy.startCommand, "npm start");
  assert.equal(config.deploy.healthcheckPath, "/health");
});

test("Railway worker config uses the worker start command", () => {
  const config = readJson("railway-worker.json");

  assert.equal(config.build.builder, "RAILPACK");
  assert.equal(config.deploy.startCommand, "npm run worker");
  assert.equal(config.deploy.restartPolicyType, "ALWAYS");
});

test("Railpack and Vercel config files are present for dashboard sync", () => {
  const railpack = readJson("railpack.json");
  const vercel = readJson(path.join("client", "vercel.json"));

  assert.equal(railpack.provider, "node");
  assert.equal(vercel.framework, "vite");
  assert.equal(vercel.outputDirectory, "dist");
  assert.deepEqual(vercel.rewrites, [
    { source: "/(.*)", destination: "/index.html" },
  ]);
});
