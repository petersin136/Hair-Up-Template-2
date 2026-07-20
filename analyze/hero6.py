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


def hexc(rgb):
    return "#{:02x}{:02x}{:02x}".format(*[int(round(c)) for c in rgb])


def box(y0, y1, x0, x1, th=25, cov=0.0):
    reg = luma[y0:y1, x0:x1] > th
    rows = np.where(reg.sum(axis=1) > 0)[0]
    cols = np.where(reg.sum(axis=0) > 0)[0]
    if len(rows) == 0:
        return None
    return (x0 + cols.min(), y0 + rows.min(), x0 + cols.max(), y0 + rows.max())


def show(n, b):
    if not b:
        print("  %-14s none" % n); return
    x0, y0, x1, y1 = b
    print("  %-14s d(%4d,%4d)-(%4d,%4d) %4dx%4d cx%4d" % (n, d(x0), d(y0), d(x1), d(y1), d(x1 - x0 + 1), d(y1 - y0 + 1), d((x0 + x1) / 2)))


print("TITLE box (y 55..126):")
t = box(55, 126, 40, 1320, th=40)
show("title", t)

print("\nNAV links (y 14..27), split by gaps>6src:")
navmask = luma[14:27] > 30
cols = np.where(navmask.sum(axis=0) > 0)[0]
segs = []
if len(cols):
    s = p = cols[0]
    for x in cols[1:]:
        if x - p > 6:
            segs.append((s, p)); s = x
        p = x
    segs.append((s, p))
for (sx, ex) in segs:
    print("  link d%4d..%4d w%4d" % (d(sx), d(ex), d(ex - sx + 1)))

print("\nBOOK NOW button rectangle (detect bg>#101010 in y 8..36, x 1150..1400):")
btnmask = luma[8:36, 355:444] > 12
rows = np.where(btnmask.sum(axis=1) > 3)[0]
cols = np.where(btnmask.sum(axis=0) > 3)[0]
if len(rows) and len(cols):
    print("  btn d(%4d,%4d)-(%4d,%4d) %dx%d" % (
        d(355 + cols.min()), d(8 + rows.min()), d(355 + cols.max()), d(8 + rows.max()),
        d(cols.max() - cols.min() + 1), d(rows.max() - rows.min() + 1)))

print("\nPagination color + box (y 200..220, x 405..444):")
p = box(198, 224, 405, 444, th=20)
show("pag", p)
if p:
    print("   pag color:", hexc(a[(p[1] + p[3]) // 2, (p[0] + p[2]) // 2] if False else a[210, 430]))

print("\nGlyph heights (src px) -> font-size est (design px = src*S):")
for name, (y0, y1, x0, x1) in {
    "title H": (58, 126, 40, 200),
    "caption": (349, 358, 180, 270),
    "headL1": (365, 388, 380, 480),
    "headL2": (391, 414, 380, 480),
    "krpara": (427, 435, 150, 290),
    "portraits": (700, 770, 320, 410),
    "theart": (925, 960, 40, 130),
}.items():
    reg = luma[y0:y1, x0:x1] > 40
    rows = np.where(reg.sum(axis=1) > 0)[0]
    if len(rows):
        gh = rows.max() - rows.min() + 1
        print("  %-10s glyph %2dpx src -> %3dpx design" % (name, gh, d(gh)))

print("\nColors (mean of bright pixels):")
def bc(y0, y1, x0, x1, topn=30):
    reg = a[y0:y1, x0:x1].reshape(-1, 3)
    l = 0.299 * reg[:, 0] + 0.587 * reg[:, 1] + 0.114 * reg[:, 2]
    idx = np.argsort(l)[-topn:]
    return hexc(reg[idx].mean(axis=0))
print("  kr paragraph:", bc(427, 456, 150, 290, topn=25))
print("  pagination  :", bc(198, 224, 405, 444, topn=15))
print("  nav left    :", bc(14, 27, 60, 280, topn=20))
print("  book now txt:", bc(14, 27, 355, 444, topn=15))
