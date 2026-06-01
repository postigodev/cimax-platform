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
- Create React App

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
CORS_ORIGIN=http://localhost:3000,https://cimax.postigo.sh
```

Frontend `client/.env`:

```env
REACT_APP_API_URL=http://localhost:3001/v1
```

For Vercel, `REACT_APP_API_URL` should point to the Railway API URL plus `/v1`.

## Local Development

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm --prefix client install
```

Build the backend once:

```bash
npm run build
```

Run the backend:

```bash
npm start
```

For backend development, run these in separate terminals:

```bash
npm run dev:build
npm run dev
```

Run the frontend:

```bash
npm run start:client
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

OpenAPI documentation is planned as part of the modernization track.

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
