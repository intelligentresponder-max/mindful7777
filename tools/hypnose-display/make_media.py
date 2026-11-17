#!/usr/bin/env python3
"""Erzeugt alle Medien des Hypnose-Displays selbst (keine Fremdquellen, keine Lizenzfragen).

Aufruf im Ordner tools/hypnose-display:  python3 make_media.py [img|video|audio]
Braucht: python3, numpy, ffmpeg (libx264, libmp3lame).

Sicherheitsregeln (bewusst eingebaut, nicht ändern ohne Grund):
- Videos: nur weiche Sinus-Verläufe, kein Blitzen, kein Kontrastsprung. Schnellste Änderung << 1 Hz
  (Richtwert Photosensitivität: nie mehr als 3 Blitze pro Sekunde).
- Audio: Spitzenpegel ca. -10 dBFS, damit der Regler nie laut überrascht.
- Loops sind mathematisch periodisch (ganze Perioden je Loop) -> keine hörbare/sichtbare Naht.
"""
import math, os, random, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
IMG, VID, AUD = (os.path.join(HERE, "media", d) for d in ("img", "video", "audio"))
for d in (IMG, VID, AUD):
    os.makedirs(d, exist_ok=True)

NAVY, DEEP, GOLD, CYAN, BEIGE = "#1B2845", "#070a14", "#D4A574", "#4fd1c5", "#F7F4EE"
W, H = 1600, 1000


def svg(name, body, defs=""):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">'
         f'<defs>{defs}<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">'
         f'<feGaussianBlur stdDeviation="6"/></filter></defs>{body}</svg>')
    with open(os.path.join(IMG, name), "w", encoding="utf-8") as f:
        f.write(s)


def bg(c1=NAVY, c2=DEEP):
    return (f'<radialGradient id="bg" cx="50%" cy="50%" r="75%"><stop offset="0" stop-color="{c1}"/>'
            f'<stop offset="1" stop-color="{c2}"/></radialGradient>')


def rect_bg():
    return f'<rect width="{W}" height="{H}" fill="url(#bg)"/>'


