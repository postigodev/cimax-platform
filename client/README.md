# CIMAX Web Client

React frontend for the sanitized CIMAX operations platform.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build is emitted to:

```text
dist
```

## Environment

```env
VITE_API_URL=http://localhost:3001/v1
```

For production, `VITE_API_URL` should point to the Railway API URL plus `/v1`.
