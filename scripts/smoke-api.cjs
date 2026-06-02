const assert = require("node:assert/strict");

const baseUrl = process.env.API_BASE_URL || "http://localhost:3001";
const apiKey = process.env.API_KEY || process.env.VIEWER_API_KEY || "local-viewer-key";

const getJson = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
};

(async () => {
  const health = await getJson("/health");
  assert.equal(health.response.status, 200);
  assert.equal(health.body.status, "ok");

  const doctors = await getJson("/v1/doctores/all", {
    headers: {
      "x-api-key": apiKey,
    },
  });
  assert.equal(doctors.response.status, 200);
  assert.ok(Array.isArray(doctors.body.doctores));

  const orders = await getJson(
    "/v1/ordenes/get-all/2020-01-01/2030-01-01?page=1&limit=5",
    {
      headers: {
        "x-api-key": apiKey,
      },
    }
  );
  assert.equal(orders.response.status, 200);
  assert.ok(orders.body.pagination);

  console.log(
    JSON.stringify({
      status: "ok",
      baseUrl,
      doctors: doctors.body.doctores.length,
      orders: orders.body.ordenes_length,
    })
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
