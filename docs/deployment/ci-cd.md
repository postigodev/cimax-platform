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

Backend verification:

```bash
npm ci
npm test
```

Frontend verification:

```bash
cd client
npm ci
npm run build
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

Dependency audit is intentionally not a blocking CI gate yet. This repository started as a legacy sanitized snapshot and currently has known dependency advisories in both backend and frontend dependency graphs.

The modernization plan is:

1. Keep CI green for build and contract safety.
2. Upgrade backend runtime dependencies first.
3. Decide whether to migrate the frontend away from Create React App or harden the existing build.
4. Add a blocking audit gate once critical/high advisories are resolved or explicitly accepted.

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
