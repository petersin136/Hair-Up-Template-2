from PIL import Image
import numpy as np
import sys
sys.setrecursionlimit(10000)

SRC = "/Users/seung-yongmaegbug/.cursor/projects/Users-seung-yongmaegbug-Documents-GitHub-Hair-Up-Template-2-Hair-Up-Template-2/assets/260716_HU_TEMPLATE_01-3_HERO_______ABOUT-8b10feee-cb3d-47fb-96e6-ba428525cba9.png"
img = Image.open(SRC).convert("RGB")
W, H = img.size
a = np.asarray(img).astype(np.float64)
S = 1440.0 / W
luma = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]


def d(v):
    return int(round(v * S))


# mask: any non-near-black pixel
mask = luma > 10
# label connected components (4-conn) via iterative stack
labels = np.zeros((H, W), dtype=np.int32)
cur = 0
boxes = []
for yy in range(H):
    for xx in range(W):
        if mask[yy, xx] and labels[yy, xx] == 0:
            cur += 1
            stack = [(yy, xx)]
            labels[yy, xx] = cur
            minx = maxx = xx
            miny = maxy = yy
            area = 0
            while stack:
                cy, cx = stack.pop()
                area += 1
                if cx < minx:
                    minx = cx
                if cx > maxx:
                    maxx = cx
                if cy < miny:
                    miny = cy
                if cy > maxy:
                    maxy = cy
                for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                    if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and labels[ny, nx] == 0:
                        labels[ny, nx] = cur
                        stack.append((ny, nx))
            boxes.append((area, minx, miny, maxx, maxy))

# keep large blocks likely to be images (area big, and w,h reasonably large)
boxes.sort(reverse=True)
print("=== Large connected components (likely images), design coords ===")
print("%-6s %-26s %-14s %s" % ("area_d", "box d (x0,y0)-(x1,y1)", "w x h", "cx,cy"))
for area, x0, y0, x1, y1 in boxes:
    w = x1 - x0 + 1
    h = y1 - y0 + 1
    if w >= 30 and h >= 30 and area > 1500:
        print("%-6d (%4d,%4d)-(%4d,%4d)   %4dx%4d   cx%4d cy%4d" % (
            d(area) if False else int(area * S * S),
            d(x0), d(y0), d(x1), d(y1), d(w), d(h), d((x0 + x1) / 2), d((y0 + y1) / 2)))
