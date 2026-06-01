# CIMAX Operations Platform

Sanitized public snapshot of a paid internal operations platform built for a dental healthcare services provider.

This repository contains no production data, patient records, proprietary operational records, or secrets. It is being modernized as a portfolio case study focused on backend engineering, API design, security hardening, and deployment operations.

## What It Does

CIMAX centralizes order intake, doctor management, procedure classification, billing flags, delivery status, and operational filtering for a small healthcare workflow.

The original system replaced manual tracking with a structured MERN application:

- Orders reference doctors and one or more procedures.
- Operators can filter by date range, doctor, procedure, patient name, billing number, USB delivery, and workflow color.
- Orders carry operational flags such as CD burned, USB, printed tomography, sent status, comments, and color-based workflow markers.
- The UI is intentionally internal-tool style and Spanish-first because it mirrors the original operational context.

## Tech Stack

Backend:

- Node.js
- Express
- MongoDB + Mongoose
- SWC
- Helmet
- CORS
- Morgan

Frontend:

- React
- React Router
- Material UI
- Axios
- SCSS
- Vite

Target deployment:

- API: Railway
- Web: Vercel
- Web domain: `cimax.postigo.sh`

## Current Modernization Track

This repo is moving from legacy sanitized snapshot to production-style portfolio project.

Planned engineering upgrades:

- Central error handling
- Request validation
- Pagination and Mongo indexes
- OpenAPI documentation
- Contract and integration tests
- RBAC for protected mutations
- Idempotency keys for order creation
- Redis caching for stable catalogs and reports
- BullMQ for async exports/reports
- Prometheus-style API metrics
- k6 load testing
- Docker and Docker Compose
- GitHub Actions CI/CD
- GHCR image publishing
- Railway deployment and rollback docs

## Environment

Backend `.env`:

```env
MONGO_URI=
PSW=
PORT=3001
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://cimax.postigo.sh
```

Frontend `client/.env`:

```env
VITE_API_URL=http://localhost:3001/v1
```

For Vercel, `VITE_API_URL` should point to the Railway API URL plus `/v1`.

## Local Development

Install all dependencies:

```bash
npm run setup
```

Create local env files:

```bash
copy .env.example .env
copy client\.env.example client\.env
```

Run the full local developer stack:

```bash
npm run dev:local
```

This starts:

- MongoDB in Docker
- SWC backend compiler in watch mode
- Express API on `http://localhost:3001`
- Vite web client on `http://localhost:5173`

For this flow, `.env` should point at local Docker Mongo:

```env
MONGO_URI=mongodb://localhost:27017/cimax
```

If you want the API itself containerized too, use Docker Compose:

```bash
npm run docker:up
```

Useful scripts:

```bash
npm run setup        # install backend and frontend dependencies
npm run dev:local    # run Mongo, API compiler, API server, and web client
npm run verify       # backend tests plus frontend production build
npm run verify:audit # backend and frontend npm audit
npm run db:up        # run only MongoDB in Docker
npm run db:down      # stop only MongoDB
npm run db:reset     # stop stack and remove Mongo volume
npm run docker:up    # run API + Mongo with Docker Compose
npm run docker:down  # stop Docker Compose stack
npm run docker:reset # stop stack and remove Mongo volume
```

Build everything:

```bash
npm run build:all
```

## API Surface

Current API prefix:

```text
/v1
```

Healthcheck:

```text
GET /health
```

Main resources:

- `/v1/ordenes`
- `/v1/doctores`

OpenAPI contract:

- [docs/api/openapi.json](docs/api/openapi.json)

Contract coverage currently checks that implemented Express routes are documented and that documented routes are not stale.

## Tests

Run backend smoke and contract tests:

```bash
npm test
```

Current coverage includes:

- `GET /health`
- standard 404 envelope
- disallowed CORS origin rejection
- OpenAPI top-level structure
- implemented route coverage
- stale route detection
- path parameter consistency

## CI/CD

GitHub Actions workflow:

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Local equivalent:

```bash
npm run verify
```

CI currently gates backend build/tests and frontend production build. Dependency audit is available through `npm run verify:audit`.

Backend and frontend dependencies have been upgraded to audit-clean baselines.

CI/CD notes:

- [docs/deployment/ci-cd.md](docs/deployment/ci-cd.md)
- [docs/deployment/docker-ghcr.md](docs/deployment/docker-ghcr.md)
- [docs/deployment/railway-vercel.md](docs/deployment/railway-vercel.md)

## Security Notes

This is a sanitized public version. The production deployment path should use:

- No real patient data
- Demo-only seed data
- Restricted mutation access
- CORS allowlist
- Request size limits
- Rate limiting
- Role-based access control
- Railway/Vercel environment variables only

## Portfolio Focus

The point of this project is not to present a perfect greenfield app. It is a legacy modernization case study:

- Real operational domain
- Existing data model and workflows
- Security cleanup
- API contracts
- Deployment hardening
- Observability and performance validation
- Documented engineering tradeoffs

## License

This repository is provided for portfolio and demonstration purposes only. Reuse, redistribution, or commercial use is not permitted without explicit permission.
