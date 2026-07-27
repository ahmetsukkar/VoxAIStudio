# Zero-Cost Migration Plan

**Goal:** run vox-ai-studio at **$0/month, permanently**, while keeping the whole
product open and usable for everyone. Optional paid credits stay architected but
switched off until real demand appears.

**Status:** Phases 1–5 done. 1–4 live on `main`, Phase 3 cost measured
(2026-07-27, see §2), Phase 5 done locally (2026-07-27, not yet committed).
Phases 6–8 not started.
**Written:** 2026-07-26. **Branch at time of writing:** `staging`.

---

## 1. Context — read this first

The project was built as a paid TTS SaaS (credit packs via Polar). Reality after
launch: **zero paying customers, all users on free trial.** The market is
saturated with free TTS. Decision taken: stop treating this as a revenue product
and treat it as a **portfolio piece that happens to be publicly usable**.

The constraint that drives every decision below:

> The owner will not pay a single cent to keep this running.

### The reframe that matters

A *portfolio piece* and a *free public platform* have opposite cost profiles:

| | Portfolio piece | Free public platform |
|---|---|---|
| Real audience | **one evaluator, ~3 minutes** | unbounded users |
| Success = | it works **flawlessly** when opened | survives load |
| Shared free quota | never touched | **exhausted → site looks broken** |

The second goal breaks the first: an evaluator who opens the site and sees
`Quota exceeded` concludes the author cannot ship stable software.

**Design rule that follows:** the public landing page and demo must **never**
depend on API quota. Live generation is a bonus behind login, quota-capped.

---

## 2. Verified facts (do not re-derive)

### AWS is NOT the problem — this was checked against the real bill

| | |
|---|---|
| Account | `publishvox-dev-account` (836568434462) |
| Credit | $100 AWS Free Tier, issued 2026-01-17, **expires 2027-01-17** |
| Used in ~6 months | **$0.04** (estimated $0.06) |
| Burn rate | **~$0.01 / month** |
| July 2026 bill | $0.00 across Data Transfer, Glue, S3 |

An initial code-only reading suggested S3 egress was bleeding money. **The bill
disproved it.** S3 is a rounding error.

The real reason to migrate off AWS is **not** current cost — it is that the
credit **expires 2027-01-17**, and the owner wants a stack with no billing
relationship at all rather than revisiting this in six months.

### The actual financial risks are non-AWS

| Risk | Where it bills | Severity |
|---|---|---|
| **Veo video generation** | Google Cloud (invisible in AWS bill) | 🔴 ~$3.20 per 8s clip; a single free user with 10,000 credits could burn **$64** |
| **Modal GPU** (Chatterbox) | modal.com, separate invoice | 🟠 unknown, unverified |

### Pricing reference (verified 2026-07-26)

- **Veo 3:** $0.40/sec. Veo 3 Fast: $0.15/sec. **No free tier on Gemini API.**
- **Gemini 2.5 Flash TTS:** $0.50/M input tokens, **$10.00/M audio output tokens**.
- **Gemini free tier (Flash):** ~15 RPM / 1,500 RPD, **per API key, not per user**.
  TTS may carry a separate, lower quota — verify in Google Cloud console.
- **Cloudflare R2 free tier:** 10 GB storage, **$0 egress at any volume**,
  1M Class A + 10M Class B ops/month. Permanent, not a 12-month trial.

### Unit economics of selling credits (measured — Phase 3, 2026-07-27)

Current pricing: **$4.99 / 40,000 credits**, 1 credit per character (Flash).

Replaced the `~25 tokens/sec` estimate with real `usageMetadata` recorded on
3 production generations (2 single-speaker + 1 dialogue) once
`promptTokens`/`audioTokens` logging shipped:

| Type | Billed chars | Prompt tokens | Audio tokens | Real cost |
|---|---|---|---|---|
| Single-speaker | 309 | 159 | 548 | $0.00556 |
| Single-speaker | 110 | 116 | 161 | $0.00167 |
| Dialogue (2×)  | 113 | 43  | 174 | $0.00176 |

Audio output runs **~1.66 tokens per billed character** — higher than the
`25 tokens/sec` guess implied, but Flash audio tokens are cheap enough that
the margin barely moves:

```
40,000 chars × $0.0000169/char (blended real rate) ≈ $0.68 cost vs $4.99 price
                                                     → ~7.3× margin ✅
```

Single-speaker-only rate (more representative of a Starter pack): **~7.2×
margin**. Both confirm the original ~7× estimate held up — margin is
comfortable, well above the 2× cutoff. Sample size is small (n=3); revisit
once more real generations accumulate, but there's no signal here that
would block enabling purchases on cost grounds alone (Phase 8 hides the
purchase button for a different reason — Vercel Hobby's non-commercial
terms — not unit economics).

