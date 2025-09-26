# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- This is a Vite + React + TypeScript frontend with Tailwind CSS and shadcn/ui-style Radix components.
- Package manager: bun is detected (bun.lockb). npm also works for scripts.
- No backend, ML service, or database code is present in this repo; README describes a broader vision. Supabase integration exists but is currently skeletal.

Common commands
Use either bun or npm equivalents.

Install dependencies
```bash path=null start=null
# Prefer bun (lockfile present)
bun install
# Or with npm
npm install
```

Start development server (Vite on http://localhost:8080)
```bash path=null start=null
bun run dev
# or
npm run dev
```

Build (production) and development builds
```bash path=null start=null
# Production build
bun run build
# or
npm run build

# Development-mode build (uses Vite --mode development)
bun run build:dev
# or
npm run build:dev
```

Preview the built app
```bash path=null start=null
bun run preview
# or
npm run preview
```

Lint the codebase (ESLint flat config)
```bash path=null start=null
# Check
bun run lint
# or
npm run lint

# Apply fixes
bun run lint -- --fix
# or
npm run lint -- --fix
```

Testing
- No test runner or test scripts are configured in package.json. If README mentions npm test, it does not exist here.

High-level architecture and structure
- Entry and bootstrapping
  - src/main.tsx mounts the React app and imports global styles (index.css).
  - src/App.tsx sets up top-level providers and routing.
- App-wide providers
  - Query client: TanStack Query’s QueryClientProvider wraps the app for async data/state.
  - Theming: next-themes ThemeProvider uses attribute="class" (dark mode via class toggling).
  - UI infra: TooltipProvider and two toasters: shadcn/ui Toaster and Sonner.
- Routing
  - BrowserRouter with explicit routes in App.tsx: “/”, “/dashboard”, “/practice”, “/teacher”, “/login”, “/signup”, plus a catch-all “*” to NotFound.
  - Pages live in src/pages and compose domain components. There’s no nested routing configuration file; routes are declared inline in App.tsx.
- UI system
  - Tailwind CSS configured in tailwind.config.ts with custom colors, CSS variables, animations (tailwindcss-animate), and container defaults; content scanning includes ./src and component directories.
  - Reusable components under src/components/ui mirror shadcn/ui patterns and Radix primitives (e.g., dialog, drawer, tooltip, select, tabs, toast).
  - Domain components like StudentDashboard, TeacherDashboard, QuestionCard encapsulate feature UX and re-use ui primitives.
- Data layer and integrations
  - TanStack Query is available for server-state; current sample flows largely use in-memory/sample data.
  - Supabase integration exists under src/integrations/supabase/ with a generated client and empty type definitions; no tables are defined and the client uses a publishable key compiled into the client. No local env configuration is required to run the UI.
- Build and dev tooling
  - Vite config (vite.config.ts):
    - React SWC plugin.
    - Dev server host "::" and port 8080.
    - Path alias: "@" → ./src (used broadly across imports).
    - Development-only plugin: lovable-tagger.
  - TypeScript config uses project references (tsconfig.json → tsconfig.app.json, tsconfig.node.json) with strictness relaxed in the app tsconfig.
  - ESLint 9+ flat config in eslint.config.js extends @eslint/js and typescript-eslint recommended, enables react-hooks and react-refresh rules.

Repository-specific usage notes
- Path alias: Use imports like "@/components/..." and "@/pages/..." instead of relative paths.
- Port: The dev server binds on port 8080; access via http://localhost:8080.
- No tests: There is no configured test framework or scripts at this time.
