
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

Frontend auth **must** call `https://api.nieuwevloer.be` (Kong → GoTrue).  
Do **not** point the browser at `*.supabase.co` — that host does not resolve in productie and causes Safari/WebKit **Load failed**.

- Login route: `/admin/login`
- After login: `/admin` (dashboard) and `/admin/leads`
- Default API URL: `https://api.nieuwevloer.be`
- Default anon key: the public gateway JWT already used on nieuwevloer.be (overridable)

## Environment variables (Vite build-time)

See `.env.example`.

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | no (defaults to `https://api.nieuwevloer.be`) | Auth + REST host. `*.supabase.co` values are ignored. |
| `VITE_SUPABASE_ANON_KEY` | no (defaults to live gateway anon JWT) | Kong/GoTrue anon key |
| `VITE_NIEUWTERRAS_API_URL` | no | Optional second PostgREST for NieuwTerras |
| `VITE_NIEUWTERRAS_ANON_KEY` | no | Anon key for that second API |
| `VITE_NIEUWTERRAS_LEADS_TABLE` | no (default `leads`) | Table name on the NT API |

Without `VITE_NIEUWTERRAS_API_URL`, NieuwTerras rows are inferred from the same `leads` table (`source` / `project_type` containing terras/patio/…). No fake leads are rendered.

## Home Server deploy

1. On the Home Server, set the Vite env vars above (or rely on the defaults).
2. `npm ci && npm run build`
3. Serve `dist/` for nieuwevloer.be (SPA fallback to `index.html` for `/admin` and `/admin/login`).
4. Keep Kong routes for `/auth/v1/*` and `/rest/v1/*` on `api.nieuwevloer.be`, with browser CORS for the site origin.
5. Do not publish `*.supabase.co` as the browser auth host.

NieuwTerras.be still has its own lightweight `/admin` token page. This repo is the React admin shell for both brands after one login.

## Contact

Brian Vanderheyden — Maldegem. For questions about the architecture or codebase, contact the development team.

