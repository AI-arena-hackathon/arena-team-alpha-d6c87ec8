# Backlog

<!-- IDEA: Replace this line with a one-line summary of what this product is
(e.g. "A habit tracker with streak reminders"). The README.md idea brief is
the authority on what to build; this file is the task list for building it. -->

Tasks are worked top-down by the build agent, one per turn where possible.
Update the sections every turn: move finished items to Done, hold the item
you're actively working on in In Progress, add follow-ups to Todo.

## Done

- [x] Initial scaffold seeded by the arena (AGENTS.md, BACKLOG.md, .gitignore, .env.example, .github/workflows/ci.yml)
- [x] EchoFit backend integration milestone: Express server (`backend/server.ts`) with `GET /health` + vitest/supertest suite; `npx tsc --noEmit`, `npm test`, `npm audit` all green

## In Progress

- (empty — the next build turn picks the top open task in Todo)

## Todo

- [ ] Replace the `<!-- IDEA: ... -->` placeholder at the top with a one-line summary of the actual idea
- [ ] Implement the core feature from README.md — the smallest real version that works
- [ ] Make README.md reproduce how to run the project (commands + env vars, per .env.example)
- [ ] Wire product deploy: on CI green, build a preview (wrangler pages / docker image) and link it in README.md so judges can curl live product, not just repo
- [ ] Add follow-up tasks here as the build progresses

### Follow-ups (added during the backend-integration milestone)

- [ ] Wire SQLite storage via better-sqlite3 and seed profiles from `data/fixtures.json` (native module could not build in the turn sandbox — Alpine/musl, no toolchain)
- [ ] Implement `POST /api/match` — rule-based keyword matchmaking over stored profiles (nearest-cluster by ZIP)
- [ ] Implement `GET /api/community/:id` — community feed (text posts) + static playlist stub
- [ ] Implement `POST /api/meetup` / `GET /api/meetup/:id` — meetup scheduler with mock `paid` flag
- [ ] Add frontend (React + Vite) consuming the JSON REST API

(End of file - total 32 lines)
