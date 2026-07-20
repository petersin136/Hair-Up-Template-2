from PIL import Image
import numpy as np

SRC = "/Users/seung-yongmaegbug/.cursor/projects/Users-seung-yongmaegbug-Documents-GitHub-Hair-Up-Template-2-Hair-Up-Template-2/assets/260716_HU_TEMPLATE_01-3_HERO_______ABOUT-8b10feee-cb3d-47fb-96e6-ba428525cba9.png"
img = Image.open(SRC).convert("RGB")
W, H = img.size
a = np.asarray(img).astype(np.float64)
S = 1440.0 / W
luma = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]


def d(v):
    return int(round(v * S))


def runs(mask, min_gap=2, min_len=2):
    idx = np.where(mask)[0]
    if len(idx) == 0:
        return []
    out = []
    s = p = idx[0]
    for i in idx[1:]:
        if i - p > min_gap:
            if p - s + 1 >= min_len:
                out.append((s, p))
            s = i
        p = i
    if p - s + 1 >= min_len:
        out.append((s, p))
    return out


print("=== REGION A: title vs hero image (y 50..330) ===")
sub = luma[50:331]
rowmask = (sub > 60).sum(axis=1) > 1
for (r0, r1) in runs(rowmask, min_gap=2, min_len=2):
    y0, y1 = r0 + 50, r1 + 50
    band = luma[y0:y1 + 1]
    cm = (band > 60).sum(axis=0) > 0
    xs = np.where(cm)[0]
    print("  y%3d..%3d d%4d..%4d(h%3d)  x d%4d..%4d(w%4d) cx d%4d" % (
        y0, y1, d(y0), d(y1), d(y1 - y0 + 1), d(xs.min()), d(xs.max()),
        d(xs.max() - xs.min() + 1), d((xs.min() + xs.max()) / 2)))

print("\n=== HERO IMAGE horizontal edges (row-by-row x-extent, y 130..320) ===")
for y in range(130, 321, 10):
    row = luma[y]
    cm = row > 30
    xs = np.where(cm)[0]
    if len(xs):
        print("  y%3d d%4d  x d%4d..%4d w%4d" % (y, d(y), d(xs.min()), d(xs.max()), d(xs.max() - xs.min() + 1)))

print("\n=== REGION B: collage (y 500..1000) column-segments per slice ===")
for y in range(505, 1000, 15):
    row = luma[y]
    segs = runs(row > 30, min_gap=6, min_len=4)
    if segs:
        seglabel = "  ".join("d%d..%d(w%d)" % (d(s), d(e), d(e - s + 1)) for s, e in segs)
        print("  y%3d d%4d : %s" % (y, d(y), seglabel))
