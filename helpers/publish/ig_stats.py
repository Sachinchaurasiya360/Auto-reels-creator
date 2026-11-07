"""Read the reel page + web insights for the N newest reels on @intern.hack (personal profile, through cdpd).
    python helpers/publish/ig_stats.py <ig_tab> <code> [<code> ...] > stats.json
Codes come from the reels grid (a[href*="/reel/"]). Prints one JSON object per reel.
"""
import json, re, sys, time
import h

def page(code):
    h.goto(f"https://www.instagram.com/intern.hack/reel/{code}/", wait=6)
    return h.ev("""(()=>{const m=document.querySelector('article')||document.querySelector('main');
      const t=(m&&m.innerText)||''; const times=[...document.querySelectorAll('time')].map(x=>x.getAttribute('datetime'));
      return {text:t.slice(0,2500), times}})()""")

def insights():
    # a JS click opens /insights/media/<id>/; a CDP mouse click at the element's centre did nothing (2026-11-05)
    ok = h.ev("""(()=>{const e=[...document.querySelectorAll('div')].filter(e=>(e.innerText||'').trim()==='View insights').pop();
      if(!e) return false; e.scrollIntoView({block:'center'}); e.click(); return true})()""")
    if not ok:
        return None
    time.sleep(7)
    t = h.ev("location.href.includes('/insights/') ? document.body.innerText.slice(0,2500) : null")
    return t

def parse(ins):
    """Insights text -> numbers (web insights have no watch time or skip rate)."""
    if not ins: return {}
    lines = [l.strip() for l in ins.split("\n") if l.strip()]
    def after(label, nth=0):
        idx = [i for i, l in enumerate(lines) if l == label]
        if len(idx) <= nth: return None
        v = lines[idx[nth] + 1].replace(",", "").replace("%", "")
        try: return float(v) if "." in v else int(v)
        except ValueError: return None
    return {"views": after("Views", 1), "followers_view_pct": after("Followers", 0), "reach": after("Viewers"),
            "likes": after("Likes"), "comments": after("Comments"), "saves": after("Saves"), "shares": after("Shares"),
            "profile_activity": after("Profile activity"), "follows": after("Follows")}

def num(pat, s):
    m = re.search(pat, s or "", re.S)
    return m.group(1).replace(",", "") if m else None

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    h.TAB = sys.argv[1]
    out = []
    for code in sys.argv[2:]:
        p = page(code)
        ins = insights()
        out.append({"code": code, "posted": (p.get("times") or [None])[0] if isinstance(p, dict) else None,
                    "first_line": next((l for l in (p.get("text") or "").split("\n") if len(l) > 25), None) if isinstance(p, dict) else None,
                    **parse(ins)})
        print(f"done {code}", file=sys.stderr, flush=True)
    print(json.dumps(out, ensure_ascii=False, indent=1))
