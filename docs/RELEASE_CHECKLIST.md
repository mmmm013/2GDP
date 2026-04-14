# Release Checklist

## Creator Auth

1. Validate development credential parity:

```bash
npm run creator:auth:validate:dev
```

2. Validate preview credential parity:

```bash
npm run creator:auth:validate:preview
```

3. Validate live production creator auth matrix:

```bash
npm run creator:auth:validate:prod
```

4. Optional one-shot run:

```bash
npm run creator:auth:validate:all
```

## Notes

- Reports are generated in `handoff/`.
- Reports intentionally exclude credential values.
- Use browser-like user agents for direct production API probes to avoid proxy bot filtering.

## GitHub Action (Manual)

- Workflow: `.github/workflows/creator-auth-validation.yml`
- Trigger: GitHub Actions \u2192 `Creator Auth Validation` \u2192 `Run workflow`
- Required repository secret: `VERCEL_TOKEN`
- Optional repository secrets:
	- `VERCEL_SCOPE` (default: `g-putnam-music`)
	- `VERCEL_PROJECT` (default: `gputnam-music-final-site`)
- Output artifact: `creator-auth-validation-reports` (contains generated `handoff/*.md` reports)
