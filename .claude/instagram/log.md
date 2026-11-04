# Post log (@intern.hack)

Read by `/ig-audit` and `/ig-plan`; updated by `/daily-reels` §0 (stats) and §7 (posting).
Hook formula = the id from `.claude/skills/ig-reel/hooks.json`, judged by hand for Hinglish hooks (the
matcher regexes are English). Full records: `series/log/topics.jsonl`.

| date | slot | reel | hook (first line) | formula | length | IG views | IG likes | IG comments* | stats at |
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-30 | C news | Binance $6.3B hack | एक laptop... और Binance से छह अरब डॉलर गायब | 23 Statistic | 78s | 180 | 7 | 0 | 2026-11-02 |
| 2026-10-31 | C news | Anthropic IPO loss | 6 महीने में 80 billion dollar का नुकसान… फिर भी IPO | 23 Statistic | 60s | 162 | 5 | 0 | 2026-11-02 |
| 2026-10-31 | A sysdesign 1 | UPI at a chai stall | Chai waale ko tumne dus rupaye bheje. Aur nahi, PhonePe ne nahi bheje. | 22 Contrarian Flip | 86s | 132 | 6 | 0 | 2026-11-02 |
| 2026-10-31 | B interview 1 | Rate limiter (IRCTC Tatkal) | Tatkal, subah dus baje. Pehle paanch minute mein aadhe login bots ke hote hain. | 23 Statistic | 83s | 164 | 4 | 0 | 2026-11-02 |
| 2026-10-31 | C ai-tool 1 | DeepTutor | Kal DBMS ka exam hai, aur notes tees page ke. | 10 If This, Then Watch | 60s | 332 | 11 | 0 | 2026-11-02 |
| 2026-11-01 | A sysdesign 2 | FASTag toll | Barrier khul gaya. Par bank ne abhi tak ek rupaya nahi kaata. | 21 Mid-Sentence Start | 75s  | 1,490 (2d) | 25 | 0 | 2026-11-03 |
| 2026-11-01 | B interview 2 | Idempotency (double charge) | Button disable kar diya, phir bhi customer ka paisa do baar kata. | 12 The Objection | 84s  | 1,202 (2d) | 17 | 0 | 2026-11-03 |
| 2026-11-01 | C myth 1 | Incognito myth | Incognito sirf ek insaan se hide karta hai. Aur woh tumhara ISP nahi hai. | 22 Contrarian Flip | 63s  | 1,227 (3d) | 21 | 4 | 2026-11-04 |
| 2026-11-02 | A sysdesign 3 | OTP late | OTP 3 minute valid tha. Aaya 10 minute baad. Kahan tha? | 21 Mid-Sentence Start | 79s  | 1,580 (2d) | 23 | 0 | 2026-11-04 |
| 2026-11-02 | C news 2 | CNAP caller name | 1 November se tumhara naam har stranger ke phone pe. Bina pooche. | 19 The Deadline | 77s  | 1,731 (2d) | 19 | 2 | 2026-11-04 |
| 2026-11-02 | B interview 3 | Cache invalidation | Tumne ₹999 dekh ke kharida. Kata ₹1,499. Galti kiski? | 1 Cost Confession | 89s  | 1,162 (2d) | 12 | 0 | 2026-11-04 |
| 2026-11-03 | A sysdesign 4 | ATM cash not dispensed | ATM ne note nahi diya. ₹10,000 kate. Bank ko dene pade ₹3.28 lakh. | 1 Cost Confession | 77s  | 1,518 (1d) | 28 | 0 | 2026-11-04 |
| 2026-11-03 | C news 3 | NavIC NVS-03 | India ka apna GPS saat mahine se adhoora tha. Satellite toote nahi the. | 22 Contrarian Flip | 87s  | 162 (1d) | 3 | 0 | 2026-11-04 |
| 2026-11-03 | B interview 4 | DB index (result day) | Roll number daala. 30 second loading. Index tha. Kyun? | 21 Mid-Sentence Start | 84s  | 274 (19h) | 5 | 0 | 2026-11-04 |
| 2026-11-04 | A sysdesign 5 | WhatsApp ticks | Ek tick. Do ghante se. Pakka block kiya. | 21 Mid-Sentence Start | 78s | 229 (5h) | 3 | 0 | 2026-11-04 |
| 2026-11-04 | C tool 2 | Floci (local AWS) | College project ke liye AWS. Bill aaya ₹23,000. Yeh koi nahi batata. | 3 Nobody Tells You | 79s | 121 (1h) | 2 | 0 | 2026-11-04 |
| 2026-11-04 | B interview 5 | Load balancer (sale cart) | Priya, sale baarah baje. Refresh kiya, cart gayab. Kyun? | 21 Mid-Sentence Start | 81s | scheduled 7:00 PM | | | |

