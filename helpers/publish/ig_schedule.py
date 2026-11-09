"""Schedule one reel on Instagram web (personal profile, through cdpd).

    python helpers/publish/ig_schedule.py <ig_tab> <reel dir> <day of month> <H> <AM|PM> [--go]

e.g. python helpers/publish/ig_schedule.py 18F40AAB 2026-11-05-swiggy-live-map 5 9 AM
Without --go it stops before "Schedule" and saves ig_<dir>.png in the cwd: read it (preview, date, time, caption),
then rerun only the click with --go-only, or pass --go the first time once the flow is trusted.
Uses reels/<dir>/final.mp4, cover.png and caption.txt. Assumes the reel is in the current month shown by the picker.

Selectors that work (2026-11-04):
- New post: click the sidebar "+" at css (36, 389) on a 1536x674 window; the "Post" span then appears.
- Upload: [role=dialog] input[type=file] + a manual 'change' event (setFileInputFiles alone doesn't fire it).
- Crop: svg[aria-label="Select crop"] -> span "9:16" -> "Next". Cover: the only file input left (images) + change.
- Caption: [role=dialog] [contenteditable=true], focus, Input.insertText; length must equal caption.txt.
- Schedule content: checkbox in the parent of the "Schedule content" span. Date: click the shown date text,
  then the day cell (located under the "<Month> <Year>" header by geometry). Time: inputs aria-label
  Hours / Minutes / AM PM, focus each and type keys ONCE (typing hours twice gives e.g. 11 instead of 01).
"""
import sys, time, json
import h

args = [a for a in sys.argv[1:] if not a.startswith("--")]
GO = "--go" in sys.argv
GO_ONLY = "--go-only" in sys.argv
h.TAB, d, day, hour, ampm = args[0], args[1], int(args[2]), int(args[3]), args[4].upper()
R = rf"C:\CodeBase\video-use\reels\{d}"
D = "document.querySelector('[role=dialog]')"
dlg_text = "[...document.querySelectorAll('[role=dialog]')].map(x=>x.innerText).join('|')"


def wait_for(text, n=15):
    for _ in range(n):
        if text in (h.ev(dlg_text) or ""):
            return
        time.sleep(1.5)
    raise SystemExit(f"timeout waiting for {text!r}")


def schedule_click():
    h.click_el(h.by_text("Schedule", scope=D, sel="div[role=button],button"))
    for _ in range(48):  # the upload can take 3-4 min (2026-11-05)
        time.sleep(5)
        if "has been scheduled" in (h.ev(dlg_text) or ""):
            print("SCHEDULED")
            h.click_el(h.by_text("Done", sel="div[role=button],button,span"))
            return
    raise SystemExit("no 'has been scheduled' message: check the tab")


if GO_ONLY:
    schedule_click(); sys.exit()

h.goto("https://www.instagram.com/intern.hack/", 5)
for _ in range(5):
    if h.click_el(h.by_text("Post", sel="span")):
        break
    # the Create (+) button: find it by its svg label, not by position (window size changes; 2026-11-05)
    if not h.click_el("(s=>s&&(s.closest('a,[role=link],[role=button]')||s))(document.querySelector('svg[aria-label=\"New post\"],svg[aria-label=\"Create\"]'))"):
        h.click_xy(36, 389)
    time.sleep(2.5)
else:
    raise SystemExit("Create > Post menu didn't open")
wait_for("Select from computer")
h.files("[role=dialog] input[type=file]", [R + r"\final.mp4"])
h.ev("document.querySelector('[role=dialog] input[type=file]').dispatchEvent(new Event('change',{bubbles:true}))")
wait_for("Crop", 25)
time.sleep(2)
assert h.click_el("(s=>s.closest('button,[role=button]')||s)(document.querySelector('[role=dialog] svg[aria-label=\"Select crop\"]'))")
time.sleep(1.5)
assert h.click_el(h.by_text("9:16", scope=D, sel="span"))
time.sleep(1.5)
assert h.click_el(h.by_text("Next", scope=D, sel="div[role=button],button"))
wait_for("Cover photo")
h.files("[role=dialog] input[type=file]", [R + r"\cover.png"])
h.ev("document.querySelector('[role=dialog] input[type=file]').dispatchEvent(new Event('change',{bubbles:true}))")
time.sleep(4)
assert h.click_el(h.by_text("Next", scope=D, sel="div[role=button],button"))
time.sleep(3)

cap = open(R + r"\caption.txt", encoding="utf-8").read().strip()
ed = "document.querySelector('[role=dialog] [contenteditable=true]')"
h.click_el(ed); h.ev(f"{ed}.focus()"); h.insert(cap); time.sleep(2)
n = h.ev(f"{ed}.innerText.length")
u16 = len(cap.encode("utf-16-le")) // 2  # JS innerText.length counts an emoji as 2 (2026-11-08)
print("caption", n, "/", u16)
if n != u16:
    raise SystemExit("caption length mismatch")

