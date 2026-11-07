"""Open a URL in a NEW tab of the same Chrome profile as <from_tab> (keeps us in the personal profile).

    python helpers/publish/open_tab.py <from_tab_prefix> <url>

CDP's Target.createTarget picks the default profile, which may be the work profile, so instead we inject a
button into a personal-profile tab and click it (a real click, so the popup isn't blocked). Works from a
github.com / gmail tab; Instagram blocks it. Prints the tab list afterwards; use the new tab's id prefix.
"""
import sys, time
import h
from cdpc import call

h.TAB, url = sys.argv[1], sys.argv[2]
h.ev("(()=>{document.querySelectorAll('#cc_open').forEach(e=>e.remove());const b=document.createElement('button');"
     "b.id='cc_open';b.style='position:fixed;left:0;top:0;width:60px;height:40px;z-index:2147483647';"
     f"b.onclick=()=>{{window.open({url!r},'_blank');b.remove()}};document.body.appendChild(b)}})()")
h.click_xy(30, 20)
time.sleep(8)
for t in call(cmd="tabs"):
    print(t)
