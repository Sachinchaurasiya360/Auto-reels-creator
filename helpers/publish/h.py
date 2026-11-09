"""Helpers over cdpc.call for scheduling (one tab, personal profile)."""
import json, sys, time
from cdpc import call

TAB = None

def ev(js):
    return call(cmd="eval", tab=TAB, js=js)

def click_xy(x, y):
    return call(cmd="click", tab=TAB, x=x, y=y)

def center(js_el):
    """js_el: JS expression returning an element; scrolls it into view and returns its centre."""
    return ev(f"(()=>{{const e=({js_el}); if(!e) return null; e.scrollIntoView({{block:'center'}}); const r=e.getBoundingClientRect(); return [r.x+r.width/2, r.y+r.height/2];}})()")

def click_el(js_el):
    """Scroll the element into view and click it. Default is a JS .click() on the element: on 2026-11-05 CDP mouse
    events stopped reaching Instagram's buttons in a re-opened Chrome window (insights, Create). Set H_MOUSE=1 to use
    a real mouse click at its centre instead."""
    import os
    c = center(js_el)
    if not c: return False
    time.sleep(0.3)
    if os.environ.get("H_MOUSE") == "1":
        click_xy(*c)
    else:
        ev(f"(()=>{{const e=({js_el}); if(!e) return false; e.click(); return true;}})()")
    return True

def by_text(text, scope="document", sel="*", exact=True):
    cond = f"(e.innerText||'').trim()==={json.dumps(text)}" if exact else f"(e.innerText||'').includes({json.dumps(text)})"
    # innermost match
    return f"[...{scope}.querySelectorAll({json.dumps(sel)})].filter(e=>{cond}).filter(e=>e.offsetParent!==null).pop()"

def files(sel, paths, idx=0):
    return call(cmd="files", tab=TAB, sel=sel, files=paths, idx=idx)

def insert(text):
    return call(cmd="insert", tab=TAB, text=text)

def key(text):
    return call(cmd="key", tab=TAB, text=text)

def rawkey(k, code=None, vk=0, mod=0):
    return call(cmd="rawkey", tab=TAB, key=k, code=code or k, vk=vk, mod=mod)

def shot(path):
    return call(cmd="shot", tab=TAB, out=path)

def goto(url, wait=6):
    return call(cmd="goto", tab=TAB, url=url, wait=wait)


def focus():
    """Make the tab behave as focused (keys land in spinbuttons) and bring it to the front."""
    return call(cmd="focus", tab=TAB)
