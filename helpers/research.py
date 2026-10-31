"""What people say about a topic: Reddit, Hacker News, GitHub. Output is markdown for research.md.

Sources: Reddit's official API (free "script" app: REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET in .env;
without them it prints site:reddit.com queries for web search), the HN Algolia API, GitHub's trending
page and the `gh` CLI. X/Twitter has no free read access, so `x` prints site:x.com queries instead.

Usage:
    python helpers/research.py reddit "upi payment how it works" [--subs developersIndia,india] [--limit 6] [--comments 4]
    python helpers/research.py hn "rate limiter" [--limit 8]
    python helpers/research.py github trending [--since daily|weekly] [--lang python]
    python helpers/research.py github search "remotion components" [--limit 10]
    python helpers/research.py x "irctc tatkal"
    python helpers/research.py all "irctc tatkal booking" -o reels/<dir>/voices.md

Read what comes back, then open the threads that matter: the most upvoted confusion or wrong
belief is usually the hook, and the most argued point is usually the comment driver.
"""

import argparse
import html
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
UA ="internhack-reel-research/1.0 (personal research script)"
INDIA_TECH_SUBS = ["developersIndia", "india", "IndiaTech", "indianstartups", "cscareerquestionsIN", "systemdesign"]


def get(url: str, as_json: bool = True, token: str | None = None):
    headers = {"User-Agent": UA, "Accept": "application/json, text/html"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                body = r.read().decode("utf-8", "replace")
                return json.loads(body) if as_json else body
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                time.sleep(4 * (attempt + 1))
                continue
            raise
    raise RuntimeError(f"failed: {url}")


def clip(text: str, n: int) -> str:
    text = re.sub(r"\s+", " ", html.unescape(text or "")).strip()
    return text if len(text) <= n else text[: n - 1].rstrip() + "…"


def env(name: str) -> str | None:
    import os
    if os.environ.get(name):
        return os.environ[name]
    path = REPO / ".env"
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            m = re.match(r"\s*([A-Za-z0-9_]+)\s*=\s*(.+?)\s*$", line)
            if m and m.group(1).upper() == name:
                return m.group(2).strip("\"'")
    return None


def reddit_token() -> str | None:
    """App-only OAuth token for Reddit's official API (a free "script" app at reddit.com/prefs/apps)."""
    cid, secret = env("REDDIT_CLIENT_ID"), env("REDDIT_CLIENT_SECRET")
    if not (cid and secret):
        return None
    import base64
    req = urllib.request.Request(
        "https://www.reddit.com/api/v1/access_token",
        data=b"grant_type=client_credentials",
        headers={"User-Agent": UA, "Authorization": "Basic " + base64.b64encode(f"{cid}:{secret}".encode()).decode()},
    )
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read())["access_token"]


def reddit_queries(query: str, subs: list[str]) -> str:
    qs = [f"site:reddit.com/r/{s} {query}" for s in subs[:4]] + [f"site:reddit.com {query}"]
    return (f"### Reddit: \"{query}\" (no REDDIT_CLIENT_ID/SECRET in .env: run these through web search)\n\n"
            + "\n".join(f"- `{q}`" for q in qs) + "\n")


def reddit(query: str, subs: list[str], limit: int, comments: int) -> str:
    token = reddit_token()
    if not token:
        return reddit_queries(query, subs)
    api = lambda path: get("https://oauth.reddit.com" + path, token=token)  # noqa: E731
    q = urllib.parse.quote(query)
    restrict = "+".join(subs)
    posts = [c["data"] for c in api(f"/r/{restrict}/search?q={q}&restrict_sr=1&sort=relevance&t=all&limit={limit}")["data"]["children"]]
    if not posts:
        posts = [c["data"] for c in api(f"/search?q={q}&sort=relevance&t=year&limit={limit}")["data"]["children"]]
    out = [f"### Reddit: \"{query}\" (r/{restrict})", ""]
    for p in posts:
        link = "https://www.reddit.com" + p["permalink"]
        out.append(f"- **{clip(p['title'], 140)}** · r/{p['subreddit']} · ↑{p['score']} · {p['num_comments']} comments · {link}")
        if p.get("selftext"):
            out.append(f"  - post: {clip(p['selftext'], 280)}")
        if comments:
            try:
                thread = api(p["permalink"].rstrip("/") + f"?limit={comments}&sort=top")
                for c in thread[1]["data"]["children"][:comments]:
                    d = c.get("data", {})
                    if d.get("body"):
                        out.append(f"  - ↑{d.get('score', 0)}: {clip(d['body'], 240)}")
                time.sleep(1.2)  # stay well inside Reddit's anonymous rate limit
            except Exception as e:  # one broken thread shouldn't sink the run
                out.append(f"  - (comments unavailable: {e})")
    return "\n".join(out) + "\n"


