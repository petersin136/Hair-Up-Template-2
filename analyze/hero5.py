from PIL import Image
import numpy as np

SRC = "/Users/seung-yongmaegbug/.cursor/projects/Users-seung-yongmaegbug-Documents-GitHub-Hair-Up-Template-2-Hair-Up-Template-2/assets/260716_HU_TEMPLATE_01-3_HERO_______ABOUT-8b10feee-cb3d-47fb-96e6-ba428525cba9.png"
img = Image.open(SRC).convert("RGB")
W, H = img.size
a = np.asarray(img).astype(np.float64)
S = 1440.0 / W
luma = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
mask = luma > 10


def d(v):
    return int(round(v * S))


def hexc(rgb):
    return "#{:02x}{:02x}{:02x}".format(*[int(round(c)) for c in rgb])


def bbox_region(y0s, y1s, x0s, x1s, cov=0.4):
    """bounding box of solid content within a src subregion using column/row coverage."""
    reg = mask[y0s:y1s, x0s:x1s]
    if reg.sum() == 0:
        return None
    colcov = reg.mean(axis=0)
    rowcov = reg.mean(axis=1)
    cols = np.where(colcov > cov)[0]
    rows = np.where(rowcov > cov)[0]
    if len(cols) == 0 or len(rows) == 0:
        return None
    return (x0s + cols.min(), y0s + rows.min(), x0s + cols.max(), y0s + rows.max())


def brightest_color(y0s, y1s, x0s, x1s, topn=40):
    reg = a[y0s:y1s, x0s:x1s].reshape(-1, 3)
    l = 0.299 * reg[:, 0] + 0.587 * reg[:, 1] + 0.114 * reg[:, 2]
    idx = np.argsort(l)[-topn:]
    return reg[idx].mean(axis=0)


def show(name, box):
    if box is None:
        print("  %-16s : none" % name)
        return
    x0, y0, x1, y1 = box
    print("  %-16s : d(%4d,%4d)-(%4d,%4d)  %4dx%4d  cx%4d cy%4d" % (
        name, d(x0), d(y0), d(x1), d(y1), d(x1 - x0 + 1), d(y1 - y0 + 1),
        d((x0 + x1) / 2), d((y0 + y1) / 2)))


print("=== HERO IMAGE (solid block) ===")
hero = bbox_region(120, 330, 120, 320, cov=0.6)
show("hero_image", hero)
if hero:
    x0, y0, x1, y1 = hero
    print("    color sample center:", hexc(a[(y0 + y1) // 2, (x0 + x1) // 2]))

print("\n=== TITLE 'Hair up' ===")
title = bbox_region(15, 128, 60, 440, cov=0.02)
show("title", title)
if title:
    print("    title color(bright):", hexc(brightest_color(*[title[1], title[3], title[0], title[2]])))

print("\n=== NAV BAR (y src 12..30) ===")
navrow = mask[14:28]
cols = navrow.sum(axis=0) > 0
xs = np.where(cols)[0]
# left link group vs right button by gap
segs = []
if len(xs):
    s = p = xs[0]
    for x in xs[1:]:
        if x - p > 12:
            segs.append((s, p)); s = x
        p = x
    segs.append((s, p))
for (sx, ex) in segs:
    print("  nav seg d%4d..%4d (w%4d)" % (d(sx), d(ex), d(ex - sx + 1)))
# BOOK NOW button box: rightmost seg, get its vertical extent & bg
if segs:
    bsx, bex = segs[-1]
    colreg = mask[10:34, bsx - 3:bex + 4]
    rows = np.where(colreg.mean(axis=1) > 0.2)[0]
    print("  BOOK NOW btn: x d%4d..%4d  y d%4d..%4d" % (d(bsx), d(bex), d(10 + (rows.min() if len(rows) else 0)), d(10 + (rows.max() if len(rows) else 0))))
    print("    nav-left color:", hexc(brightest_color(14, 28, segs[0][0], segs[0][1])))
    print("    btn text color:", hexc(brightest_color(14, 28, bsx, bex)))
    # button bg = median of button area minus text
    reg = a[16:26, bsx:bex].reshape(-1, 3)
    print("    btn area mean:", hexc(reg.mean(axis=0)))

print("\n=== PAGINATION (right, x src 410..444) ===")
pag = bbox_region(180, 240, 410, 444, cov=0.02)
show("pagination", pag)

print("\n=== CAPTION / HEADINGS / PARAGRAPH colors ===")
print("  caption 'Visual Artist':", hexc(brightest_color(349, 358, 180, 270)))
print("  heading line1        :", hexc(brightest_color(365, 388, 120, 320)))
print("  heading line2        :", hexc(brightest_color(391, 414, 120, 320)))
print("  kr paragraph         :", hexc(brightest_color(427, 458, 150, 290)))

print("\n=== COLLAGE IMAGES ===")
img2 = bbox_region(505, 648, 150, 300, cov=0.5)
show("IMG2 center", img2)
img3 = bbox_region(648, 858, 40, 210, cov=0.5)
show("IMG3 left", img3)
img4 = bbox_region(785, 1000, 235, 400, cov=0.5)
show("IMG4 btmright", img4)
print("\n  PORTRAITS of HAIR text:")
show("txt_portraits", bbox_region(700, 770, 320, 410, cov=0.02))
print("  THE ART of DETAILS text:")
show("txt_theart", bbox_region(925, 1000, 40, 130, cov=0.02))
