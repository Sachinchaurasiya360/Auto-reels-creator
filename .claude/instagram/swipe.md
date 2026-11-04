# Swipe file (@intern.hack niche: Indian tech / placement prep, Hindi-Hinglish)

Built 2026-11-03 by `/ig-viral`. Refresh when older than 7 days.

**Corpus and confidence:** YouTube Shorts (public counts and auto-captions, no login), the last 30 Shorts of 9
Indian tech-education channels (CodeWithHarry, Apna College, takeUforward, Coder Army, Chai aur Code, Keerti
Purswani, Piyush Garg, Sheryians, Tech Burner). 230 Shorts ranked; spoken hooks read for the top 13 outliers and
a few low ones. These channels are 100x+ our size, so read this as **format evidence only**, not cadence. All 14
hooks were "unclassified" by `swipe.py` (its matcher is English), so the formulas below are judged by hand.
Small sample: it suggests, it doesn't prove. No Instagram corpus yet (no competitor list).

## Outliers (views / that channel's median of its last 30)

| x | account | views | spoken first line (first ~3s) | shape |
|---|---|---|---|---|
| 46.4 | @chaiaurcode | 1.3M | "Haan ji. Agar reel scroll karte-karte yahan tak pahunch hi gaye ho, toh aapko..." | channel news, talks to the scroller (skip as format: brand moment) |
| 16.0 | @sheryians | 1.2M | "Bhai tumhare main folder ke andar final folder hai jiske andar ek aur folder..." | skit, character line mid-scene ("When you hire a free intern") |
| 12.1 | @ApnaCollegeOfficial | 2.3M | (vlog: AI summit, Bharat Mandapam) | event vlog |
| 8.7 | @sheryians | 652k | "Bhai code run karne se pehle ek baar compile karke dekhne do kitne error aa rahe hain." | skit, "X by language" personification |
| 6.0 | @sheryians | 449k | "Bhai dekho mujhe ghanta kuch nahi aata hai. Toh tum log project banao aur..." | skit, "final year project group be like" |
| 5.6 | @piyushgargdev | 160k | "Bahut hi important line hai yeh, dobara padho." | command + one idea (Hyrum's law) |
| 5.5 | @sheryians | 414k | "Guys, hamari company band hone wali hai. Kyun sir? Kyunki hamare code..." | skit, shock line then "kyun?" |
| 5.0 | @sheryians | 379k | "Amazing work on fixing the bug. Kaise kara? Sir, I actually spent the..." | skit, office dialogue |
| 4.5 | @ApnaCollegeOfficial | 852k | "The package of Blinkit is great. You have a 50+ LPA..." | real interview experience, salary number |
| 4.3 | @piyushgargdev | 123k | "Unka server ka access chala gaya. Matlab SSH nahi..." | dev news as a story that happened to someone |
| 4.1 | @CoderArmy9 | 78k | "Aap mein se maximum log goal-less life jee rahe ho..." | calls out the viewer |

Low (0.2x): @KeertiPurswani "Data engineering mein har koi kyun Parquet files..." (a topic question, no person, no stake).

## What over-indexes (by hand)

1. **Two-person skits that open mid-scene on a character's line** (6 of the top 11, all Sheryians, 4.3-16x).
   The first line is something a senior / teammate / boss says, it's funny, and the tech point rides inside it.
   It's the format our Mock Interview already has (Arjun + Priya); ours just open on a topic, not a character line.
2. **Shock statement, then "kyun?"** ("company band hone wali hai. Kyun sir?"): a two-voice open loop.
3. **Something happened to a real person** (server access gone, a Blinkit offer): a story with a victim beats a
   topic question. Matches our own data (ATM, OTP, CNAP = "tumhara" stake; NavIC/Binance = institution).
4. Bottom: a topic asked as a question with nobody in it.

## Our version (hand these to /ig-reel)

- Skit open, Mock Interview: **Arjun:** "Priya, sale raat baarah baje khuli, aur tumhara ek server chai pe chala gaya." (load balancer)
- Shock + kyun, system design: "Usne tumhara message padh liya. Blue tick nahi aaya. Kyun?" (WhatsApp ticks)
- Real victim, tool: "College project ke liye AWS account banaya. Bill aaya ₹23,000." (local AWS emulator)