---

## 3. Decisions already made — do not relitigate

1. **Delete video generation entirely.** Never deployed to production; the work
   is preserved in git history if ever revived.
2. **Delete Chatterbox + the Modal backend.** Never actually used. **Keep the
   `TTSFactory` / `TTSProvider` abstraction** so new providers can be added later.
3. **Keep the credit system.** It is already a working per-user quota enforcer.
   Repurpose it rather than delete it — deleting means extra work *and* removing
   the only defence against abuse.
4. **Two Google Cloud projects, two API keys** (see Phase 4). This is the owner's
   idea and it is the correct design.
5. **Build the purchase path, leave the button off.** Selling on Vercel Hobby
   violates its non-commercial terms; Vercel Pro is $20/mo. Only flip both on
   when a real paying user appears, so revenue covers the plan.
6. **Keep the Image Studio placeholder page.** It is a static "coming soon" page
   with no API wiring and no cost. Note: `ImageProject` in the schema is unused,
   and Imagen is a paid API — wiring it later reintroduces cost.

---

## 4. Target stack

| Layer | Choice | Status |
|---|---|---|
| Hosting | Vercel Hobby | ✅ already (compliant once nothing is sold) |
| Database | Neon free tier (`eu-central-1`) | ✅ already |
| Object storage | **Cloudflare R2** | 🔧 Phase 7 |
| TTS | Gemini Flash TTS, dual key | 🔧 Phase 4 |
| Video / Veo | **removed** | 🔧 Phase 1 |
| Chatterbox / Modal | **removed** | 🔧 Phase 2 |

---

## Phase 0 — Manual steps (owner, outside the codebase)

Blocks Phase 4. Everything else can proceed in parallel.

- [x] **Create two Google Cloud projects:** done — `FreeAPIKey`/`PaidAPIKey`
      issued and live in Vercel Production.
  - **Project A (free):** **no billing account attached.** This is the hard
    ceiling — with no billing account the project is *physically incapable* of
    generating a charge, regardless of any bug or abuse. Code checks are not a
    substitute for this.
  - **Project B (paid):** billing enabled, **plus a Budget Alert at $10**.
