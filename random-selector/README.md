# Turn Order Generator

Put a whole group in a fair random order. Everyone joins on a phone, gets a name, and sees
where they land.

**Live:** [tools.gamaleldien.com/random-selector](https://tools.gamaleldien.com/random-selector)

Unlike every other tool in this repo, this one is **not a single self-contained
`index.html`** — it is a Next.js app with a Postgres backend, because a live shared room
needs a server, a database and a realtime channel.

## The four surfaces

| Surface | Route | Who sees it |
|---|---|---|
| Landing | `/` | Anyone |
| Facilitator panel | `/facilitator` | You, after logging in |
| Projection | `/screen/[roomId]` | The room, on a projector |
| Participant | `/join/[code]` → `/room/[roomId]` | Everyone else, on a phone |

The facilitator creates a room, the projection shows a code and a QR, people join on their
phones, and the selector produces a running order nobody can argue with.

## Architecture

```
tools.gamaleldien.com/random-selector/*
  └─ Cloudflare Worker (../build-router.py)   reverse proxy
       └─ Vercel (Next.js, basePath "/random-selector")
            └─ Supabase (Postgres + Realtime + RLS)
```

Phones talk to Supabase **directly** for reads and Realtime — the Worker does not proxy
them. Keep it that way; proxying a WebSocket through the router buys nothing and adds a
failure mode.

### Three things that will silently break if changed carelessly

1. **`src/lib/baseUrl.ts` → `ALLOWED_HOSTS`.** Deliberately throws on an unrecognised host
   rather than trusting a forwarded header, because the value becomes the QR code the room
   scans. A forged host would project a QR pointing at someone else's clone of the join
   form, which harvests real names. Add a host here *and* set `NEXT_PUBLIC_APP_URL`.
2. **`next.config.ts` → `serverActions.allowedOrigins`.** Browsers POST with
   `Origin: tools.gamaleldien.com` while Vercel sees its own host. Wrong value and every
   facilitator action dies with *"Invalid Server Actions request"*.
3. **The proxy route in `build-router.py` must return the upstream response verbatim** and
   sit *above* the shortlink catch-all. Passing it through `htmlResponse()` attaches a CSP
   with no `script-src`, which blocks Next's inline hydration — the page renders and then
   never becomes interactive.

## Local development

```bash
npm install
cp .env.example .env.local     # then fill it in
npm run dev
```

Open <http://localhost:3000/random-selector>.

```bash
npm test          # 73 unit tests
npm run lint
npm run build
```

## Database

Everything lives in `supabase/` — schema, RPCs, RLS, and the fun-name seed. All migrations
are idempotent and safe to re-run.

```bash
supabase link --project-ref <ref>
supabase db push
```

**No browser ever writes.** Clients read under RLS using a short-lived, server-minted JWT
scoped to one room; every mutation runs server-side under the service role or through a
`SECURITY DEFINER` function that only the service role may execute. Participants' real
names are not granted to `anon` at column level, so they cannot reach the projection even
through a Realtime payload, and they are purged when the room closes.

See `supabase/README.md` for the full model.

## Known operational note

The Supabase free tier **pauses a project after ~7 days with no activity**. This tool sits
idle between workshops, so the first load after a long gap can take ~30 seconds while the
database wakes. Open the tool once before a session starts and it will be warm.

## Design

Built on the gamaleldien design system — Clash Display for anything spoken, system-ui for
anything read in quantity or typed into, SF Mono for anything that ticks. Dark by default;
the projection and the landing never theme, the working surfaces do.

The bloom on the reveal is anchored *below* the frame on purpose: its hot centre measures
about 2.98:1 against body copy, so it is placed where type cannot reach it rather than
being covered with a scrim. And no orange ever lands on a word the room has to read.
