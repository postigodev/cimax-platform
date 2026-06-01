const assert = require("node:assert/strict");
const test = require("node:test");

process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cimax-test";
process.env.CORS_ORIGIN =
  process.env.CORS_ORIGIN || "http://localhost:3000,https://cimax.postigo.sh";

const appModule = require("../dist/app.js");
const app = appModule.default || appModule;

const listen = () =>
  new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });

test("GET /health returns service status", async (t) => {
  const server = await listen();
  t.after(() => server.close());

  const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { status: "ok", service: "cimax-api" });
});

test("unknown routes use the standard 404 envelope", async (t) => {
  const server = await listen();
  t.after(() => server.close());

  const response = await fetch(`http://127.0.0.1:${server.address().port}/missing`);
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.status, 404);
  assert.equal(body.message, "Ruta no encontrada");
});

test("disallowed CORS origins are rejected with 403", async (t) => {
  const server = await listen();
  t.after(() => server.close());

  const response = await fetch(`http://127.0.0.1:${server.address().port}/health`, {
    headers: {
      Origin: "https://evil.example",
    },
  });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.status, 403);
  assert.equal(body.message, "Not allowed by CORS");
});