- [x] Issue one Generative Language API key per project.
- [x] Confirm the `vox-ai-studio` S3 bucket actually lives in account
      `836568434462` (it is named `publishvox-dev-account` — verify prod isn't elsewhere).
      Confirmed 2026-07-27 via `sts:GetCallerIdentity` with the app's own IAM user.
- [x] Check why **AWS Glue** shows as an active service; remove it if unused.
      Checked 2026-07-27 in the AWS Console (Databases/Crawlers/Jobs/Connections
      all empty, correct account + `us-east-1` region) — no resources exist,
      nothing to remove. The bill line was just the empty Data Catalog itself.
- [x] Check the **modal.com** invoice, then tear down the Modal app in Phase 2.
      Owner confirms the Modal app was never used in production — considered
      torn down; no invoice to worry about.

---

## Phase 1 — Delete video generation ✅ done

Highest priority: this is the only path to a genuinely large surprise bill.

**Delete:**
```
src/app/(dashboard)/dashboard/studio/video/
src/app/api/studio/video/
src/components/studio/video/
src/server/services/video-generation.service.ts
```

**Edit:**
- `prisma/schema.prisma` — remove `model VideoProject` and `User.videoProjects`.
- `src/config/studio-nav.ts` — remove the `video` entry.
- `src/components/sidebar/sidebar-menu-items.tsx` — remove the `Video` icon import + map entry (lines ~13, ~37).
- `src/i18n/messages/{en,ar}/dashboard.json` — remove the `video` label.
- `src/lib/media-generation/types.ts` — remove video types + `VIDEO_GENERATION_CREDITS`.
  Keep the file only if image types are still referenced; otherwise delete it.

**Migration:** the two untracked migrations
`20260402100645_add_video_image_project` and
`20260402133551_add_resolution_and_reference_images` were **never applied to
production**. Prefer deleting those directories and generating one clean
migration over stacking a drop-migration on top. Verify against the real DB
first: `npx prisma migrate status`.

**Done when:** `npm run typecheck` passes and no `veo`/`Veo`/`videoProject`
reference remains outside git history.

---

## Phase 2 — Delete Chatterbox + Modal ✅ done

**Delete:**
```
src/actions/tts/providers/chatterbox-provider.ts
src/components/studio/tts/engines/chatterbox-settings.tsx
backend/                                   (whole directory — Python + venv)
```

**Keep (this is the point):** `src/actions/tts/tts-factory.ts`, the
`TTSProvider` interface and `base-tts-provider.ts`. Only the Chatterbox
*implementation* goes; the extension point stays.

**Edit:**
- `src/actions/tts/tts-factory.ts` — drop `"chatterbox"` from `TTSProviderType` and the switch.
- `src/components/studio/tts/speech-settings.tsx` (lines ~8, ~63–69) and
  `tts-studio.tsx` (lines ~40, ~111–117) — remove the chatterbox branch.
- `src/lib/credits/calculate.ts` — remove `calcChatterboxCredits`.
- `src/config/credits.ts` — remove the `chatterbox` rate.
- `prisma/schema.prisma` — `AudioProject.exaggeration` / `cfgWeight` become dead. Removing them needs a migration; **or** leave them (they are nullable and harmless). Decide at execution time.
- `src/env.js` — remove `MODAL_API_URL` / `MODAL_API_KEY` / `MODAL_API_SECRET` from both `server` and `runtimeEnv`; also remove from `.env` and `.env.example`.
- Also evaluate `src/actions/tts/providers/google-cloud-provider.ts` — check whether it is reachable from the UI; if dead, remove it too.

**Then:** tear down the Modal app so it stops accruing charges.

**Bonus:** `backend/chatterbox-tts/tts.py:41` mounted the S3 bucket directly via
`modal.CloudBucketMount`. Deleting it removes the only non-TypeScript S3
touchpoint, which makes Phase 7 substantially simpler.

---

## Phase 3 — Measure real TTS cost ✅ done

Gate for ever enabling purchases. Small and self-contained.

- In `src/actions/tts/providers/gemini-provider.ts`, log the `usageMetadata`
  returned with each Gemini response (prompt tokens, candidate/audio tokens, total).
- Generate 3–5 samples of varying length; record characters in → audio tokens out.
- Compute real cost per 1,000 characters and write it back into this file,
  replacing the `~25 tokens/sec` estimate in §2.
- **If margin < 2×, the purchase path stays permanently off** and the product is
  free-only. Re-price only if margin is comfortable.

---

## Phase 4 — Dual API key + daily credit refill ✅ done

The core of the new model. **Blocked by Phase 0.**

### Behaviour

| User state | API key used | Effect on exhaustion |
|---|---|---|
| Never purchased | **Project A (free)** | daily allowance refills next day |
| Has purchased credits | **Project B (paid)** | falls back to free key when purchased credits hit 0 |

Nothing is locked. Every feature stays open to everyone; the only difference is
which key serves the request.

### Schema change (`prisma/schema.prisma`, `User`)

```prisma
freeCredits        Int      @default(500)   // daily allowance, auto-refilled
freeCreditsRefreshedAt DateTime @default(now())
purchasedCredits   Int      @default(0)     // only ever set by a Polar purchase
```

The existing `credits Int @default(10000)` field must be migrated. Simplest
path: backfill `purchasedCredits = 0`, `freeCredits = 500` for all existing
users (none of them paid), then drop `credits`. Confirm against production data
before dropping.

### Env (`src/env.js` + `.env` + `.env.example`)

Replace the single `GenerativeLanguageAPIKey` with:
```
GEMINI_API_KEY_FREE=   # Project A — no billing account attached
GEMINI_API_KEY_PAID=   # Project B — billing enabled, $10 budget alert
```

### Selection logic

Add a helper (suggested: `src/lib/credits/select-key.ts`):

1. Load the user; if `freeCreditsRefreshedAt` is before today (UTC), reset
   `freeCredits` to the daily allowance and stamp the refresh time.
2. If `purchasedCredits >= cost` → return the **paid** key, decrement `purchasedCredits`.
3. Else if `freeCredits >= cost` → return the **free** key, decrement `freeCredits`.
4. Else → return a typed `QUOTA_EXCEEDED` result.

Wire it into `src/actions/tts.ts` (`generateSpeech`) and
`src/actions/tts/dialogue.ts`. **Choose the key before the request; never switch
mid-request.**

### Implementation notes

- A user who exhausts purchased credits returns to the **shared** free quota —
  the daily cap must apply to them too, or they can starve free users.
- Gemini free-tier limits are **per key**, so all free users share one bucket.
  Surface a human message ("daily limit reached, try again tomorrow"), never a
  raw provider error — this is what protects the evaluator's impression.
- `src/actions/tts.ts` already has `isTrialExpired` / `isOnFreeTrial` helpers and
  `trialExpiresAt` on `User`. With the everyone-is-free model these become
  redundant — remove or repurpose deliberately, don't leave them half-wired.

---

## Phase 5 — Local MP3 samples ✅ done (2026-07-27)

Now a **performance and resilience** change, not a cost saving (the S3 bill is
$0.00). It guarantees the landing page works with zero API quota — the design
rule from §1.

Done: fetched all 41 `.wav` samples directly from the public S3 URLs (`Public/`
= 11, `Gemini/` = 30), converted to mono 96kbps MP3 in-process (pure-JS
encoder, no ffmpeg install needed — 8.10MB → 2.05MB), placed under
`public/samples/voices/{Public,Gemini}/`, and repointed both
`demo-section.tsx` and `GeminiOptions.ts` to root-relative `/samples/voices/...`
paths with `.mp3` extensions. `public/` is now ~5.4MB total.

---

## Phase 6 — File retention: delete after 7 days 🟢

Applies to **all** users. Rationale: the business model is prepaid credits, not
subscription — the credit is the product, the file is just its output.

- Add `expiresAt DateTime?` to `AudioProject`, set to `now() + 7 days` on create.
- Implement the real delete path — `src/actions/voice-upload/storage/aws-storage-provider.ts:112`
  is currently `throw new Error("Method not implemented.")`, which is why nothing
  has ever been cleaned up.
- Add a Vercel Cron (free tier) hitting a protected route that deletes expired
  objects from storage and marks the rows expired (keep rows for history).
- Surface it in the UI: "download within 7 days".

Do this **after** Phase 7 so the delete logic is written against R2 directly.

---

## Phase 7 — Migrate storage to Cloudflare R2 🟢

Last, and easy — R2 is S3-API-compatible, so the existing `@aws-sdk/client-s3`
code stays. It is an **endpoint + credentials change**, not a rewrite.

**Touchpoints remaining after Phases 1–2** (video and Modal already removed):

| File | Purpose |
|---|---|
| `src/actions/tts/providers/s3-upload-helper.ts` | generated audio upload |
| `src/actions/voice-upload/storage/aws-storage-provider.ts` | user voice uploads + `deleteFile` |
| `src/actions/tts/providers/base-tts-provider.ts:1` | hardcoded `S3_BUCKET_URL` |

**Client change:**
```ts
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});
```

**Also:**
- Rename the provider class/file away from `AWS*` once AWS is gone.
- Swap the `AWS_*` vars for `R2_*` in `src/env.js`, `.env`, `.env.example`.
- Replace the hardcoded `S3_BUCKET_URL` with the R2 public bucket URL (or a
  custom domain) via env rather than a literal.
- Existing S3 objects: with 7-day retention there is nothing worth migrating —
  let them age out, then empty and delete the bucket.

**Capacity check:** MP3 output ~1.4 MB per 3-minute generation. 10 GB free ÷
1.4 MB × (7-day window) ≈ **~1,000 generations/day sustained at $0**. Far beyond
current traffic.

---

## Phase 8 — Portfolio polish ⚪

- ~~Hide the pricing page and Polar checkout button.~~ **Decided 2026-07-27:
  owner wants the buy button to stay live**, accepting the Vercel Hobby
  non-commercial ToS risk this carries rather than upgrading to Pro ($20/mo)
  or hiding it. Revisit if Vercel flags the account.
- ~~Add an architecture / case-study page~~ — **declined 2026-07-27**, not doing
  this.

---

## Execution order

```
Phase 0  (owner, manual)  ──────┐
Phase 1  delete video     🔴    │ independent
Phase 2  delete chatterbox 🔴   │ independent
Phase 3  measure cost     🟠    │ independent
Phase 4  dual key         🟠  ←─┘ needs Phase 0 + 3
Phase 5  local MP3        🟢    independent
Phase 6  7-day retention  🟢    after Phase 7
Phase 7  R2 migration     🟢    after Phase 2
Phase 8  polish           ⚪    last
```

**Recommended first session:** Phases 1 + 2. Both are pure deletion, they shrink
the surface area a lot, and they unblock Phase 7.

---

## Definition of done

- [ ] No code path can reach Veo or any video API.
- [ ] Modal app torn down; `backend/` gone; no Modal env vars.
- [ ] Google Project A confirmed to have **no billing account**.
- [ ] Landing page and demo work with the API key removed entirely.
- [ ] Every user has an enforced daily cap; quota exhaustion shows a friendly message.
- [ ] Storage is R2; the AWS bucket is empty and deleted; no `AWS_*` vars remain.
- [ ] Files older than 7 days are actually deleted (verified, not just scheduled).
- [ ] `npm run typecheck` and `npm run lint` pass.
- [ ] Real measured TTS cost recorded in §2, replacing the estimate.

---

## Open questions

1. Is `google-cloud-provider.ts` live or dead code? (affects Phase 2 scope)
2. Exact TTS free-tier quota — general Flash limits (15 RPM / 1,500 RPD) may not
   apply to TTS. Confirm in the Google Cloud console.
3. What daily free allowance? `500` above is a placeholder — set it from the
   measured quota in Phase 3 divided by expected daily active users.
4. Drop `AudioProject.exaggeration` / `cfgWeight`, or leave them as harmless
   nullable columns?
