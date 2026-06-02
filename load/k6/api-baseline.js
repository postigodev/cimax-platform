import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://localhost:3001";
const apiKey = __ENV.API_KEY || "local-viewer-key";

export const options = {
  scenarios: {
    warmup: {
      executor: "constant-vus",
      vus: Number(__ENV.WARMUP_VUS || 2),
      duration: __ENV.WARMUP_DURATION || "30s",
      gracefulStop: "10s",
    },
    steady_read_traffic: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: __ENV.RAMP_UP || "1m", target: Number(__ENV.TARGET_VUS || 10) },
        { duration: __ENV.HOLD || "3m", target: Number(__ENV.TARGET_VUS || 10) },
        { duration: __ENV.RAMP_DOWN || "30s", target: 0 },
      ],
      gracefulRampDown: "10s",
      startTime: __ENV.WARMUP_DURATION || "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<750", "p(99)<1500"],
    checks: ["rate>0.98"],
  },
};

const get = (path) =>
  http.get(`${baseUrl}${path}`, {
    headers: {
      "x-api-key": apiKey,
    },
  });

export default function () {
  const responses = [
    http.get(`${baseUrl}/health`),
    get("/v1/ordenes/get-all/2020-01-01/2030-01-01?page=1&limit=25"),
    get("/v1/ordenes/get-by-usb/2020-01-01/2030-01-01?page=1&limit=25"),
    http.get(`${baseUrl}/v1/doctores/all`, {
      headers: {
        "x-api-key": apiKey,
      },
    }),
  ];

  check(responses[0], {
    "health stays healthy": (res) => res.status === 200,
  });

  check(responses[1], {
    "orders list responds": (res) => res.status === 200,
    "orders list includes pagination": (res) => {
      try {
        return Boolean(res.json("pagination"));
      } catch (_error) {
        return false;
      }
    },
  });

  check(responses[2], {
    "usb queue responds": (res) => res.status === 200,
  });

  check(responses[3], {
    "doctors list responds": (res) => res.status === 200,
  });

  sleep(Number(__ENV.SLEEP_SECONDS || 1));
}
