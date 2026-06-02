# Railway + Vercel Deployment Notes

This project targets a split deployment:

- Backend API on Railway
- Frontend on Vercel
- Vercel domain: `cimax.postigo.sh`

The Railway API domain will be generated during deployment. After Railway creates the service URL, set the Vercel environment variable:

```env
VITE_API_URL=https://<railway-service-domain>/v1
```

## Railway API

Required environment variables:

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

The API exits at startup in production if role-scoped API keys are missing.
Use strong generated values in Railway and pass them only to trusted admin/operator clients.

Expected commands:

```bash
npm install
npm run build
npm start
```

Healthcheck:

```text
GET /health
```

Railway can deploy from the repository or from the published GHCR API image:

```text
ghcr.io/<owner>/<repo>/api
```

The Railway service domain is generated during deployment. Once it exists, use that domain in Vercel as `VITE_API_URL`.

## Vercel Web

Project root:

```text
client
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Required environment variables:

```env
VITE_API_URL=https://<railway-service-domain>/v1
```

Production domain:

```text
cimax.postigo.sh
```

## Rollback Notes

Initial rollback path:

1. Promote the previous healthy Railway deployment.
2. Confirm `GET /health` returns `200`.
3. Keep Vercel pointed at the stable Railway API URL.
4. Revert the frontend deployment only if the web build introduced the failure.

Blue/green promotion will be documented after the first Railway deployment is created.