def make_images():
    cx, cy = W / 2, H / 2
    # 1 Spirale Gold: drei logarithmische Arme
    arms = ""
    for k in range(3):
        pts = []
        for i in range(0, 900):
            th = i / 900 * 7 * math.pi
            r = 6 * math.exp(0.2325 * th)
            a = th + k * 2 * math.pi / 3
            pts.append(f"{cx + r * math.cos(a):.1f},{cy + r * math.sin(a):.1f}")
        p = " ".join(pts)
        arms += (f'<polyline points="{p}" fill="none" stroke="{GOLD}" stroke-width="7" opacity=".35" filter="url(#glow)"/>'
                 f'<polyline points="{p}" fill="none" stroke="{GOLD}" stroke-width="2.2" opacity=".9"/>')
    svg("spirale-gold.svg", rect_bg() + arms, bg())

    # 2 Ringe Cyan
    rings = ""
    for k in range(15):
        r = 28 * 1.27 ** k
        op = max(0.12, 0.9 - k * 0.055)
        rings += (f'<circle cx="{cx}" cy="{cy}" r="{r:.1f}" fill="none" stroke="{CYAN}" stroke-width="5" opacity="{op * .4:.2f}" filter="url(#glow)"/>'
                  f'<circle cx="{cx}" cy="{cy}" r="{r:.1f}" fill="none" stroke="{CYAN}" stroke-width="1.6" opacity="{op:.2f}"/>')
    rings += f'<circle cx="{cx}" cy="{cy}" r="9" fill="{GOLD}" filter="url(#glow)"/><circle cx="{cx}" cy="{cy}" r="5" fill="{BEIGE}"/>'
    svg("ringe-cyan.svg", rect_bg() + rings, bg("#10213a", DEEP))

    # 3 Horizont
    random.seed(7)
    stars = "".join(f'<circle cx="{random.uniform(0, W):.0f}" cy="{random.uniform(0, 520):.0f}" r="{random.uniform(.6, 1.8):.1f}" fill="{BEIGE}" opacity="{random.uniform(.25, .8):.2f}"/>' for _ in range(90))
    defs = (f'<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{DEEP}"/>'
            f'<stop offset=".55" stop-color="{NAVY}"/><stop offset="1" stop-color="#6b5a45"/></linearGradient>'
            f'<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a30"/><stop offset="1" stop-color="{DEEP}"/></linearGradient>')
    body = (f'<rect width="{W}" height="620" fill="url(#sky)"/><rect y="620" width="{W}" height="{H - 620}" fill="url(#sea)"/>{stars}'
            f'<rect x="0" y="617" width="{W}" height="6" fill="{GOLD}" opacity=".5" filter="url(#glow)"/>'
            f'<rect x="0" y="619" width="{W}" height="2" fill="{GOLD}"/>'
            f'<rect x="{cx - 160}" y="640" width="320" height="2" fill="{GOLD}" opacity=".35"/>'
            f'<rect x="{cx - 90}" y="664" width="180" height="2" fill="{GOLD}" opacity=".22"/>')
    svg("horizont.svg", body, defs)

    # 4 Sternenfeld
    random.seed(21)
    neb = (f'<radialGradient id="n1" cx="30%" cy="35%" r="45%"><stop offset="0" stop-color="#2a4a7a" stop-opacity=".55"/><stop offset="1" stop-color="#2a4a7a" stop-opacity="0"/></radialGradient>'
           f'<radialGradient id="n2" cx="72%" cy="62%" r="40%"><stop offset="0" stop-color="#1f6f6a" stop-opacity=".4"/><stop offset="1" stop-color="#1f6f6a" stop-opacity="0"/></radialGradient>')
    st = "".join(f'<circle cx="{random.uniform(0, W):.0f}" cy="{random.uniform(0, H):.0f}" r="{random.uniform(.5, 2.1):.1f}" fill="{BEIGE}" opacity="{random.uniform(.2, .95):.2f}"/>' for _ in range(260))
    big = "".join(f'<circle cx="{random.uniform(80, W - 80):.0f}" cy="{random.uniform(80, H - 80):.0f}" r="3.2" fill="{GOLD}" filter="url(#glow)"/>' for _ in range(9))
    svg("sternenfeld.svg", f'<rect width="{W}" height="{H}" fill="{DEEP}"/><rect width="{W}" height="{H}" fill="url(#n1)"/><rect width="{W}" height="{H}" fill="url(#n2)"/>{st}{big}', neb)

    # 5 Wellen (Theta)
    waves = ""
    for k in range(8):
        amp = 150 - k * 16
        ph = k * 0.55
        y0 = 500 + (k - 3.5) * 22
        pts = " ".join(f"{x},{y0 + amp * math.sin(x / W * 2 * math.pi * 1.5 + ph) * math.sin(x / W * math.pi):.1f}" for x in range(0, W + 1, 8))
        col = CYAN if k % 2 == 0 else GOLD
        waves += f'<polyline points="{pts}" fill="none" stroke="{col}" stroke-width="2" opacity="{.9 - k * .08:.2f}"/>'
    svg("wellen-theta.svg", rect_bg() + waves, bg("#13213c", DEEP))

    # 6 Himmel & Wolken (gedämpft, blendet im dunklen Raum nicht)
    clouds = "".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{BEIGE}" opacity="{o}" filter="url(#soft)"/>'
                     for x, y, rx, ry, o in [(800, 470, 380, 90, .5), (560, 560, 260, 60, .35), (1060, 540, 300, 70, .38), (820, 380, 220, 50, .3), (330, 330, 200, 40, .18), (1330, 650, 220, 45, .2)])
    defs = ('<radialGradient id="sky2" cx="50%" cy="48%" r="70%"><stop offset="0" stop-color="#9dbbe0"/><stop offset=".5" stop-color="#3d639b"/>'
            f'<stop offset="1" stop-color="{NAVY}"/></radialGradient><filter id="soft" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="34"/></filter>')
    svg("himmel-wolken.svg", f'<rect width="{W}" height="{H}" fill="url(#sky2)"/>{clouds}', defs)

    # 7 Tunnel (Rechtecke)
    rects = ""
    for k in range(16):
        s = 1.0 * 0.80 ** k
        w, h = W * 0.96 * s, H * 0.96 * s
        col = GOLD if k % 2 == 0 else CYAN
        op = max(.15, .9 - k * .045)
        rects += (f'<rect x="{cx - w / 2:.1f}" y="{cy - h / 2:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{14 * s:.1f}" fill="none" stroke="{col}" stroke-width="{max(1, 4 * s):.1f}" opacity="{op:.2f}"/>')
    svg("tunnel-rechtecke.svg", rect_bg() + rects, bg("#0f1a33", DEEP))
    print("Bilder:", len(os.listdir(IMG)))


# ---------------------------------------------------------------- Video
VW, VH, FPS = 960, 600, 20
BGC = np.array([7, 10, 20], dtype=np.float32)
yy, xx = np.mgrid[0:VH, 0:VW].astype(np.float32)
X = (xx - VW / 2) / (VH / 2)
Y = (yy - VH / 2) / (VH / 2)
R = np.hypot(X, Y)
TH = np.arctan2(Y, X)
rng = np.random.default_rng(3)
GRAIN = rng.normal(0, 1.3, (VH, VW, 1)).astype(np.float32)  # festes Korn gegen Farbbanding


def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def to_rgb(I, col):
    c = np.array(col, dtype=np.float32)
    img = BGC + I[..., None] * (c - BGC)
    return np.clip(img + GRAIN, 0, 255).astype(np.uint8)


