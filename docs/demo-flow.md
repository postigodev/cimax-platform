# Demo Flow

Use this flow to evaluate the portfolio project quickly.

## Web Demo

Open:

```text
https://cimax.postigo.sh
```

Check:

- order list loads from the Railway API
- doctor and procedure catalogs load
- date/filter workflows respond
- no CORS errors appear in the browser console

## API Smoke

```bash
API_BASE_URL=https://<railway-api-domain> API_KEY=<viewer-key> npm run smoke:api
```

Expected output:

```json
{"status":"ok","baseUrl":"https://...","doctors":3,"orders":4}
```

## Backend Features To Inspect

- `GET /health` includes queue health
- `GET /metrics` exposes request and cache counters
- `GET /v1/audit/events` is admin-only
- `POST /v1/ordenes/create-orden` supports `Idempotency-Key`
- Redis cache returns `X-Cache: miss` then `X-Cache: hit`
- BullMQ worker writes `order.created` audit events

## Local Demo

```bash
npm run setup
copy .env.example .env
copy client\.env.example client\.env
npm run dev:demo
```

Local URLs:

- API: `http://localhost:3001`
- Web: `http://localhost:5173`
- MongoDB: `mongodb://localhost:27017/cimax`
- Redis: `redis://localhost:6379`
