"""Day-wise reel log for the InternHack series: no topic made twice, no concept explained twice.

The log is series/log/topics.jsonl (one JSON record per reel, tracked in git).
series/log/LOG.md is generated from it. The InternHack marketing queue
(../InternHack/marketing/queue/<date>/README.md) is read as well, so this
pipeline never repeats a company or DSA pattern that one already queued.

Usage:
    python helpers/topics.py check "How UPI works at a chai stall" --concepts upi,npci,vpa
    python helpers/topics.py add record.json        (or: add --json '{...}')
    python helpers/topics.py next --slot A          next episode number for a slot
    python helpers/topics.py backlog [--slot B]     ideas not yet made
    python helpers/topics.py log                    rebuild series/log/LOG.md
    python helpers/topics.py today                  which slot C type today is

Record fields (add): date, slot (A|B|C), series, episode, slug, title, concepts [..],
keywords [..], hook, comment_driver, length_s, path; later: views, watch_pct, shares, saves, comments.

check exits 1 when it finds a repeat, so scripts can stop on it.
"""

import argparse
import datetime as dt
import difflib
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LOG = REPO / "series" / "log" / "topics.jsonl"
LOG_MD = REPO / "series" / "log" / "LOG.md"
BACKLOG = REPO / "series" / "backlog.md"
MARKETING_QUEUE = REPO.parent / "InternHack" / "marketing" / "queue"

SLOTS = {"A": "system-design", "B": "mock-interview", "C": "rotating"}
# Slot C by weekday (Mon=0): news, GitHub pick, AI tool, news, GitHub pick, AI tool, myth.
SLOT_C = ["tech-news", "github-pick", "ai-tool", "tech-news", "github-pick", "ai-tool", "myth"]
REQUIRED = ["date", "slot", "series", "episode", "slug", "title", "concepts", "keywords", "hook", "comment_driver"]

STOP = set(
    "a an the of to in on for and or is are how why what when does do kaise kya hai hain ka ki ke ko se mein me "
    "ek aur jab tak bhi toh yeh woh tum your you it its this that with by at from as be".split()
)

# Similarity at or above this is a repeat; between WARN and REPEAT is shown for a human to judge.
REPEAT = 0.72
WARN = 0.5


def load() -> list[dict]:
    if not LOG.exists():
        return []
    return [json.loads(line) for line in LOG.read_text(encoding="utf-8").splitlines() if line.strip()]


def words(text: str) -> set[str]:
    return {w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOP and len(w) > 1}


