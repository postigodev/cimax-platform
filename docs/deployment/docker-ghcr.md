# Docker and GHCR

The backend API is containerized separately from the frontend.

- API: Docker image
- Web: Vercel build from `client`

This split matches the target deployment:

- Railway runs the API
- Vercel serves `cimax.postigo.sh`

## Local API Image

Build the API image:

```bash
docker build -t cimax-api:local .
```

Run the API image against a local MongoDB connection:

```bash
docker run --rm \
  -p 3001:3001 \
  -e MONGO_URI="mongodb://host.docker.internal:27017/cimax" \
  -e PSW="local-delete-password" \
  -e ADMIN_API_KEY="local-admin-key" \
  -e OPERATOR_API_KEY="local-operator-key" \
  -e VIEWER_API_KEY="local-viewer-key" \
  -e RATE_LIMIT_WINDOW_MS=60000 \
  -e RATE_LIMIT_MAX=120 \
  -e CORS_ORIGIN="http://localhost:3000,https://cimax.postigo.sh" \
  cimax-api:local
```

Healthcheck:

```bash
curl http://localhost:3001/health
```

## Local Compose Stack

Run API + Mongo:

```bash
docker compose up --build
```

The compose stack exposes:

- API: `http://localhost:3001`
- MongoDB: `mongodb://localhost:27017/cimax`

Stop the stack:

```bash
docker compose down
```

Remove local Mongo data:

```bash
docker compose down -v
```

## GHCR Publishing

Workflow:

```text
.github/workflows/publish-image.yml
```

The workflow publishes the API image to GitHub Container Registry:

```text
ghcr.io/<owner>/<repo>/api
```

Tags:

- branch name
- git SHA prefixed with `sha-`
- `latest` on the default branch

## Railway Image Deployment

Railway can deploy the API from the repository or from the GHCR image. The preferred portfolio path is image-based deployment because it demonstrates a deployable artifact separate from the platform runtime.

Railway environment variables:

```env
MONGO_URI=
PSW=
ADMIN_API_KEY=
OPERATOR_API_KEY=
VIEWER_API_KEY=
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
PORT=3001
CORS_ORIGIN=https://cimax.postigo.sh
```

After Railway creates the API URL, set the Vercel frontend variable:

```env
VITE_API_URL=https://<railway-service-domain>/v1
```

## Notes

The Docker image intentionally excludes:

- frontend source
- docs
- tests
- local env files
- local dependency folders

Runtime contents are limited to production dependencies and compiled API files in `dist`.

The production dependency install currently reports `0 vulnerabilities` during Docker build.
