# Operations Runbook

Operational reference for deploying and verifying the current GDC Aggregator MVP setup.

## Deployment Procedure
1. Ensure branch is merged and green in CI/local checks.
2. Confirm environment variables are set in Vercel:
   - Required: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - Conditional: `SUPABASE_DB_URL`, `SUPABASE_JWT_SECRET`
   - Optional: `ITCHIO_API_KEY`, `MEDIUM_INTEGRATION_TOKEN`, `SYNC_RATE_LIMIT_PER_MINUTE`, `ADMIN_SEED_EMAIL`
3. Trigger Vercel deployment from production branch.
4. Wait for build completion and verify the deployment URL.
5. Run post-deploy health and smoke checks.

Reference: `docs/operations/deployment-vercel-supabase.md`

<!-- AUTO-GENERATED: health checks from route files -->
## Health Checks and Monitoring

| Endpoint | Method | Expected Result |
|---|---|---|
| `/api/health` | `GET` | `200` with `{ service, status: "ok", timestamp }` |

Recommended smoke checks after each deploy:
- `GET /api/health` returns `status: "ok"`
- Public pages load: `/`, `/projects`, `/members/[slug]`
- Auth flows still work (magic link and any enabled OAuth)
<!-- /AUTO-GENERATED -->

## Common Issues and Fixes
- **Auth redirect loop**
  - Verify `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs are aligned for the active domain.
- **Server-side actions failing with auth or permissions**
  - Verify `SUPABASE_SERVICE_ROLE_KEY` is configured and not exposed with `NEXT_PUBLIC_*`.
- **Public content unexpectedly hidden**
  - Check moderation status and visibility in moderation/admin flows.
- **Refresh/import errors**
  - Validate provider credentials and provider-side rate limits.

## Rollback Procedure
1. Open Vercel project deployments.
2. Identify the last known-good production deployment.
3. Promote/redeploy that version.
4. Re-run health checks and key smoke checks.
5. Capture incident details in docs/decision logs before retrying forward deploy.

## Alerting and Escalation
- Current setup has no repo-defined alerting integration file.
- Minimum escalation path for incidents:
  1. Triage via `/api/health` and Vercel deploy/runtime logs.
  2. Validate Supabase project health and auth settings.
  3. Roll back if public routes or auth are degraded.
  4. Notify maintainers and record incident context in project documentation.
