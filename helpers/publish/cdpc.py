"""Client for cdpd.py (no new Chrome connection, so no new permission prompt)."""
import json, os, sys, urllib.request

def call(**a):
    req = urllib.request.Request("http://127.0.0.1:9333/", json.dumps(a).encode(), {"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=300).read())

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    c, *r = sys.argv[1:]
    if c == "tabs": out = call(cmd="tabs")
    elif c == "new": out = call(cmd="new", url=r[0])
    elif c == "eval":
        js = open(r[1], encoding="utf-8").read() if os.path.isfile(r[1]) else r[1]
        out = call(cmd="eval", tab=r[0], js=js)
    elif c == "goto": out = call(cmd="goto", tab=r[0], url=r[1], wait=float(r[2]) if len(r) > 2 else 6)
    elif c == "shot": out = call(cmd="shot", tab=r[0], out=r[1])
    elif c == "files": out = call(cmd="files", tab=r[0], sel=r[1], files=r[2:])
    elif c == "insert": out = call(cmd="insert", tab=r[0], text=r[1])
    elif c == "key": out = call(cmd="key", tab=r[0], text=r[1])
    elif c == "click": out = call(cmd="click", tab=r[0], x=float(r[1]), y=float(r[2]))
    else: out = {"error": "unknown"}
    print(out if isinstance(out, str) else json.dumps(out, ensure_ascii=False, indent=1))
