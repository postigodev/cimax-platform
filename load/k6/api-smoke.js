import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://localhost:3001";
const apiKey = __ENV.API_KEY || "local-viewer-key";

export const options = {
  vus: Number(__ENV.VUS || 2),
  duration: __ENV.DURATION || "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const health = http.get(`${baseUrl}/health`);
  check(health, {
    "health is 200": (res) => res.status === 200,
  });

  const orders = http.get(
    `${baseUrl}/v1/ordenes/get-all/2020-01-01/2030-01-01?limit=20`,
    {
      headers: {
        "x-api-key": apiKey,
      },
    }
  );

  check(orders, {
    "orders list is 200": (res) => res.status === 200,
    "orders response has pagination": (res) => {
      try {
        return Boolean(res.json("pagination"));
      } catch (_error) {
        return false;
      }
    },
  });

  sleep(1);
}
