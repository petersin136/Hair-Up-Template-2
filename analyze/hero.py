from PIL import Image
import numpy as np

SRC = "/Users/seung-yongmaegbug/.cursor/projects/Users-seung-yongmaegbug-Documents-GitHub-Hair-Up-Template-2-Hair-Up-Template-2/assets/260716_HU_TEMPLATE_01-3_HERO_______ABOUT-8b10feee-cb3d-47fb-96e6-ba428525cba9.png"

img = Image.open(SRC).convert("RGB")
W, H = img.size
a = np.asarray(img).astype(np.int32)
print("size", W, H)

SCALE = 1440.0 / W
print("scale (design/src)", round(SCALE, 4), "=> design height", round(H * SCALE))


def hexc(rgb):
    return "#{:02x}{:02x}{:02x}".format(*[int(round(c)) for c in rgb])


def sample(x, y, r=2):
    x0, x1 = max(0, x - r), min(W, x + r + 1)
    y0, y1 = max(0, y - r), min(H, y + r + 1)
    patch = a[y0:y1, x0:x1].reshape(-1, 3)
    return patch.mean(axis=0)


# Background samples in obviously empty dark zones
bg_points = [(20, 200), (420, 200), (20, 500), (420, 700), (200, 470)]
print("\n-- background samples --")
for (x, y) in bg_points:
    c = sample(x, y)
    print(f"  ({x},{y}) {hexc(c)}  rgb={tuple(int(v) for v in c)}")

# Brightness (luma) map
luma = (0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2])

# Row projection: max brightness per row (to find content bands)
row_max = luma.max(axis=1)
row_mean = luma.mean(axis=1)
print("\n-- row brightness (every 8px, src coords) --")
for y in range(0, H, 8):
    dy = round(y * SCALE)
    bar = int(row_mean[y] / 4)
    print(f"y={y:4d} (d{dy:4d})  mean={row_mean[y]:6.1f} max={row_max[y]:6.1f} {'#'*bar}")
