# EchoFit

Team alpha — spec §3.2 hackathon build.

**One-liner:** AI‑driven, values‑aligned fitness communities that match users to dense local groups and offer low‑cost meet‑ups

**Problem:** Fitness apps give generic programs; users want authentic, identity‑aligned communities that actually form and sustain real‑world interactions

**Solution:** A lightweight AI matches users to micro‑communities that share declared values and are geographically dense. Each community runs a shared calendar, playlist, and optional paid meet‑ups. An automated health‑metrics dashboard flags inactive groups, merges similar clusters into broader categories to keep density, and drives in‑app rewards for attendance and content sharing. Partnerships with local gyms and health services provide co‑hosted events and sponsorship revenue. The MVP focuses on a single high‑density urban market, delivering match‑making, community feeds, meet‑up booking, and basic rewards, all in one repo with a 4‑5 day build cadence.

**Build scope:** **EchoFit – Day 4‑5 Build Plan (≤ 200 words)**  

**Tech stack**  
- **Frontend:** React + Vite, static build served by the same Node process.  
- **Backend:** Node Express (single file) exposing 3 JSON‑REST endpoints.  
- **Storage:** SQLite file (`data.db`) accessed via `better-sqlite3`.  
- **AI‑matchmaking:** Simple rule‑based “AI” using `natural` (keyword similarity) on locally‑stored user profiles – no external model calls.  
- **Single repo:** `echofit/` with `frontend/`, `backend/`, `data/` and a `start.sh` that runs `node backend/server.js` and serves the compiled frontend.

**Three MVP components**  
1. **Profile & Matchmaking Service** – POST `/api/match` returns a community‑ID based on declared values, preferred workout times, and ZIP code (nearest‑cluster logic).  
2. **Community Feed** – GET `/api/community/:id` delivers a JSON list of recent posts (text only) and a static “playlist” stub.  
3. **Meet‑up Scheduler** – POST `/api/meetup` stores a meetup record; GET `/api/meetup/:id` shows details. No real payment gateway – mock a “paid” flag.

**Top 2 risks**  
- **Data sparsity:** With only a handful of users the clustering may produce empty or overly large groups. *Mitigation:* seed the DB with 20 synthetic profiles (included in `data/fixtures.json`).  
- **User‑experience latency:** Running SQLite and the keyword matcher in a single thread could stall the UI. *Mitigation:* keep all calls O(1)‑O(log n) and limit community size to ≤ 50 members for the demo.

**Fallback scope (if time runs out)**  
- Drop the meet‑up scheduler UI; keep only “Create meetup” POST returning a static ID.  
- Replace the keyword matcher with a hard‑coded rule‑set (e.g., if values contain “outdoor” → community 1).  
- Omit the playlist feature entirely.

**Out‑of‑scope for the hackathon**  
- Real payment integration, multi‑region deployment, Kubernetes, custom model training, external APIs beyond the local fixture, compliance audits, and any production‑grade scalability work.  

Built entirely by an AI coding agent across discrete GitHub Actions build turns (spec §8) — no human-written code.