lab = h.by_text("Schedule content", scope=D, sel="span")
cb = f"(()=>{{let e={lab};for(let i=0;i<6;i++){{e=e.parentElement;const c=e.querySelector('input[type=checkbox]');if(c) return c;}}}})()"
if not h.ev(f"{cb}.checked"):
    h.click_el(cb); time.sleep(1.5)

date_js = "[...document.querySelectorAll('[role=dialog] span')].map(e=>(e.innerText||'').trim()).find(t=>/^[A-Z][a-z]{2}, [A-Z][a-z]{2} [0-9]+, [0-9]{4}$/.test(t))"
shown = h.ev(date_js)
if not shown or int(shown.split(" ")[2].rstrip(",")) != day:
    h.click_el(h.by_text(shown, scope=D, sel="span,div"))
    time.sleep(1.5)
    # day cell: a leaf whose text is the day, below the "<Month> <Year>" header and within its width
    xy = h.ev(f"""(()=>{{
      const hd=[...document.querySelectorAll('span,div,h2')].filter(e=>/^[A-Z][a-z]+ [0-9]{{4}}$/.test((e.innerText||'').trim())&&e.offsetParent).pop();
      const hr=hd.getBoundingClientRect();
      const c=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&(e.innerText||'').trim()==='{day}'&&e.offsetParent)
        .map(e=>e.getBoundingClientRect()).filter(r=>r.y>hr.y+30&&Math.abs(r.x+r.width/2-(hr.x+hr.width/2))<320);
      const els=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&(e.innerText||'').trim()==='{day}'&&e.offsetParent)
        .filter(e=>{{const r=e.getBoundingClientRect(); return r.y>hr.y+30&&Math.abs(r.x+r.width/2-(hr.x+hr.width/2))<320;}});
      if(!els.length) return null; els[0].click(); return true;}})()""")
    if not xy:
        raise SystemExit("day cell not found")
    time.sleep(1.5)  # JS click (2026-11-05: mouse clicks stopped landing in a re-opened window)
print("date", h.ev(date_js))
time.sleep(3.5)  # let the time inputs render before typing (2026-11-05: keys were lost, time stayed at "now")
want = f"{hour:02d}:00 {ampm}"
# 2026-11-07: the time fields are spinbuttons (aria-valuenow / aria-valuetext); the dialog text no longer shows the time
shown_time_js = "(()=>{const g=l=>document.querySelector('[role=dialog] input[aria-label=\"'+l+'\"]');const H=g('Hours'),M=g('Minutes'),A=g('AM PM');if(!H||!M||!A)return null;const h=H.getAttribute('aria-valuenow'),m=M.getAttribute('aria-valuenow'),a=A.getAttribute('aria-valuetext');if(!h||m===null||!a)return null;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+' '+a.toUpperCase()})()"
# 2026-11-06: under --go the keys were lost on 3 of 4 reels and Instagram kept "now" (10:23 PM). Never click
# Schedule without reading the time back from the dialog; retry, then stop.
# 2026-11-08: typed digits stopped landing in the spinbuttons; ArrowUp/ArrowDown still work, so step each field
# to its target by reading aria-valuenow (Hours 1-12, Minutes 0-59, AM PM 0=AM 1=PM).
targets = (("Hours", hour), ("Minutes", 0), ("AM PM", 0 if ampm == "AM" else 1))
# 2026-11-10: arrow keys did nothing while the tab was in the background (activeElement stayed null)
h.focus(); time.sleep(0.5)
for attempt in range(3):
    for lab_, goal in targets:
        q = f"document.querySelector('[role=dialog] input[aria-label=\"{lab_}\"]')"
        h.ev(f"{q}.scrollIntoView({{block:'center'}})")
        h.ev(f"{q}.focus()"); time.sleep(0.4)
        for _ in range(70):
            v = int(h.ev(f"{q}.getAttribute('aria-valuenow')") or -1)
            if v == goal or v < 0:
                break
            if goal > v:
                h.rawkey("ArrowUp", "ArrowUp", 38)
            else:
                h.rawkey("ArrowDown", "ArrowDown", 40)
            time.sleep(0.12)
    h.ev("document.activeElement.blur()")
    time.sleep(0.8)
    got = h.ev(shown_time_js)
    print("time", got)
    if got == want:
        break
    time.sleep(1.5)
else:
    h.shot(f"ig_{d}.png")
    raise SystemExit(f"time shows {got}, wanted {want}: NOT scheduled (see ig_{d}.png)")
h.ev("document.querySelector('[role=dialog] input[aria-label=\"Hours\"]').scrollIntoView({block:'center'})")
time.sleep(1)
h.shot(f"ig_{d}.png")
print("check", f"ig_{d}.png")
if GO:
    schedule_click()
