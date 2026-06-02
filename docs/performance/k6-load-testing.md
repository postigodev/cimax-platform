# k6 Load Testing

This project includes k6 scripts for validating the API under local Docker MongoDB and, later, the Railway API URL.

## Scripts

```text
load/k6/api-smoke.js
load/k6/api-baseline.js
```

`api-smoke.js` is a short readiness check for local development.

`api-baseline.js` is the portfolio baseline scenario: warm up the service, ramp read traffic, hold steady load, and verify latency/error thresholds.

## Local Smoke

Start the seeded local stack:

```bash
npm run dev:demo
```

In another terminal:

```bash
npm run load:smoke
```

Equivalent raw k6 command:

```bash
k6 run load/k6/api-smoke.js
```

## Local Baseline

```bash
npm run load:baseline
```

Useful overrides:

```bash
TARGET_VUS=20 HOLD=5m k6 run load/k6/api-baseline.js
```

On Windows PowerShell:

```powershell
$env:TARGET_VUS="20"; $env:HOLD="5m"; k6 run load/k6/api-baseline.js
```

## Railway Baseline

After Railway creates the API domain:

```bash
BASE_URL=https://<railway-service-domain> API_KEY=<viewer-or-operator-key> k6 run load/k6/api-baseline.js
```

On Windows PowerShell:

```powershell
$env:BASE_URL="https://<railway-service-domain>"; $env:API_KEY="<viewer-or-operator-key>"; k6 run load/k6/api-baseline.js
```

## Current Thresholds

Smoke:

- failed requests under 1%
- p95 request duration under 500 ms
- checks over 99%

Baseline:

- failed requests under 2%
- p95 request duration under 750 ms
- p99 request duration under 1500 ms
- checks over 98%

## Notes

The local API rate limit defaults to `120` requests per minute. For synthetic load tests, raise `RATE_LIMIT_MAX` in the API environment or expect `429` responses once the limit is reached.

The `/metrics` endpoint can be checked before and after a run to confirm request counters and duration sums moved as expected.

## Docker Runner

If k6 is not installed locally, Docker can run the same scripts:

```powershell
$env:BASE_URL="http://host.docker.internal:3001"; $env:API_KEY="local-viewer-key"; docker run --rm -i -e BASE_URL -e API_KEY -v ${PWD}:/workspace -w /workspace grafana/k6 run load/k6/api-smoke.js
```

## GitHub Actions

The manual workflow can run smoke or baseline scenarios against Railway after deployment:

```text
.github/workflows/load-test.yml
```

Set `K6_API_KEY` as a GitHub Actions secret before running it.
