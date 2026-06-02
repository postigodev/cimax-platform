# Dashboard Environment Variables

Use these values when syncing the repository to Railway and Vercel.

## Railway Services

Create four Railway services:

- `cimax-api`: GitHub repo service, default config file `/railway.json`
- `cimax-worker`: GitHub repo service, custom config file `/railway-worker.json`
- MongoDB service
- Redis service

Railway uses Railpack by default. This repo also includes `railpack.json` to make the Node provider explicit.

## Railway API Service

Set these on `cimax-api`:

```env
NODE_ENV=production
MONGO_URI=${{MongoDB.MONGO_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
PSW=<generate-strong-delete-confirmation-password>
ADMIN_API_KEY=<generate-strong-admin-key>
OPERATOR_API_KEY=<generate-strong-operator-key>
VIEWER_API_KEY=<generate-strong-viewer-key>
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
IDEMPOTENCY_TTL_MS=86400000
QUEUE_ENABLED=true
CACHE_ENABLED=true
CACHE_TTL_SECONDS=30
CORS_ORIGIN=https://cimax.postigo.sh
```

After the API service deploys, generate its public Railway domain. Use that domain for Vercel `VITE_API_URL`.

## Railway Worker Service

Set these on `cimax-worker`:

```env
NODE_ENV=production
MONGO_URI=${{MongoDB.MONGO_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
QUEUE_ENABLED=true
CACHE_ENABLED=false
```

The worker does not need a public domain.

## Vercel Web Project

Project settings:

```text
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Production Domain: cimax.postigo.sh
```

Set this on Vercel:

```env
VITE_API_URL=https://<railway-api-domain>/v1
```

## Post-Deploy Smoke

After Railway deploys:

```bash
API_BASE_URL=https://<railway-api-domain> API_KEY=<viewer-key> npm run smoke:api
```

On Windows PowerShell:

```powershell
$env:API_BASE_URL="https://<railway-api-domain>"; $env:API_KEY="<viewer-key>"; npm run smoke:api
```

After Vercel deploys:

```text
https://cimax.postigo.sh
```

Confirm the frontend uses the Railway API URL ending in `/v1`.
