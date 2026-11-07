"""Synthesise the teardown SFX set (Andar Kya Hai?) into series/studio/public/sfx/ with Opuscar's sfx.py.

Run with the Opuscar venv (numpy, scipy, soundfile):
    C:/Users/mrsac/lemo-opuscar/.venv/Scripts/python.exe helpers/sfx_teardown.py
Writes mp3 (via ffmpeg) next to the existing library sounds. Deterministic (fixed seeds).
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

LIB = Path("C:/Users/mrsac/lemo-opuscar")
sys.path.insert(0, str(LIB / "core" / "audio"))
import sfx as S  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "series" / "studio" / "public" / "sfx"
rng = np.random.default_rng(11)


def metal_clank(pitch=1.0, v=1.0):
    """Heavy steel part lifted off / set down: noise strike + inharmonic plate partials with long, uneven decays."""
    d = 0.9
    tt = S.t_(d)
    strike = S.hp(S.noise(d), 1800) * S.env_exp(d, 0.004)
    partials = [(523, 1.0, 0.35), (1187, 0.7, 0.22), (1873, 0.5, 0.16), (2741, 0.35, 0.10), (3620, 0.25, 0.07)]
    ring = sum(a * np.sin(2 * np.pi * f * pitch * tt + rng.random() * 6) * S.env_exp(d, tau) for f, a, tau in partials)
    body = np.sin(2 * np.pi * 110 * pitch * tt) * S.env_exp(d, 0.05) * 0.6
    return S.norm(strike * 0.7 + ring * 0.6 + body) * v


def bolt_tick(v=1.0):
    """Small metallic tick for each label / bolt."""
    d = 0.08
    tt = S.t_(d)
    x = S.hp(S.noise(d), 4000) * S.env_exp(d, 0.002) + np.sin(2 * np.pi * 3300 * tt) * S.env_exp(d, 0.012) * 0.6
    return S.norm(x) * v


def hiss(d=1.6, v=1.0):
    """Cryogenic vent: bright noise with a soft attack and a long tail."""
    x = S.bp(S.noise(d), 2500, 9000)
    tt = S.t_(d)
    envl = np.minimum(1, tt / 0.12) * np.exp(-np.maximum(0, tt - 0.3) / 0.6)
    return S.norm(x * envl) * v


def servo(d=0.7, v=1.0):
    """Gimbal actuator whir: rising buzz."""
    tt = S.t_(d)
    f = 180 + 140 * tt / d
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / S.SR)) * 0.3 + S.bp(S.noise(d), 600, 2400) * 0.3
    envl = np.minimum(1, tt / 0.05) * np.minimum(1, (d - tt) / 0.1)
    return S.norm(S.lp(x, 3000) * envl) * v


def write(name, x):
    wav = OUT / f"{name}.wav"
    sf.write(wav, np.asarray(x, dtype=np.float32), S.SR)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-b:a", "192k", str(OUT / f"{name}.mp3")], check=True)
    wav.unlink()
    print("wrote", name)


if __name__ == "__main__":
    write("metal-clank", metal_clank())
    write("metal-clank-low", metal_clank(pitch=0.7))
    write("bolt-tick", bolt_tick())
    write("cryo-hiss", hiss())
    write("servo-whir", servo())
    write("rocket-ignite", S.ignite())
    write("rocket-roar", S.roar(6.0))
    write("deep-rumble", S.rumble(3.0))
    write("thump-heavy", S.thump(f=55))
