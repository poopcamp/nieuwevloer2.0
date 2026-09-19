
# NieuweVloer.be Web Application

## Architecture Overview

This project follows a component-based architecture with React and TypeScript. It's built to provide a user-friendly configurator for tile installation quotes with a focus on maintainability and modularity.

### Key Architecture Decisions

- **Service Layer Pattern**: All data operations are abstracted into service files
- **Context API for State Management**: Using React Context for shared state
- **Component Composition**: Building complex UIs from smaller, focused components
- **Custom Hooks**: Encapsulating logic for reusability

## Directory Structure

The codebase is organized as follows:

- `/src/components`: UI components grouped by feature
- `/src/contexts`: React Context providers for global state
- `/src/hooks`: Custom React hooks
- `/src/services`: Data services for API operations
- `/src/utils`: Utility functions and helpers
- `/src/types`: TypeScript type definitions
- `/src/integrations`: External integrations (e.g., Supabase)

## Development Guidelines

### Adding New Features

1. **Service Layer First**: Add data operations to appropriate service files
2. **Create/Modify Types**: Update TypeScript interfaces as needed
3. **Build UI Components**: Create focused, small components
4. **Connect State**: Use contexts or hooks for state management

### Best Practices

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use services for all API calls
- Follow consistent naming conventions
- Document complex logic

## Key Features

- Tile installation configurator
- Price calculator
- Contact request forms
- Unified admin for **NieuweVloer + NieuwTerras** (leads/offertes, status, dashboard)

## Admin login (P0)

This repo is the **admin SPA source** (`src/pages/admin/*`, `src/components/admin/*`).

Frontend auth **must** call `https://api.nieuwevloer.be` (self-hosted GoTrue on the NAS).  
Do **not** point the browser at `*.supabase.co` — that reintroduces Safari/WebKit **Load failed**.

- Login route: `/admin/login`
- After login: `/admin` (dashboard) and `/admin/leads`
- Default API URL: `https://api.nieuwevloer.be` (`*.supabase.co` env values are ignored)
- Anon key: **only** `VITE_SUPABASE_ANON_KEY` (no hardcoded JWT in the repo)

Live marketing site may also be built from `prestige-driveways-patios`. Keep this admin package free of supabase.co so an admin rebuild cannot reintroduce Load failed.

## Environment variables (Vite build-time)

See `.env.example`. Keys stay on the Home Server — they are not committed.

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | no (defaults to `https://api.nieuwevloer.be`) | Auth + REST host. `*.supabase.co` values are ignored. |
| `VITE_SUPABASE_ANON_KEY` | **yes** | Self-hosted GoTrue anon/public key |
| `VITE_NIEUWTERRAS_API_URL` | no | Optional second PostgREST for NieuwTerras |
| `VITE_NIEUWTERRAS_ANON_KEY` | no | Anon key for that second API (else NV key) |
| `VITE_NIEUWTERRAS_LEADS_TABLE` | no (default `leads`) | Table name on the NT API |
| `VITE_NIEUWTERRAS_ADMIN_API` | no | JSON overview URL from nieuwterras-web |
| `VITE_NIEUWTERRAS_ADMIN_TOKEN` | no | Bearer / X-Admin-Token for that URL |

NieuwTerras in-panel (`/admin/nieuwterras`) reads:

1. `api.nieuwevloer.be` `leads` where source/project looks like terras/patio
2. Optional PostgREST `VITE_NIEUWTERRAS_API_URL`
3. Optional JSON feed `VITE_NIEUWTERRAS_ADMIN_API` (see contract below)

`poopcamp/nieuwterras-web` is private from this environment. Live standalone admin is cookie-login at https://nieuwterras.be/admin (`POST /admin/login`). Public write path: `POST /api/offerte` (`naam`, `email`, `telefoon`, `gemeente`, `oppervlakte`, `bericht`). There is no public GET list today.

### HS data contract (nieuwterras-web)

Add a session-or-token GET that NV admin can call from the browser:

```
GET https://nieuwterras.be/api/admin/overview
Authorization: Bearer <VITE_NIEUWTERRAS_ADMIN_TOKEN>
X-Admin-Token: <same>
```

```json
{
  "ok": true,
  "offertes": [
    {
      "id": "…",
      "naam": "…",
      "email": "…",
      "telefoon": "…",
      "gemeente": "…",
      "oppervlakte": "…",
      "bericht": "…",
      "status": "nieuw",
      "created_at": "2026-09-19T12:00:00.000Z",
      "gelezen": false
    }
  ]
}
```

Allow CORS from the NV admin origin. Then set `VITE_NIEUWTERRAS_ADMIN_API` + `VITE_NIEUWTERRAS_ADMIN_TOKEN` on the NV build.

## Home Server deploy

This repo **is** the live admin SPA.

```
npm ci --legacy-peer-deps && npm run build
# sync dist/ → /mnt/TheLord/Nieuwevloer/nieuwevloer/live/dist
```

SPA fallback to `index.html` for `/admin`, `/admin/login`, `/admin/leads`, `/admin/nieuwterras`.

## Contact

Brian Vanderheyden — Maldegem. For questions about the architecture or codebase, contact the development team.

