"""Upload + schedule one Short in YouTube Studio (personal profile, through cdpd).

    python helpers/publish/yt_schedule.py <studio_tab> <reel dir> <slug> <HH:MM 24h> [--go]

e.g. python helpers/publish/yt_schedule.py 0D5DFB20 2026-11-05-swiggy-live-map swiggy-live-map 09:00 --go
Title / description / tags come from post.md "## YouTube Shorts"; the notes link (utm_source=yt) is appended to
the description. The date stays Studio's default (tomorrow); pass --date-check to abort if it isn't the day you
expect. Prints the "Your video will be set to public on ..." line and the Short URL. Worked for 3/3 on 2026-11-04.

Selectors: title/description = ytcp-uploads-dialog #textbox [0]/[1] (click, Ctrl+A, Backspace, insertText);
kids = tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]; #toggle-button then
[name=VIDEO_HAS_ALTERED_CONTENT_NO]; tags = click #tags-container input, type each + ","; #next-button x3;
leaf "Schedule"; time = #time-of-day-trigger then the tp-yt-paper-item with the exact "HH:MM" (typed times save 00:00);
#done-button; share dialog Close.
"""
import sys, time, re, json
import h

args = [a for a in sys.argv[1:] if not a.startswith("--")]
GO = "--go" in sys.argv
RESUME = "--resume" in sys.argv  # finish an upload dialog that is already open (no new upload)
h.TAB, d, slug, hhmm = args[:4]
R = rf"C:\CodeBase\video-use\reels\{d}"
post = open(R + r"\post.md", encoding="utf-8").read()
yt = post.split("## YouTube Shorts", 1)[1].split("\n## ", 1)[0]
title = re.search(r"^Title:\s*(.+)$", yt, re.M).group(1).strip()
desc = yt.split("Description:", 1)[1].split("\nTags:", 1)[0].strip()
desc += f"\n\nFull notes (diagram + interview answer): https://internhack.xyz/notes/{slug}?utm_source=yt&utm_medium=description&utm_campaign={slug}"
tags = [t.strip() for t in re.search(r"^Tags:\s*(.+)$", yt, re.M).group(1).split(",") if t.strip()]
if len(title) > 100:
    raise SystemExit(f"title too long ({len(title)})")
if any(c in title + desc for c in "<>"):
    raise SystemExit("YouTube rejects < and > in title/description (e.g. '->'): rewrite post.md")  # 2026-11-06


def wait(js, n=20, dt=1.5):
    for _ in range(n):
        v = h.ev(js)
        if v:
            return v
        time.sleep(dt)
    raise SystemExit("timeout: " + js[:80])


h.goto("https://studio.youtube.com/channel/UCsBOnrfOFU-v_wPRu_VH7EA/videos/upload?d=ud", 8)
wait("!!document.querySelector('input[type=file]')")
h.files("input[type=file]", [R + r"\final.mp4"])
wait("document.querySelectorAll('ytcp-uploads-dialog #textbox').length>=2", 30)
time.sleep(4)


def fill(idx, text):
    box = f"document.querySelectorAll('ytcp-uploads-dialog #textbox')[{idx}]"
    # select the box's contents with a Range (works in a background tab; mouse + Ctrl+A did not, 2026-11-05)
    h.ev(f"(()=>{{const b={box}; b.scrollIntoView({{block:'center'}}); b.focus(); const r=document.createRange(); r.selectNodeContents(b); const s=getSelection(); s.removeAllRanges(); s.addRange(r);}})()")
    time.sleep(0.3); h.insert(text); time.sleep(0.6)
    return h.ev(f"{box}.innerText.trim().length")


def box_text(idx):
    return h.ev(f"document.querySelectorAll('ytcp-uploads-dialog #textbox')[{idx}].innerText.trim()") or ""


def fill_checked():
    # 2026-11-06: a run left the title as "final" and the description empty and still scheduled. Re-read both
    # after a pause and refill; never continue with the wrong text.
    for attempt in range(4):
        if box_text(0) != title:
            fill(0, title)
        if box_text(1) != desc.strip():
            fill(1, desc)
        time.sleep(3)
        if box_text(0) == title and box_text(1) == desc.strip():
            return
    raise SystemExit(f"title/description did not stick: {box_text(0)[:60]!r}")