def norm(concept: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", concept.lower()).strip("-")


def similarity(a: str, b: str) -> float:
    wa, wb = words(a), words(b)
    overlap = len(wa & wb) / max(1, min(len(wa), len(wb)))
    ratio = difflib.SequenceMatcher(None, " ".join(sorted(wa)), " ".join(sorted(wb))).ratio()
    return max(overlap, ratio)


def marketing_records() -> list[dict]:
    """Company and DSA-pattern reels the InternHack marketing script has queued."""
    out = []
    if not MARKETING_QUEUE.exists():
        return out
    for readme in sorted(MARKETING_QUEUE.glob("*/README.md")):
        m = re.search(r"Company:\s*(.+?)\s*·\s*Pattern:\s*(.+?)\s*(·|$)", readme.read_text(encoding="utf-8"), re.M)
        if not m:
            continue
        date = readme.parent.name
        company, pattern = m.group(1).strip(), m.group(2).strip()
        out.append({"date": date, "slot": "M", "series": "marketing", "title": f"{company} interview questions",
                    "concepts": [norm(company) + "-questions"], "keywords": [company.lower()]})
        out.append({"date": date, "slot": "M", "series": "marketing", "title": f"{pattern} pattern",
                    "concepts": [norm(pattern)], "keywords": words(pattern)})
    return out


def cmd_check(args) -> int:
    concepts = {norm(c) for c in (args.concepts or "").split(",") if c.strip()}
    records = load() + marketing_records()
    hits = []
    for r in records:
        score = similarity(args.topic, r["title"] + " " + " ".join(r.get("keywords", [])))
        shared = concepts & {norm(c) for c in r.get("concepts", [])}
        if score >= WARN or shared:
            hits.append((score, shared, r))
    hits.sort(key=lambda h: (-len(h[1]), -h[0]))
    repeat = any(score >= REPEAT for score, _, _ in hits)
    concept_repeat = [h for h in hits if h[1]]
    for score, shared, r in hits[:10]:
        tag = "REPEAT " if score >= REPEAT else ("CONCEPT" if shared else "similar")
        extra = f"  shared concepts: {', '.join(sorted(shared))}" if shared else ""
        print(f"{tag}  {score:.2f}  {r['date']}  [{r['slot']}] {r['title']}{extra}")
    if repeat:
        print("\nblocked: this topic was already made. Pick a different topic or a clearly new angle.")
        return 1
    if concept_repeat:
        print("\nwarning: these concepts were already explained. Allowed only if this reel's main subject is different;"
              " still explain them fully (every reel stands alone).")
    if not hits:
        print("clear: nothing similar in the log.")
    return 0


def cmd_add(args) -> int:
    rec = json.loads(args.json) if args.json else json.loads(Path(args.file).read_text(encoding="utf-8"))
    missing = [k for k in REQUIRED if k not in rec]
    if missing:
        sys.exit(f"missing fields: {', '.join(missing)}")
    rec["concepts"] = [norm(c) for c in rec["concepts"]]
    existing = load()
    if any(r["slug"] == rec["slug"] for r in existing):
        sys.exit(f"slug already logged: {rec['slug']}")
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    write_log_md(existing + [rec])
    print(f"logged {rec['date']} [{rec['slot']}] {rec['title']}")
    return 0


def cmd_next(args) -> int:
    eps = [r.get("episode") or 0 for r in load() if r["slot"] == args.slot]
    print(max(eps, default=0) + 1)
    return 0


def cmd_backlog(args) -> int:
    if not BACKLOG.exists():
        sys.exit(f"no backlog at {BACKLOG}")
    done = [r["title"] for r in load()]
    section = None
    for line in BACKLOG.read_text(encoding="utf-8").splitlines():
        m = re.match(r"##\s+Slot\s+([ABC])", line)
        if m:
            section = m.group(1)
            continue
        item = re.match(r"\s*[-*\d.]+\s+(.*)", line)
        if not item or (args.slot and section != args.slot):
            continue
        made = any(similarity(item.group(1), t) >= REPEAT for t in done)
        print(f"{'done ' if made else '     '}[{section}] {item.group(1)}")
    return 0


def cmd_today(_args) -> int:
    today = dt.date.today()
    print(f"{today} ({today.strftime('%A')}): slot A system-design, slot B mock-interview, slot C {SLOT_C[today.weekday()]}")
    return 0


def write_log_md(records: list[dict]) -> None:
    lines = ["# Reel log", "", "Generated by `helpers/topics.py` from `topics.jsonl`. Do not edit by hand.", ""]
    by_date: dict[str, list[dict]] = {}
    for r in records:
        by_date.setdefault(r["date"], []).append(r)
    for date in sorted(by_date, reverse=True):
        lines.append(f"## {date}")
        for r in sorted(by_date[date], key=lambda r: r["slot"]):
            ep = f" #{r['episode']}" if r.get("episode") else ""
            stats = ", ".join(f"{k} {r[k]}" for k in ("views", "watch_pct", "shares", "saves", "comments") if k in r)
            lines.append(f"- [{r['slot']}] {r['series']}{ep}: **{r['title']}** ({r.get('length_s', '?')}s)")
            lines.append(f"  - hook: {r['hook']}")
            lines.append(f"  - concepts: {', '.join(r['concepts'])} · comment driver: {r['comment_driver']}")
            if stats:
                lines.append(f"  - {stats}")
            if r.get("quality"):
                lines.append(f"  - quality: {r['quality']}")
        lines.append("")
    LOG_MD.write_text("\n".join(lines), encoding="utf-8")


def cmd_log(_args) -> int:
    write_log_md(load())
    print(f"wrote {LOG_MD}")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("check")
    c.add_argument("topic")
    c.add_argument("--concepts", help="comma-separated concept ids, e.g. upi,npci,rate-limiting")
    a = sub.add_parser("add")
    a.add_argument("file", nargs="?")
    a.add_argument("--json")
    n = sub.add_parser("next")
    n.add_argument("--slot", required=True, choices=list(SLOTS))
    b = sub.add_parser("backlog")
    b.add_argument("--slot", choices=list(SLOTS))
    sub.add_parser("log")
    sub.add_parser("today")
    args = p.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")  # titles carry ₹ and Devanagari; Windows consoles default to cp1252
    return {"check": cmd_check, "add": cmd_add, "next": cmd_next, "backlog": cmd_backlog,
            "log": cmd_log, "today": cmd_today}[args.cmd](args)


if __name__ == "__main__":
    sys.exit(main())
