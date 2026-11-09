# Browser recipes: stats (§0) and scheduling (§7)

Everything runs in the user's already-open Chrome in **remote-debugging mode** (CDP on the port in
`%LOCALAPPDATA%\Google\Chrome\User Data\DevToolsActivePort`), through the browser-use plugin (`browser_exec`, Python
with `js`, `cdp`, `click_at_xy`, `type_text`, `switch_tab`, `goto_url` pre-imported) or a raw CDP client on that
port. Worked on 2026-11-02.

**Only this method (Sachin, 2026-11-04):** "always use the browser debugging mode". Never Playwright, a fresh or
headless browser, or a logged-out fetch. If the debugging connection fails, stop and tell Sachin; don't fall back.
**Never the work profile** (Profile 4, sachin@nucleohq.com): only touch tabs in the personal profile's browser context.

## Scripts first (Sachin 2026-11-04: "most of the steps are common day to day, optimize them")

Run these instead of rediscovering buttons; the manual notes below are only for when a script breaks (then fix
the script, not just the run). All live in `helpers/publish/` and talk to one persistent connection:

```bash
cd helpers/publish
python cdpd.py &                       # ONE "Allow remote debugging" prompt per session; keep it running
python cdpc.py tabs                    # pick tabs whose ctx matches the personal profile (personal gmail/github)
python open_tab.py <github_tab> https://www.instagram.com/intern.hack/    # new tab IN the personal profile
python open_tab.py <github_tab> "https://studio.youtube.com/channel/UCsBOnrfOFU-v_wPRu_VH7EA/videos/upload?d=ud"
python ig_schedule.py <ig_tab> <reel dir> <day> <H> <AM|PM>         # stops before Schedule, writes ig_<dir>.png
python ig_schedule.py <ig_tab> <reel dir> <day> <H> <AM|PM> --go-only  # after checking the png: click Schedule
python yt_schedule.py <studio_tab> <reel dir> <slug> <HH:MM> --go    # prints "set to public on ..." + Short URL
```
Run `cdpd.py` with the system Python (`C:\Users\mrsac\AppData\Local\Programs\Python\Python312\python.exe`): the
repo `.venv` has no `websockets` (2026-11-05). HTTP 403 from Chrome = the Allow prompt was missed: rerun and click Allow.
`open_tab.py` can't start from a `chrome://newtab` tab (no page JS); in a profile with only a blank tab, `goto` that tab.

```bash
python ig_stats.py <ig_tab> <code> [<code> ...] > stats.json   # §0: page + insights per reel (JS click opens insights;
                                                                  # a CDP mouse click on "View insights" does nothing)
python ig_comment.py <ig_tab> <reel code> <reel dir>             # posts post.md's "Pinned comment" (run from repo root,
                                                                  # PYTHONPATH=helpers/publish); skips if already there
```
Never `cdpc.py new`: CDP opens it in the default profile, which can be the work profile. Never click inside
Instagram at guessed coordinates outside a dialog (a stray click opened a random profile once).

## Ground rules

- Reuse the Instagram and YouTube Studio tabs (`list_tabs()`, match by URL). Don't open duplicates, and
  never navigate other tabs. Another session may switch the shared daemon's tab under you (it happened with
  a Medium tab): call `switch_tab(<id>)` before every block, and check `page_info()['url']` before reading a page.
- Text checks: SVG nodes have no `innerText`, so always write `(x.innerText||'')`.
- Never print `document.body.innerText` of YouTube Studio in full (megabytes); slice it or read specific elements.
- Screens are small (about 1536x674): `scrollIntoView({block:'center'})` before clicking anything near the bottom.
- File uploads go through CDP, not a dialog:
  ```python
  doc = cdp("DOM.getDocument", depth=-1, pierce=True)
  ids = cdp("DOM.querySelectorAll", nodeId=doc['root']['nodeId'], selector='[role=dialog] input[type=file]')['nodeIds']
  cdp("DOM.setFileInputFiles", nodeId=ids[0], files=[r"C:\CodeBase\video-use\reels\<dir>\final.mp4"])
  ```
- Long text goes in with `cdp("Input.insertText", text=...)` after focusing the field, not `type_text`.

## §0 Stats

**Instagram**
- `https://www.instagram.com/intern.hack/reels/`: each tile is `a[href*="/reel/"]`; its `innerText` is
  the view count.
- Each `https://www.instagram.com/intern.hack/reel/<id>/`: `article` (or `main`) `innerText` has the
  caption, the "N likes / Liked by …" line, the comments and the age ("7h", "1d"). Match reels to the log
  by the caption's first line.
- Insights (work as of 2026-11-02): on the reel page click the element whose text is `View insights`; it opens
  `/insights/media/<numeric id>/`. `document.body.innerText` then has Views, Followers / Non-followers %, Viewers
  (reach), Likes, Comments, Saves, Shares, Profile activity, Follows. The leading `0:0X` is the player position,
  not watch time; web insights have no watch time or skip rate.

**Comments (pinned comments, replies)**
- Box is `textarea[aria-label="Add a comment…"]`: scroll it into view, click it, **also call `.focus()`**, then
  `Input.insertText`; check `.value` equals the text (without focus it stayed empty on 3 of 5 reels), then click
  the `Post` button.
