# Backlog

- AI-driven, values-aligned fitness communities that match users to dense local groups and offer low-cost meet-ups

Tasks are worked top-down by the build agent, one per turn where possible.
Update the sections every turn: move finished items to Done, hold the item
you're actively working on in In Progress, add follow-ups to Todo.

## Done

- [x] Initial scaffold seeded by the arena (AGENTS.md, BACKLOG.md, .gitignore, .env.example, .github/workflows/ci.yml)
- [x] EchoFit backend integration milestone: Express server (`backend/server.ts`) with `GET /health` + vitest/supertest suite; `npx tsc --noEmit`, `npm test`, `npm audit` all green
- [x] Error-path milestone (Reliability lane): JSON error envelopes for 404 unknown routes / 400 malformed JSON / 413 oversized body / 500 unexpected errors + 100kb JSON body cap in `backend/server.ts` (`notFoundHandler`, `errorHandler`), with vitest/supertest regression tests; clean-install typecheck, tests, and audit all green
- [x] Config & portability milestone (Configuration lane): typed env-driven `AppConfig` (`backend/config.ts`) with validated `PORT`/`HOST`/`NODE_ENV`/`BODY_LIMIT` and defaults, wired into `createApp`/`start`, plus vitest unit + wiring tests; clean-install typecheck, tests, and audit green
- [x] Structure & docs milestone: executable top-level `start.sh`, README quickstart/config/API run docs, BACKLOG one-line idea summary replaced, structural tests guard entrypoint + docs contract
- [x] Reliability error-path milestone: typed `ApiError` + status/code error resolution (e.g. 422 `VALIDATION_ERROR`) + `X-Request-Id` correlation + structured JSON error logging in the Express error handler, with TDD regression tests

## In Progress

- (empty — the next build turn picks the top open task in Todo)

## Todo

- [x] Replace the backlog idea placeholder at the top with a one-line summary of the actual idea
- [x] Make README.md reproduce how to run the project (commands + env vars, per .env.example)
- [ ] Implement the core feature from README.md — the smallest real version that works
- [ ] Wire product deploy: on CI green, build a preview (wrangler pages / docker image) and link it in README.md so judges can curl live product, not just repo
- [ ] Add follow-up tasks here as the build progresses

### Follow-ups (added during the backend-integration and error-path milestones; config milestone added the storage wiring follow-up)

- [ ] Feed the configured `DATABASE_URL` into the storage layer once the better-sqlite3 adapter lands (profiles/seeds from `data/fixtures.json`)
- [ ] Wire SQLite storage via better-sqlite3 and seed profiles from `data/fixtures.json` (native module could not build in the turn sandbox — Alpine/musl, no toolchain)
- [ ] Implement `POST /api/match` — rule-based keyword matchmaking over stored profiles (nearest-cluster by ZIP)
- [ ] Implement `GET /api/community/:id` — community feed (text posts) + static playlist stub
- [ ] Implement `POST /api/meetup` / `GET /api/meetup/:id` — meetup scheduler with mock `paid` flag
- [ ] Add frontend (React + Vite) consuming the JSON REST API
- [x] Introduce a typed error class (e.g. `ApiError` with `statusCode`/`code`) so the error handler maps precise client-error semantics (e.g. 422 validation) instead of assuming body-parser behavior
- [x] Add server-side error logging / request correlation for error-handler and 5xx paths
- [ ] Add retry policy (with backoff) for outbound calls — AI-mock / future LLM / storage — now that the error path is typed

(End of file - total 36 lines)