\* comments from people other than the account. Reach, saves, shares and follows (from web insights, which load as of 2026-11-02) are in `series/log/topics.jsonl` as `ig_*`. Web insights show no watch time. YouTube numbers start with the next §0 run.

Notes so far (n = 7, too few for a pattern): the two Nov 1 reels opened on the viewer's own money being
taken or not taken and got 5-10x the others; news about other companies' money stalled near 160.

2026-11-02 read (n = 11): every reel since Nov 1 lands at 1.2-1.6k views with 98-99% non-followers, so the
account is now being shown to strangers; the old ~160 floor is gone. Follows are the problem: 2 follows from
~6,700 views across the six Nov 1-2 reels. Incognito (myth, humour, one-word confession driver) has the best
saves + shares per reach (12 / 1,043); CNAP's 3-way "Papa / Mummy / Khud" question is the only driver that
pulled real comments. YouTube Shorts are near zero (OTP 39 views best).

2026-11-03 read (n = 9 recent, median ~1,350 for reels older than 10h): ATM (money taken, Cost Confession hook)
is on track to top the set at 1,494 in 11h with the best likes (28) and 6 saves. NavIC is the outlier the other way:
158 views in 7h and 19.7% of views from followers, so Instagram never pushed it to strangers. Same pattern as Binance
and Anthropic (~160): news about an institution, with no "tumhara" stake, doesn't get tested on non-followers; CNAP
(news about *your* name) did 1.7k. Follows are still the problem: 2 follows and 2 profile visits from ~11k views, 0
on every reel since Nov 2. Saves + shares per reach: incognito 1.1%, idempotency 0.6%, ATM 0.5%, OTP 0.4%, the rest
0.2-0.3%. Real comments only on the two reels with a one-tap answer (incognito emoji confession, CNAP 3-way).
YouTube: FASTag 656 views (question title people search: "FASTag toll pe gaadi rukti kyon nahi?"), OTP 83 (57% stayed,
43s average of 80s), incognito 56, ATM 35; interview Shorts 0-4, CNAP 1. YouTube rewards searchable "kyon/kaise"
titles; Instagram rewards personal stake. YouTube retention is only processed for OTP so far.


2026-11-04 read (n = 9 recent): **the last 4 reels stalled.** NavIC 162 (1d), DB index 274 (19h), WhatsApp 229 (5h),
Floci 121 (1h), against 1.16-1.73k at the same age for every reel from Nov 1 to ATM (Nov 3, 9 AM). They are still shown
~96% to non-followers (NavIC 20%), so Instagram tests them on strangers and stops expanding: early hold is the likely
cause, but web insights give no watch time, so it is not proven. What changed from Nov 3 1 PM: NavIC (institution news,
too many objects), then the Nov 4 reels built on the slower pace (1.0-1.1) and the junior-style single-analogy story.
WhatsApp and Floci are too young to judge; re-read them in the next run before drawing a rule. Follows: 1 (DB index)
from ~8k views across the 9; 25 followers total. Saves + shares per reach still led by incognito (12 / 1,053). Real
comments only on incognito (4 emoji) and CNAP. YouTube: ATM 88, WhatsApp 14, everything else 0-4 on the new Shorts;
FASTag (search-style title) still the only real YouTube reach at 697. Today's variable: narrator voice changed to
Sarvam `sunny_hi_reels` (reels persona) from `mohit_hi_conversational`.
