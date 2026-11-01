# Browser recipes: stats (§0) and scheduling (§7)

Everything runs in the user's already-open Chrome through the browser-use plugin (`browser_exec`, Python
with `js`, `cdp`, `click_at_xy`, `type_text`, `switch_tab`, `goto_url` pre-imported). Worked on 2026-11-02.

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
- The account is professional (category Tech). Try each reel's "View insights" for reach and watch time.
  `/insights/media/<id>/` returned "page isn't available" on 2026-11-01, so if no web insights load,
  report views/likes/comments only.

**YouTube Studio**
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
