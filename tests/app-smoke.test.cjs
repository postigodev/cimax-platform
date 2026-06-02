const assert = require("node:assert/strict");
const test = require("node:test");

process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cimax-test";
process.env.CORS_ORIGIN =
  process.env.CORS_ORIGIN || "http://localhost:3000,https://cimax.postigo.sh";
process.env.ADMIN_API_KEY = process.env.ADMIN_API_KEY || "local-admin-key";
process.env.OPERATOR_API_KEY = process.env.OPERATOR_API_KEY || "local-operator-key";
process.env.VIEWER_API_KEY = process.env.VIEWER_API_KEY || "local-viewer-key";
process.env.QUEUE_ENABLED = "false";

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
  assert.deepEqual(body, {
    status: "ok",
    service: "cimax-api",
    queues: { enabled: false },
  });
});

test("GET /metrics exposes Prometheus-style counters", async (t) => {
  const server = await listen();
  t.after(() => server.close());

  await fetch(`http://127.0.0.1:${server.address().port}/health`);
  const response = await fetch(`http://127.0.0.1:${server.address().port}/metrics`);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/plain/);
  assert.match(body, /cimax_process_uptime_seconds/);
  assert.match(body, /cimax_http_requests_total/);
  assert.match(body, /path="\/health"/);
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

test("mutating order routes require an API key", async (t) => {
  const server = await listen();
  t.after(() => server.close());

  const response = await fetch(
    `http://127.0.0.1:${server.address().port}/v1/ordenes/create-orden`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.status, 401);
  assert.equal(body.message, "API key requerida");
});

test("viewer API keys cannot mutate orders", async (t) => {
  const server = await listen();
  t.after(() => server.close());

  const response = await fetch(
    `http://127.0.0.1:${server.address().port}/v1/ordenes/create-orden`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "local-viewer-key",
      },
      body: JSON.stringify({}),
    }
  );
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.status, 403);
  assert.equal(body.message, "No tiene permisos para esta accion");
});

test("invalid idempotency keys are rejected before order creation", async (t) => {
  const server = await listen();
  t.after(() => server.close());

  const response = await fetch(
    `http://127.0.0.1:${server.address().port}/v1/ordenes/create-orden`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "local-operator-key",
        "Idempotency-Key": "invalid key with spaces",
      },
      body: JSON.stringify({}),
    }
  );
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.status, 400);
  assert.equal(body.message, "Idempotency-Key invalida");
});

test("operator API keys cannot use admin-only delete routes", async (t) => {
  const server = await listen();
  t.after(() => server.close());

  const response = await fetch(
    `http://127.0.0.1:${server.address().port}/v1/ordenes/delete-orden`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "local-operator-key",
      },
      body: JSON.stringify({ password: "unused", ordenes: [] }),
    }
  );
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.status, 403);
  assert.equal(body.message, "No tiene permisos para esta accion");
});
