# analysis/export_json.py
"""Xuất JSON cho React dashboard từ clustered_data.csv + cluster_profile.csv.

Chạy (sau kmeans.py):  python analysis/export_json.py

Cấu hình đặc trưng / log / seed / K_RANGE được import từ kmeans.py
để hai file luôn khớp nhau, không phải sửa hai nơi.
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score

from kmeans import FEATURES, K_RANGE, SEED, preprocess  # cùng thư mục analysis/

ROOT = Path(__file__).resolve().parent.parent
CLUSTERED_CSV = ROOT / "data" / "clustered_data.csv"
PROFILE_CSV = ROOT / "analysis" / "output" / "cluster_profile.csv"
OUT_DIR = ROOT / "web" / "frontend" / "public" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ----------------------------------------------------------------------
# CẤU HÌNH
# ----------------------------------------------------------------------
# Khóa là id cụm trong clustered_data.csv (K=3, seed=42).
# Nếu chạy lại kmeans.py với K/seed khác, id có thể đổi -> phải sửa lại.
CLUSTER_NAMES: dict[int, tuple[str, str]] = {
    0: ("Khóa ngắn, nhập môn",
        "Ngắn nhất (median ~2,5 giờ, 28 bài giảng), ít đánh giá, giảm giá vừa (~38%). "
        "Phần lớn thuộc Business, Design, English; tỉ lệ Beginner cao nhất (31%)."),
    1: ("Khóa dài, thiên về lập trình",
        "Dài (median ~14 giờ, ~120 bài giảng), giá niêm yết như cụm 0 (~399k), rating thấp nhất (4,41). "
        "63% là Web Development và Python."),
    2: ("Khóa flagship, đông học viên",
        "Giá niêm yết cao (~1,4 triệu) nhưng giảm sâu (~80%), nhiều đánh giá nhất "
        "(median 2.316) và rating cao nhất (4,56). Giá thực trả vẫn gần các cụm khác."),
}

LEVEL_ORDER = ["Beginner", "Intermediate", "Expert", "All Levels"]

# Giá thực trả: gần như mọi khóa nằm ở ~229k-259k nên bin này ít phân biệt cụm
PRICE_BINS = [0, 249_000, 349_000, 499_000, np.inf]
PRICE_LABELS = ["≤ 249k", "250k–349k", "350k–499k", "≥ 500k"]

# Giá niêm yết: phân biệt rõ cụm flagship (~1,4 triệu)
LIST_BINS = [0, 399_000, 799_000, 1_199_000, np.inf]
LIST_LABELS = ["≤ 399k", "400k–799k", "800k–1,199k", "≥ 1,2tr"]


# ----------------------------------------------------------------------
# HÀM PHỤ
# ----------------------------------------------------------------------
def dump(name: str, obj) -> None:
    path = OUT_DIR / name
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2, allow_nan=False)
    print(f"✔ {path.relative_to(ROOT)} ({path.stat().st_size / 1024:.1f} KB)")


def crosstab_rows(df: pd.DataFrame, col: str, order: list[str] | None = None) -> dict:
    """Bảng chéo cụm x col -> {"keys": [...], "rows": [{cluster, <key>: n, ..., total}]}."""
    ct = pd.crosstab(df["cluster"], df[col])
    if order is not None:
        # giữ thứ tự mong muốn, thêm các giá trị lạ (vd "Null") để total không bị hụt
        extras = [c for c in ct.columns if c not in order]
        ct = ct.reindex(columns=order + extras, fill_value=0)
    rows = []
    for cluster, r in ct.iterrows():
        row = {"cluster": int(cluster)}
        row.update({str(k): int(v) for k, v in r.items()})
        row["total"] = int(r.sum())
        rows.append(row)
    return {"keys": [str(k) for k in ct.columns], "rows": rows}


# ----------------------------------------------------------------------
# 1. ĐỌC DỮ LIỆU
# ----------------------------------------------------------------------
df = pd.read_csv(CLUSTERED_CSV)
df["levels"] = df["levels"].fillna("Null")
profile = pd.read_csv(PROFILE_CSV, encoding="utf-8-sig")

cluster_ids = sorted(int(c) for c in df["cluster"].unique())
n_k = len(cluster_ids)
print(f"Đọc {len(df)} khóa, {n_k} cụm: {cluster_ids}")

if CLUSTER_NAMES and set(CLUSTER_NAMES) != set(cluster_ids):
    raise SystemExit(
        f"CLUSTER_NAMES có id {sorted(CLUSTER_NAMES)} nhưng dữ liệu có cụm {cluster_ids}. Hãy sửa lại."
    )
if not CLUSTER_NAMES:
    print("⚠ CLUSTER_NAMES đang trống -> dùng tên tạm 'Cụm <id>'.")

# ----------------------------------------------------------------------
# 2. MA TRẬN ĐẶC TRƯNG (dùng đúng preprocess của kmeans.py) + PCA 2D
# ----------------------------------------------------------------------
Xs, _ = preprocess(df)

pca = PCA(n_components=2, random_state=SEED)
xy = pca.fit_transform(Xs)
df["pca_x"] = xy[:, 0].round(4)
df["pca_y"] = xy[:, 1].round(4)

# ----------------------------------------------------------------------
# 3. SILHOUETTE / INERTIA THEO K
# ----------------------------------------------------------------------
k_selection = []
for k in K_RANGE:
    km = KMeans(n_clusters=k, n_init=10, random_state=SEED).fit(Xs)
    k_selection.append({
        "k": k,
        "silhouette": round(float(silhouette_score(Xs, km.labels_)), 4),
        "inertia": round(float(km.inertia_), 1),
    })

sil_current = round(float(silhouette_score(Xs, df["cluster"])), 4)
sil_scan = next((x["silhouette"] for x in k_selection if x["k"] == n_k), None)
print(f"Silhouette nhãn hiện tại (K={n_k}): {sil_current} | bảng quét K: {sil_scan} "
      f"(chênh nhỏ là bình thường vì n_init khác nhau)")

# ----------------------------------------------------------------------
# 4. summary.json
# ----------------------------------------------------------------------
dump("summary.json", {
    "n_courses": int(len(df)),
    "n_clusters": n_k,
    "silhouette": sil_current,
    "k_selection": k_selection,
    "topics": sorted(df["topic"].unique().tolist()),
    "features": FEATURES,
    "pca_explained": [round(float(v), 4) for v in pca.explained_variance_ratio_],
})

# ----------------------------------------------------------------------
# 5. clusters.json
# ----------------------------------------------------------------------
clusters = []
for _, r in profile.sort_values("cluster").iterrows():
    c = int(r["cluster"])
    item = {k: (None if pd.isna(v) else float(v)) for k, v in r.items()}
    item["cluster"] = c
    item["n_courses"] = int(r["n_courses"])
    item["name"], item["description"] = CLUSTER_NAMES.get(c, (f"Cụm {c}", ""))
    clusters.append(item)
dump("clusters.json", clusters)

# ----------------------------------------------------------------------
# 6. breakdown.json
# ----------------------------------------------------------------------
df["price_bin"] = pd.cut(df["price_now"], bins=PRICE_BINS, labels=PRICE_LABELS, include_lowest=True)
df["list_bin"] = pd.cut(df["price_list"], bins=LIST_BINS, labels=LIST_LABELS, include_lowest=True)

price_stats = (
    df.groupby("cluster")["price_now"]
    .agg(count="count", mean="mean",
         p25=lambda s: s.quantile(0.25), median="median",
         p75=lambda s: s.quantile(0.75), max="max")
    .round(0).reset_index()
)

dump("breakdown.json", {
    "topic_by_cluster": crosstab_rows(df, "topic"),
    "level_by_cluster": crosstab_rows(df, "levels", LEVEL_ORDER),
    "price_bin_by_cluster": crosstab_rows(df, "price_bin", PRICE_LABELS),
    "price_list_bin_by_cluster": crosstab_rows(df, "list_bin", LIST_LABELS),  # MỚI
    "price_now_stats": json.loads(price_stats.to_json(orient="records")),
})

# ----------------------------------------------------------------------
# 7. courses.json (bảng tra cứu + scatter PCA)
# ----------------------------------------------------------------------
COURSE_COLS = ["title", "url", "topic", "levels", "rating", "num_ratings", "hours",
               "lectures", "price_now", "price_list", "discount_pct", "cluster", "pca_x", "pca_y"]
dump("courses.json", json.loads(df[COURSE_COLS].to_json(orient="records", force_ascii=False)))