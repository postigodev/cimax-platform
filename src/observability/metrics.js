const startedAt = Date.now();
const requests = new Map();

const labelValue = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const normalizePath = (req) => {
  if (req.route?.path) {
    return `${req.baseUrl || ""}${req.route.path}`;
  }

  return req.path || req.originalUrl.split("?")[0];
};

const metricKey = ({ method, path, status }) =>
  JSON.stringify({ method, path, status });

const getMetric = (labels) => {
  const key = metricKey(labels);

  if (!requests.has(key)) {
    requests.set(key, {
      labels,
      count: 0,
      durationSecondsSum: 0,
    });
  }

  return requests.get(key);
};

export const metricsMiddleware = (req, res, next) => {
  const started = process.hrtime.bigint();

  res.on("finish", () => {
    const durationSeconds = Number(process.hrtime.bigint() - started) / 1e9;
    const metric = getMetric({
      method: req.method,
      path: normalizePath(req),
      status: res.statusCode,
    });

    metric.count += 1;
    metric.durationSecondsSum += durationSeconds;
  });

  next();
};

export const renderMetrics = (_req, res) => {
  const lines = [
    "# HELP cimax_process_uptime_seconds Process uptime in seconds.",
    "# TYPE cimax_process_uptime_seconds gauge",
    `cimax_process_uptime_seconds ${Math.round((Date.now() - startedAt) / 1000)}`,
    "# HELP cimax_http_requests_total Total HTTP requests by method, path, and status.",
    "# TYPE cimax_http_requests_total counter",
  ];

  for (const metric of requests.values()) {
    const labels = `method="${labelValue(metric.labels.method)}",path="${labelValue(
      metric.labels.path
    )}",status="${metric.labels.status}"`;
    lines.push(`cimax_http_requests_total{${labels}} ${metric.count}`);
  }

  lines.push(
    "# HELP cimax_http_request_duration_seconds_sum Sum of HTTP request durations.",
    "# TYPE cimax_http_request_duration_seconds_sum counter"
  );

  for (const metric of requests.values()) {
    const labels = `method="${labelValue(metric.labels.method)}",path="${labelValue(
      metric.labels.path
    )}",status="${metric.labels.status}"`;
    lines.push(
      `cimax_http_request_duration_seconds_sum{${labels}} ${metric.durationSecondsSum.toFixed(
        6
      )}`
    );
  }

  res.type("text/plain").send(`${lines.join("\n")}\n`);
};