def hn(query: str, limit: int) -> str:
    q = urllib.parse.quote(query)
    hits = get(f"https://hn.algolia.com/api/v1/search?query={q}&tags=story&hitsPerPage={limit}")["hits"]
    out = [f"### Hacker News: \"{query}\"", ""]
    for h in hits:
        link = f"https://news.ycombinator.com/item?id={h['objectID']}"
        out.append(f"- **{clip(h['title'], 140)}** · {h.get('points', 0)} pts · {h.get('num_comments', 0)} comments · "
                   f"{h['created_at'][:10]} · {link}" + (f" · {h['url']}" if h.get("url") else ""))
    return "\n".join(out) + "\n"


def github_trending(since: str, lang: str | None) -> str:
    url = f"https://github.com/trending{'/' + urllib.parse.quote(lang) if lang else ''}?since={since}"
    page = get(url, as_json=False)
    out = [f"### GitHub trending ({since}{', ' + lang if lang else ''})", ""]
    for art in re.findall(r"<article class=\"Box-row\">(.*?)</article>", page, re.S)[:25]:
        name = re.search(r'<h2[^>]*>\s*<a[^>]*href="/([^"]+)"', art, re.S)
        desc = re.search(r'<p class="col-9[^"]*">(.*?)</p>', art, re.S)
        today = re.search(r"([\d,]+) stars (today|this week|this month)", art)
        stars = re.search(r'href="/[^"]+/stargazers"[^>]*>\s*(?:<svg.*?</svg>)?\s*([\d,]+)', art, re.S)
        if name:
            out.append(f"- **{name.group(1)}** · ★{stars.group(1) if stars else '?'}"
                       f"{' (+' + today.group(1) + ' ' + today.group(2) + ')' if today else ''} · "
                       f"{clip(re.sub('<[^>]+>', '', desc.group(1)) if desc else '', 160)} · https://github.com/{name.group(1)}")
    return "\n".join(out) + "\n"


def github_search(query: str, limit: int) -> str:
    raw = subprocess.run(
        ["gh", "search", "repos", query, "--sort", "stars", "--limit", str(limit),
         "--json", "fullName,stargazersCount,license,description,updatedAt"],
        capture_output=True, text=True, encoding="utf-8", check=True,
    ).stdout
    out = [f"### GitHub search: \"{query}\"", ""]
    for r in json.loads(raw):
        lic = (r.get("license") or {}).get("key") or "no licence"
        out.append(f"- **{r['fullName']}** · ★{r['stargazersCount']} · {lic} · updated {r['updatedAt'][:10]} · "
                   f"{clip(r.get('description') or '', 140)} · https://github.com/{r['fullName']}")
    return "\n".join(out) + "\n"


def x_queries(query: str) -> str:
    qs = [f"site:x.com {query}", f"site:x.com {query} thread", f"site:x.com {query} explained",
          f"site:x.com {query} india"]
    return "### X (run through web search, read what loads, credit the handle)\n\n" + "\n".join(f"- `{q}`" for q in qs) + "\n"


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("reddit")
    r.add_argument("query")
    r.add_argument("--subs", default=",".join(INDIA_TECH_SUBS))
    r.add_argument("--limit", type=int, default=6)
    r.add_argument("--comments", type=int, default=4)
    h = sub.add_parser("hn")
    h.add_argument("query")
    h.add_argument("--limit", type=int, default=8)
    g = sub.add_parser("github")
    g.add_argument("mode", choices=["trending", "search"])
    g.add_argument("query", nargs="?")
    g.add_argument("--since", default="daily", choices=["daily", "weekly", "monthly"])
    g.add_argument("--lang")
    g.add_argument("--limit", type=int, default=10)
    x = sub.add_parser("x")
    x.add_argument("query")
    a = sub.add_parser("all")
    a.add_argument("query")
    a.add_argument("-o", "--output")
    args = p.parse_args()

    if args.cmd == "reddit":
        text = reddit(args.query, args.subs.split(","), args.limit, args.comments)
    elif args.cmd == "hn":
        text = hn(args.query, args.limit)
    elif args.cmd == "github":
        if args.mode == "search" and not args.query:
            sys.exit("github search needs a query")
        text = github_trending(args.since, args.lang) if args.mode == "trending" else github_search(args.query, args.limit)
    elif args.cmd == "x":
        text = x_queries(args.query)
    else:
        parts = [f"## What people say: {args.query}\n"]
        for name, fn in [("reddit", lambda: reddit(args.query, INDIA_TECH_SUBS, 6, 4)),
                         ("hn", lambda: hn(args.query, 8)), ("x", lambda: x_queries(args.query))]:
            try:
                parts.append(fn())
            except Exception as e:
                parts.append(f"### {name}: failed ({e})\n")
        text = "\n".join(parts)
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"wrote {args.output}")
            return 0
    sys.stdout.reconfigure(encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
