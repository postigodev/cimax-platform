# CIMAX Operations Platform

Sanitized public modernization of a legacy MERN operations platform built for a dental healthcare services provider.

This repository contains no production data, patient records, proprietary operational records, or secrets. It is maintained as a portfolio case study focused on backend engineering, API design, security hardening, observability, asynchronous processing, and deployment operations.

## Live Demo

- Web: `https://cimax.postigo.sh`
- API: Railway service domain, documented in the deployment notes after provisioning
- API docs: [docs/api/openapi.json](docs/api/openapi.json)
- Demo flow: [docs/demo-flow.md](docs/demo-flow.md)
- Deployment runbook: [docs/deployment/railway-vercel.md](docs/deployment/railway-vercel.md)
- Dashboard env checklist: [docs/deployment/dashboard-env.md](docs/deployment/dashboard-env.md)

## What It Does

CIMAX centralizes order intake, doctor management, procedure classification, billing flags, delivery status, and operational filtering for a small healthcare workflow.

The original internal system replaced manual tracking with a structured app:

- Orders reference doctors and one or more procedures.
- Operators filter by date range, doctor, procedure, patient name, billing number, USB delivery, and workflow color.
- Orders carry operational flags such as CD burned, USB, printed tomography, sent status, comments, and color-based workflow markers.
- The UI is Spanish-first because it mirrors the original operational context.

## Architecture

```mermaid
flowchart LR
  Web[Vercel Vite React Web<br/>cimax.postigo.sh] --> API[Railway Express API]
  API --> Mongo[(Railway MongoDB)]
  API --> Redis[(Railway Redis)]
  API --> Queue[BullMQ order-events queue]
  Queue --> Worker[Railway Worker]
  Worker --> Mongo
  API --> Metrics[/health and /metrics]
```

Local parity is available through Docker Compose:

- API
- BullMQ worker
- MongoDB
- Redis
- Vite frontend

## Engineering Highlights

- Centralized error handling and standard JSON error envelopes
- Role-scoped API keys for admin/operator/viewer access
- Protected mutations with RBAC
- Idempotency keys for safe order creation retries
- MongoDB indexes and versioned migrations with lock records
- Redis read-through caching with invalidation on writes
- BullMQ background jobs for order events
- Durable audit event log written by the worker
- Prometheus-style `/metrics`
- API rate limiting
- OpenAPI contract plus contract tests
- k6 smoke/baseline load-test scripts
- Docker Compose local infra
- Railway config-as-code with Railpack
- Vercel config-as-code for the frontend
- GitHub Actions CI and manual load-test workflow

## Tech Stack

Backend:

- Node.js, Express, MongoDB, Mongoose
- Redis, BullMQ
- SWC
- Helmet, CORS, Morgan

Frontend:

- React, Vite
- React Router
- Material UI
- Axios

Deployment:

- Railway API service
- Railway worker service
- Railway MongoDB and Redis
- Vercel frontend at `cimax.postigo.sh`

## Quick Start

Install dependencies:

```bash
npm run setup
```

Create env files:

```bash
copy .env.example .env
copy client\.env.example client\.env
```

Run a seeded local demo:

```bash
npm run dev:demo
```

This starts MongoDB, Redis, API, worker, and the Vite frontend.

Useful scripts:

```bash
npm run verify       # backend tests plus frontend production build
npm run verify:audit # backend and frontend npm audit
npm run smoke:api    # post-deploy API smoke test
npm run load:smoke   # short k6 API smoke test
npm run db:migrate   # apply versioned MongoDB migrations
npm run db:seed      # seed deterministic local demo data
npm run docker:up    # run API + worker + Mongo + Redis with Docker Compose
```

## API And Ops

Health:

```text
GET /health
```

Metrics:

```text
GET /metrics
```

Main resources:

- `/v1/ordenes`
- `/v1/doctores`
- `/v1/audit/events`

Mutation routes require `x-api-key`. Order creation also supports `Idempotency-Key`.

Audit events are admin-only and paginated:

```bash
curl -H "x-api-key: local-admin-key" http://localhost:3001/v1/audit/events?type=order.created
```

Redis caches hot read paths when `CACHE_ENABLED=true`; responses include `X-Cache: hit` or `X-Cache: miss`, and cache counters are exposed in `/metrics`.

## Testing

Run the full local verification gate:

```bash
npm run verify
```

Current coverage includes smoke tests, RBAC checks, idempotency validation, cache key tests, deployment config tests, OpenAPI route coverage, migration checks, and rate limiter tests.

## Deployment

Config-as-code files:

- [railway.json](railway.json): Railway API service
- [railway-worker.json](railway-worker.json): Railway worker service
- [railpack.json](railpack.json): Railpack Node provider
- [client/vercel.json](client/vercel.json): Vercel frontend

Post-deploy API smoke:

```bash
API_BASE_URL=https://<railway-api-domain> API_KEY=<viewer-key> npm run smoke:api
```

More deployment detail:

- [docs/deployment/railway-vercel.md](docs/deployment/railway-vercel.md)
- [docs/deployment/dashboard-env.md](docs/deployment/dashboard-env.md)
- [docs/deployment/ci-cd.md](docs/deployment/ci-cd.md)
- [docs/deployment/docker-ghcr.md](docs/deployment/docker-ghcr.md)
- [docs/performance/k6-load-testing.md](docs/performance/k6-load-testing.md)

## Security Notes

This is a sanitized public version. Production deployment uses:

- No real patient data
- Demo-only seed data
- Role-scoped API keys
- CORS allowlist
- Request size limits
- Rate limiting
- Railway/Vercel environment variables only

## Portfolio Focus

This is not a greenfield starter. It is a legacy modernization case study: preserving an existing operational workflow while adding production-grade backend and deployment practices around it.

## License

This repository is provided for portfolio and demonstration purposes only. Reuse, redistribution, or commercial use is not permitted without explicit permission.
