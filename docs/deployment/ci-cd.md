# CI/CD Baseline

The repository uses GitHub Actions as the verification gate for pull requests and pushes to `main`.

## Current CI Jobs

Workflow:

```text
.github/workflows/ci.yml
```

Jobs:

- Backend build and tests
- Frontend production build
- Backend and frontend dependency audit gates

Backend verification:

```bash
npm ci
npm audit
npm test
```

Frontend verification:

```bash
cd client
npm ci
npm audit
npm run build
```

Frontend build output:

```text
client/dist
```

Local equivalent:

```bash
npm run verify
```

## Contract Coverage

The backend test suite currently verifies:

- `GET /health`
- standard 404 envelope
- disallowed CORS origin rejection
- OpenAPI top-level structure
- implemented route coverage
- stale route detection
- path parameter consistency

## Dependency Updates

Dependabot is enabled for:

- backend npm dependencies in `/`
- frontend npm dependencies in `/client`

Updates are grouped by runtime and tooling packages to keep pull requests reviewable.

## Audit Policy

Backend dependency audit is clean after the first modernization pass:

```bash
npm audit --omit=dev
```

The frontend was migrated from Create React App to Vite and now audits clean:

```bash
npm --prefix client audit
```

The modernization plan is:

1. Keep CI green for build and contract safety.
2. Keep backend runtime audit clean.
3. Keep frontend audit clean.
4. Keep audit gates blocking on pull requests and `main`.

## Docker Image Publishing

The API image is published by:

```text
.github/workflows/publish-image.yml
```

It builds the root `Dockerfile` and publishes to:

```text
ghcr.io/<owner>/<repo>/api
```

The image publishing workflow runs on pushes to `main` and can also be triggered manually.

Docker/GHCR notes:

- [docs/deployment/docker-ghcr.md](docker-ghcr.md)
