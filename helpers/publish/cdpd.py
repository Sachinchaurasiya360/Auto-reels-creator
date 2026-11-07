"""One persistent CDP connection to the user's Chrome (ONE "Allow remote debugging" prompt per session).

Run once in the background:   python cdpd.py            (serves http://127.0.0.1:9333)
Then send commands with:      python cdpc.py tabs | eval <tab> <js|file> | goto <tab> <url> [wait] | shot <tab> <png>
                              | files <tab> <css selector> <path>... | key <tab> <text> | insert <tab> <text>
                              | click <tab> <x> <y> | new <url>
"""
import asyncio, base64, json, os
import websockets
from aiohttp import web

def browser_ws():
    p = os.path.join(os.environ["LOCALAPPDATA"], "Google", "Chrome", "User Data", "DevToolsActivePort")
    port, path = open(p).read().split()[:2]
    return f"ws://127.0.0.1:{port}{path}"

class CDP:
    def __init__(self): self.i, self.pending, self.sessions, self.ws = 0, {}, {}, None
    async def connect(self):
        self.ws = await websockets.connect(browser_ws(), max_size=None, open_timeout=120)
        asyncio.create_task(self.reader())
    async def reader(self):
        async for raw in self.ws:
            r = json.loads(raw)
            f = self.pending.pop(r.get("id"), None)
            if f and not f.done(): f.set_result(r)
    async def send(self, method, sid=None, **params):
        self.i += 1; mid = self.i
        f = asyncio.get_running_loop().create_future(); self.pending[mid] = f
        msg = {"id": mid, "method": method, "params": params}
        if sid: msg["sessionId"] = sid
        await self.ws.send(json.dumps(msg))
        r = await asyncio.wait_for(f, 120)
        if "error" in r: raise RuntimeError(r["error"])
        return r["result"]
    async def pages(self):
        return [t for t in (await self.send("Target.getTargets"))["targetInfos"] if t["type"] == "page"]
    async def session(self, prefix):
        tid = next(t["targetId"] for t in await self.pages() if t["targetId"].startswith(prefix))
        if tid not in self.sessions:
            self.sessions[tid] = (await self.send("Target.attachToTarget", targetId=tid, flatten=True))["sessionId"]
        return self.sessions[tid]

cdp = CDP()

async def handle(req):
    a = await req.json(); cmd = a["cmd"]
    try:
        if cmd == "tabs":
            return web.json_response([f'{t["targetId"][:8]} ctx {t.get("browserContextId","")[:6]} {t["url"][:100]} | {t["title"][:40]}' for t in await cdp.pages()])
        if cmd == "new":
            return web.json_response((await cdp.send("Target.createTarget", url=a["url"], background=True))["targetId"][:8])
        sid = await cdp.session(a["tab"])
        if cmd == "eval":
            r = await cdp.send("Runtime.evaluate", sid, expression=a["js"], awaitPromise=True, returnByValue=True)
            if "exceptionDetails" in r: return web.json_response({"EXC": r["exceptionDetails"]})
            return web.json_response(r["result"].get("value"))
        if cmd == "goto":
            await cdp.send("Page.navigate", sid, url=a["url"]); await asyncio.sleep(a.get("wait", 6)); return web.json_response("ok")
        if cmd == "shot":
            r = await cdp.send("Page.captureScreenshot", sid, format="png")
            open(a["out"], "wb").write(base64.b64decode(r["data"])); return web.json_response(a["out"])
        if cmd == "files":
            doc = await cdp.send("DOM.getDocument", sid, depth=-1, pierce=True)
            ids = (await cdp.send("DOM.querySelectorAll", sid, nodeId=doc["root"]["nodeId"], selector=a["sel"]))["nodeIds"]
            await cdp.send("DOM.setFileInputFiles", sid, nodeId=ids[a.get("idx", 0)], files=a["files"]); return web.json_response(len(ids))
        if cmd == "insert":
            await cdp.send("Input.insertText", sid, text=a["text"]); return web.json_response("ok")
        if cmd == "key":
            for ch in a["text"]:
                await cdp.send("Input.dispatchKeyEvent", sid, type="keyDown", text=ch, key=ch)
                await cdp.send("Input.dispatchKeyEvent", sid, type="keyUp", key=ch)
            return web.json_response("ok")
        if cmd == "rawkey":  # e.g. {"key":"Enter","code":"Enter","vk":13}
            for t in ("keyDown", "keyUp"):
                await cdp.send("Input.dispatchKeyEvent", sid, type=t, key=a["key"], code=a.get("code", a["key"]),
                               windowsVirtualKeyCode=a.get("vk", 0), modifiers=a.get("mod", 0))
            return web.json_response("ok")
        if cmd == "click":
            for t in ("mousePressed", "mouseReleased"):
                await cdp.send("Input.dispatchMouseEvent", sid, type=t, x=a["x"], y=a["y"], button="left", clickCount=1)
            return web.json_response("ok")
        return web.json_response({"error": "unknown cmd"})
    except Exception as e:
        return web.json_response({"error": repr(e)[:800]})

async def main():
    await cdp.connect(); print("connected", flush=True)
    app = web.Application(client_max_size=50 * 1024 * 1024); app.router.add_post("/", handle)
    runner = web.AppRunner(app); await runner.setup()
    await web.TCPSite(runner, "127.0.0.1", 9333).start(); print("serving 9333", flush=True)
    await cdp.ws.wait_closed(); print("chrome connection closed", flush=True)

asyncio.run(main())