fill_checked()
print("title ok:", box_text(0)[:70])
h.click_el("document.querySelector('tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]')"); time.sleep(0.5)
h.click_el("document.querySelector('ytcp-uploads-dialog #toggle-button')"); time.sleep(1.2)
h.click_el("document.querySelector('tp-yt-paper-radio-button[name=VIDEO_HAS_ALTERED_CONTENT_NO]')"); time.sleep(0.5)
# 2026-11-06: a click on the tags input sometimes left focus in the description, so the tags were typed onto the
# end of it. Focus the input with JS, check it really has focus, then check the description is unchanged.
tag_focus = "(()=>{const i=document.querySelector('ytcp-uploads-dialog #tags-container input'); if(!i) return false; i.scrollIntoView({block:'center'}); i.focus(); return document.activeElement===i;})()"
if not h.ev(tag_focus):
    raise SystemExit("tags input not focused: NOT typing tags")
for t in tags:
    h.key(t); h.rawkey(",", "Comma", 188); time.sleep(0.25)
time.sleep(0.8)
n_chips = h.ev("[...document.querySelectorAll('ytcp-uploads-dialog ytcp-chip')].filter(c=>(c.innerText||'').trim()).length")
print("tags", n_chips, "/", len(tags))
if box_text(1) != desc.strip():
    raise SystemExit("description changed while typing tags: NOT scheduled")
print("not-for-kids", h.ev("document.querySelector('tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]').hasAttribute('checked')"),
      "altered-no", h.ev("document.querySelector('tp-yt-paper-radio-button[name=VIDEO_HAS_ALTERED_CONTENT_NO]').hasAttribute('checked')"))
if box_text(0) != title:
    fill_checked()
for _ in range(3):
    h.click_el("document.querySelector('ytcp-uploads-dialog #next-button')"); time.sleep(2)
h.click_el("[...document.querySelectorAll('ytcp-uploads-dialog *')].filter(e=>(e.innerText||'').trim()==='Schedule'&&e.children.length===0).pop()")
time.sleep(2)
print("date", h.ev("(document.querySelector('ytcp-uploads-dialog #datepicker-trigger')||{}).innerText"))
# the time field is the input inside #time-of-day-container (no #time-of-day-trigger any more, 2026-11-05)
h.ev("(()=>{const i=document.querySelector('ytcp-uploads-dialog #time-of-day-container input'); i.scrollIntoView({block:'center'}); i.focus(); i.click();})()")
time.sleep(1.5)
if not h.ev("[...document.querySelectorAll('tp-yt-paper-item')].some(e=>e.offsetParent)"):
    h.ev("(()=>{const i=document.querySelector('ytcp-uploads-dialog #time-of-day-trigger input')||document.querySelector('ytcp-uploads-dialog #time-of-day-trigger'); i.focus(); i.click(); i.dispatchEvent(new MouseEvent('mousedown',{bubbles:true})); i.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));})()")
    time.sleep(1.5)
# the slot list is long; later slots (e.g. 09:00) exist but sit below the fold: scroll the item in, then click
if not h.ev(f"(()=>{{const e=[...document.querySelectorAll('tp-yt-paper-item')].filter(e=>(e.innerText||'').trim()==={json.dumps(hhmm)}).pop(); if(!e) return false; e.scrollIntoView({{block:'center'}}); e.click(); return true;}})()"):
    raise SystemExit(f"time slot {hhmm} not in the list")
time.sleep(1)
got_time = h.ev("[...document.querySelectorAll('ytcp-uploads-dialog #time-of-day-container input')].map(i=>i.value).join('')")
print("time", got_time)
if got_time != hhmm:
    raise SystemExit(f"time shows {got_time}, wanted {hhmm}: NOT scheduled")
time.sleep(1)
h.shot(f"yt_{slug}.png")
print("check", f"yt_{slug}.png")
if GO:
    h.click_el("document.querySelector('ytcp-uploads-dialog #done-button')")
    time.sleep(7)
    print(h.ev("[...document.querySelectorAll('ytcp-video-share-dialog,tp-yt-paper-dialog')].filter(d=>d.offsetParent).map(d=>d.innerText.slice(0,300)).join(' || ')"))
    h.click_el("[...document.querySelectorAll('ytcp-video-share-dialog ytcp-button, ytcp-video-share-dialog button')].filter(e=>(e.innerText||'').trim()==='Close').pop()")
