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


def bands(mask_rows, min_gap=2, min_h=1):
    ys = np.where(mask_rows)[0]
    if len(ys) == 0:
        return []
    out = []
    start = ys[0]
    prev = ys[0]
    for y in ys[1:]:
        if y - prev > min_gap:
            if prev - start + 1 >= min_h:
                out.append((start, prev))
            start = y
        prev = y
    if prev - start + 1 >= min_h:
        out.append((start, prev))
    return out


TH = 35
content_rows = (luma > TH).sum(axis=1) > 1
print("=== ROW BANDS (threshold luma>%d) ===" % TH)
print("%-22s %-22s %s" % ("src y0..y1 (h)", "design y0..y1 (h)", "x-extent design"))
for (y0, y1) in bands(content_rows, min_gap=3, min_h=1):
    sub = luma[y0:y1 + 1]
    colmask = (sub > TH).sum(axis=0) > 0
    xs = np.where(colmask)[0]
    if len(xs) == 0:
        continue
    x0, x1 = xs.min(), xs.max()
    print("y %3d..%3d (%3d)   d %4d..%4d (%3d)   x d%4d..%4d (w%4d)  cx d%4d" % (
        y0, y1, y1 - y0 + 1,
        d(y0), d(y1), d(y1 - y0 + 1),
        d(x0), d(x1), d(x1 - x0 + 1), d((x0 + x1) / 2)))
