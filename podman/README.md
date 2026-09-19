# SMMS Web — Podman Setup (Fedora WSL)

React 19 + TypeScript SPA (CRA `react-scripts`), served by `nginx:alpine`.
Image is built in 3 stages (`development` / `builder` on `node:20-slim`,
`production` on `nginx:alpine`) and runs as the non-root `nginx` user.

## Requirements

- Fedora WSL (WSL2) with rootless Podman: `sudo dnf install -y podman podman-compose`
- Verified with Podman 5.8.7 + podman-compose 1.6.0
- Node 20 is only needed inside the image; the host just needs Podman
- A `.env` file (copy `.env.example`); only public Firebase keys, no secrets

## Installation

```bash
cd ~/projects/smms-web            # or /mnt/d/projects/adhim-kitchen/smms-web
cp .env.example .env              # fill in REACT_APP_* Firebase values
```

## Environment

See `.env.example`. All variables are `REACT_APP_*` build args baked into the
static bundle at build time, plus `NODE_ENV`:

| Variable | Purpose |
|---|---|
| `REACT_APP_FIREBASE_API_KEY` … `REACT_APP_VAPID_KEY` | Firebase web config (public keys) |
| `NODE_ENV` | `production` for the prod image |

Changing any value requires a rebuild. Never commit `.env`.

## Build

```bash
podman compose -f compose.yaml build
```

## Run

```bash
podman compose -f compose.yaml up -d
```

App: http://localhost:3000 · Health: http://localhost:3000/health

The app calls the backend API at `http://127.0.0.1:8000` (hardcoded in
`src/constant/api.ts`), so start the `smmsproject` backend stack too.

## Stop

```bash
podman compose -f compose.yaml down
```

## Logs / Status

```bash
podman compose -f compose.yaml ps
podman compose -f compose.yaml logs -f
```

## Database

None. Stateless static site; no volumes. No database to migrate or back up.

## Ports

| Service  | Container | Host (localhost only) |
|---|---|---|
| smms-web (nginx) | 8080 | 3000 |

Only the app port is published; isolated network `smmsweb_network`
(separate from the backend's network). Inside the container nginx listens on
8080 (unprivileged, so the non-root user can bind); see `podman/nginx.conf`.

## Troubleshooting

- `curl -f http://localhost:3000/health` must print `healthy`; the container
  healthcheck uses the same endpoint.
- Blank page / API errors: backend at `127.0.0.1:8000` is likely not running —
  start the backend stack and check CORS.
- `podman compose build --no-cache` + `up -d` after any `.env`/source change.
- Windows checkout: prefer the repo inside `~/projects/` (WSL fs); `/mnt/d/...`
  works but is slower and can hit file-notify limits.