def render(name, seconds, frame_fn):
    out = os.path.join(VID, name)
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{VW}x{VH}", "-r", str(FPS),
           "-i", "-", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = seconds * FPS
    for i in range(n):
        p.stdin.write(frame_fn(i / n).tobytes())  # u = Loop-Phase 0..1
    p.stdin.close()
    p.wait()
    print(name, round(os.path.getsize(out) / 1024), "KB")


def tunnel(u):
    z = 1 / (R + 0.18)
    ph = 1.5 * z - 2 * u  # 2 volle Ringabstände je Loop
    I = (0.5 + 0.5 * np.cos(2 * math.pi * ph)) ** 2
    I *= smooth(0.05, 0.4, R) * np.clip(1.2 - 0.7 * R, 0, 1)
    return to_rgb(I * 0.85, (70, 190, 185))


def spirale(u):
    ph = 5 * TH + 2.6 * np.log(R + 0.06) - 2 * math.pi * u
    I = (0.5 + 0.5 * np.cos(ph)) ** 1.6
    I *= smooth(0.03, 0.35, R) * np.clip(1.15 - 0.75 * R, 0, 1)
    return to_rgb(I * 0.8, (212, 165, 116))


def wellen(u):
    a = 2 * math.pi
    ph = Y * 3.2 + 0.28 * np.sin(a * (X * 0.9 + u)) + 0.16 * np.sin(a * (X * 1.7 - 2 * u)) - u
    I = (0.5 + 0.5 * np.sin(a * ph)) ** 2.2
    I *= np.clip(1.25 - 0.55 * np.abs(Y) - 0.15 * np.abs(X), 0, 1)
    return to_rgb(I * 0.75, (60, 150, 200))


def atem(u):
    s = 0.5 - 0.5 * math.cos(2 * math.pi * u)  # 5 s ein, 5 s aus
    Rr = 0.26 + 0.2 * s
    ring = np.exp(-(((R - Rr) / 0.045) ** 2))
    disc = 0.35 * np.exp(-((R / (Rr * 1.15)) ** 2))
    halo = 0.18 * np.exp(-(((R - Rr) / 0.22) ** 2))
    I = np.clip(ring * 0.9 + disc + halo, 0, 1) * (0.55 + 0.45 * s)
    img = BGC + I[..., None] * (np.array([212, 175, 120], np.float32) - BGC) * 0.85
    return np.clip(img + GRAIN, 0, 255).astype(np.uint8)


def make_videos():
    render("tunnel.mp4", 12, tunnel)
    render("spirale-gold.mp4", 10, spirale)
    render("wellen.mp4", 10, wellen)
    render("atem-kreis.mp4", 10, atem)


# ---------------------------------------------------------------- Audio
SR, SEC = 44100, 30
N = SR * SEC
T = np.arange(N) / SR


def colored_noise(power, seed):
    """Periodisch (FFT mit Zufallsphasen) -> nahtlos loopbar. power=1 rosa, 2 braun."""
    r = np.random.default_rng(seed)
    f = np.fft.rfftfreq(N, 1 / SR)
    f[0] = 1
    spec = (1 / f ** (power / 2)) * np.exp(1j * r.uniform(0, 2 * np.pi, f.size))
    spec[0] = 0
    x = np.fft.irfft(spec, N)
    return x / np.max(np.abs(x))


def write_mp3(name, left, right, peak=0.32):
    st = np.stack([left, right], 1)
    st = st / np.max(np.abs(st)) * peak
    wav = os.path.join(AUD, name + ".wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())
    mp3 = os.path.join(AUD, name + ".mp3")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", "96k", mp3], check=True)
    os.remove(wav)
    print(name + ".mp3", round(os.path.getsize(mp3) / 1024), "KB")


def make_audio():
    brown = colored_noise(2, 1)
    brown2 = colored_noise(2, 2)
    tau = 2 * np.pi
    # Binaurale Schwebung: links 200 Hz, rechts 200+X Hz (nur mit Kopfhörer wirksam)
    for name, df in (("theta-6hz", 6), ("alpha-10hz", 10)):
        L = np.sin(tau * 200 * T) + 0.35 * brown
        R_ = np.sin(tau * (200 + df) * T) + 0.35 * brown2
        write_mp3(name, L, R_)
    write_mp3("rauschen-ruhig", colored_noise(2, 5), colored_noise(2, 6), peak=0.45)
    mod = 1 + 0.18 * np.sin(tau * T / 15)
    drone = (np.sin(tau * 55 * T) + 0.5 * np.sin(tau * 110 * T) + 0.3 * np.sin(tau * 82.5 * T) + 0.18 * np.sin(tau * 165 * T)) * mod
    write_mp3("drone-tief", drone + 0.25 * brown, drone + 0.25 * brown2)


if __name__ == "__main__":
    what = sys.argv[1:] or ["img", "video", "audio"]
    if "img" in what: make_images()
    if "video" in what: make_videos()
    if "audio" in what: make_audio()
