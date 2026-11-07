"""Post the "Pinned comment" section of a reel's post.md under its live Instagram reel (personal profile, via cdpd).
    python helpers/publish/ig_comment.py <ig_tab> <reel code> <reel dir name>
Instagram web cannot pin: pin it afterwards in the phone app. Skips if a comment with the notes link is already there.
"""
import json, re, sys, time
import h

def pinned_text(reel_dir):
    md = open(f"reels/{reel_dir}/post.md", encoding="utf-8").read()
    m = re.search(r"^#+ Pinned comment[^\n]*\n(.*?)(?=^#+ |\Z)", md, re.S | re.M)
    return m.group(1).strip()

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    h.TAB, code, reel_dir = sys.argv[1:4]
    text = pinned_text(reel_dir)
    h.goto(f"https://www.instagram.com/intern.hack/reel/{code}/", wait=6)
    slug_link = re.search(r"internhack\.xyz/notes/[\w-]+", text).group(0)
    if h.ev(f"document.body.innerText.includes({json.dumps(slug_link)})"):  # article/main misses new comments
        print("already posted"); sys.exit(0)
    sel = 'textarea[aria-label="Add a comment…"]'
    h.ev(f"(()=>{{const t=document.querySelector({json.dumps(sel)}); t.scrollIntoView({{block:'center'}}); t.click(); t.focus(); return true}})()")
    time.sleep(0.5)
    h.insert(text)
    time.sleep(0.8)
    val = h.ev(f"document.querySelector({json.dumps(sel)}).value")
    if (val or "").strip() != text:
        print("value mismatch:", len(val or ""), "vs", len(text)); sys.exit(1)
    h.ev("(()=>{const b=[...document.querySelectorAll('div[role=button],button')].filter(e=>(e.innerText||'').trim()==='Post').pop(); b.click(); return !!b})()")
    time.sleep(5); h.goto(f"https://www.instagram.com/intern.hack/reel/{code}/", wait=6)
    ok = h.ev(f"document.body.innerText.includes({json.dumps(slug_link)})")
    print("posted" if ok else "NOT visible after post")
