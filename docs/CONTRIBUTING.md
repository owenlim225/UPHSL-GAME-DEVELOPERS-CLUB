# Contributing Guide

This document explains how to set up local development, run project checks, and prepare changes for review.

## Prerequisites
- Node.js 20+ (recommended LTS)
- npm 10+

## Development Setup
1. Install dependencies:
   - `npm install`
2. Configure environment variables:
   - No `.env.example` or `.env.sample` is currently present in the repository.
   - Use `docs/operations/environment-config.md` and `docs/operations/deployment-vercel-supabase.md` as the current source references.
   - Add local values in `.env.local` (never commit secret values).
3. Start local dev server:
   - `npm run dev`

<!-- AUTO-GENERATED: scripts from package.json -->
## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Run the built production server |
| `npm run lint` | Run ESLint checks |
<!-- /AUTO-GENERATED -->

<!-- AUTO-GENERATED: environment references -->
## Environment Variables

The project currently has no committed env template file (`.env.example`, `.env.template`, or `.env.sample`). Until one is added, use the variables below from operational docs.

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Public base URL used by frontend and callbacks | `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client-safe anonymous key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only Supabase service key | `eyJ...` |
| `SUPABASE_DB_URL` | Conditional | Direct DB connection URL if direct SQL path is used | `postgresql://...` |
| `SUPABASE_JWT_SECRET` | Conditional | Needed only if app manually verifies Supabase JWTs | `super-secret-value` |
| `ITCHIO_API_KEY` | Optional | Provider token for itch.io adapter flow | `itchio_xxx` |
| `MEDIUM_INTEGRATION_TOKEN` | Optional | Provider token for Medium adapter flow | `medium_xxx` |
| `SYNC_RATE_LIMIT_PER_MINUTE` | Recommended | Throttle for manual refresh endpoints | `30` |
| `ADMIN_SEED_EMAIL` | Optional | Bootstrap admin account email | `admin@school.edu` |
<!-- /AUTO-GENERATED -->

## Testing Procedures
- Current `package.json` does not define a test script yet.
- Minimum verification before opening a PR:
  1. `npm run lint`
  2. `npm run build`
  3. Manual smoke test:
     - Home page (`/`)
     - Projects page (`/projects`)
     - Member profile page (`/members/[slug]`)
     - Health endpoint (`/api/health`)

## Code Style and Quality
- ESLint is enforced via `npm run lint`.
- Follow repository rules in `AGENTS.md` and `.cursor/rules/`.
- Prefer small, focused changes and avoid unrelated refactors.
- Do not commit secrets or private keys.

## Pull Request Checklist
- [ ] Scope is aligned with current MVP design documents.
- [ ] Docs updated if behavior, routes, or environment changed.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Manual smoke checks completed.
- [ ] No secrets included in code, docs, or commit history.