- Instagram web has **no Pin**: a comment's "Comment Options" (hover its Reply line) only offers Delete. Post
  the comment from the browser and pin it in the phone app.

**YouTube Studio** (not used since 2026-11-09: no YouTube stats in §0; kept for reference)
- `https://studio.youtube.com/channel/UCsBOnrfOFU-v_wPRu_VH7EA/videos/short`: rows are `ytcp-video-row`;
  `innerText` holds the title, visibility, date, views, comments and likes.
- Per Short: `https://studio.youtube.com/video/<id>/analytics/tab-overview/period-default` for the
  average view duration, % viewed and "viewed vs swiped away" (read specific cards, not the whole body).

## §7 Instagram scheduling

1. Profile page → click the element whose text is `Create` → click `Post` (menu item, page scope).
2. Upload `final.mp4` into `[role=dialog] input[type=file]`; wait about 7 s.
3. Crop defaults to **1:1**. Click the crop icon at the bottom left of the preview (about `click_at_xy(564, 553)`
   on a 1536-wide window), then the `9:16` option, then `Next`.
4. Edit step: the only `input[type=file]` left accepts images; set `cover.png` on it, then `Next`.
5. Caption: focus `[role=dialog] [contenteditable=true]`, `Input.insertText` the "Instagram caption"
   section of `post.md`. A hashtag suggestion list opens over the options; close it by clicking the
   suggestion identical to the last hashtag. Check `innerText.length` equals the caption length.
6. Schedule content: find the checkbox inside the parent of the "Schedule content" label; click it if it's not
   checked. Click the date text (e.g. `Mon, Nov 2, 2026`) → in the calendar after the "November 2026"
   header click the day. Time inputs have aria-labels `Hours`, `Minutes`, `AM PM`: focus each and send key
   events ("09", "00", "A"/"P").
7. Screenshot to confirm the preview, date and time, then click `Schedule`; wait for "Your reel has been scheduled."
8. Verify at `https://www.instagram.com/scheduled_content/`: each caption is followed by its time.

## §7 YouTube scheduling

1. `https://studio.youtube.com/channel/UCsBOnrfOFU-v_wPRu_VH7EA/videos/upload?d=ud` → `input[type=file]` ← `final.mp4`; wait 10-12 s.
2. Title and description are `ytcp-uploads-dialog #textbox` [0] and [1]. **Click into each box**
   (scroll into view, `click_at_xy`), Ctrl+A, Backspace, then `Input.insertText`. Using `execCommand('selectAll')`
   without the click selected the whole page once and nothing was filled.
3. `tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]`. Click `#toggle-button` ("Show more"),
   then `[name=VIDEO_HAS_ALTERED_CONTENT_NO]`.
4. Tags: click the `#tags-container input` physically, then for each tag `type_text(tag)` plus a "," key event.
   `insertText` doesn't create chips. Remove stray suggestion chips via their delete icon.
5. `#next-button` x3 → Visibility. Scroll the `Schedule` label into view and click it.
6. **Time:** click the time input, which opens a list of 15-minute slots, then click the `tp-yt-paper-item`
   whose text is e.g. `13:00`. Typing a time and pressing Enter shows the time but saves **00:00**. The date
   defaults to the next day; the time zone should read `(GMT+0530) Local Time`.
7. `#done-button` → the dialog says "Your video will be set to public on <date> at <time>". Read it; if the time is
   wrong, open `https://studio.youtube.com/video/<id>/edit` → click `ytcp-video-metadata-visibility` →
   pick the time from the list → `Done` → `Save`, then reload and re-check.
8. Studio's Shorts list: each new Short shows "Scheduled" with the right date; no stray "final" drafts.

## Fixing a wrong Instagram time (2026-11-06)
`ig_schedule.py --go` once saved 3 of 4 reels at "now" (keys lost). The script now reads the time back and refuses to
schedule on a mismatch. To fix an already scheduled post: `scheduled_content/` → click its thumbnail → the Edit dialog
has `input[aria-label=Hours|Minutes|AM PM]` (scroll into view, focus each, type keys once) → check the screenshot shows
the right time → click `Save` (bottom right) → reload and re-read every caption's time. Save each dialog before
opening the next one.

## YouTube failures seen on 2026-11-06 (fixed in yt_schedule.py)
- Title stayed "final" and description empty: Studio sets the file name as title a few seconds after the upload starts,
  overwriting an early fill. The script now waits, re-reads both boxes and refills; it stops if they don't stick.
- Tags typed onto the end of the description: a click on the tags input left focus in the description. Now focus the
  input with JS, check `document.activeElement`, and stop if the description changed.
- `<` / `>` are rejected in title and description (the humanizer turns "→" into "->"): the script refuses them.
- Late time slots (09:00+) are below the fold of the slot list: scroll the `tp-yt-paper-item` into view before clicking.
- A failed run leaves its upload dialog open; the next run then attaches metadata to the WRONG video. Run one reel at a
  time, check the screenshot (title + duration + time) before `--go`, and use `--resume` to finish an open dialog.
- Fixing a scheduled Short: `studio.youtube.com/video/<id>/edit` → description `#textbox`[1], "Show more" → tags input,
  `#save`; reload and re-read.
