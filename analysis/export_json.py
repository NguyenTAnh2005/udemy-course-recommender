# analysis/export_json.py
"""Xuất JSON cho React dashboard từ clustered_data.csv + các file output."""
from pathlib import Path
import json

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "web" / "frontend" / "public" / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# --- Phải khớp với kmeans.py ---
FEATURES = ["price_list", "rating", "num_ratings", "hours", "lectures", "discount_pct"]
LOG_COLS = ["price_list", "num_ratings", "hours", "lectures"]
RANDOM_STATE = 42          # đổi cho giống kmeans.py nếu khác
K_RANGE = range(2, 9)

# Tên cụm: sửa tùy ý (gắn với id cụm hiện tại)
CLUSTER_NAMES = {
    0: ("Khóa flagship, đông học viên", "Giá gốc cao, nhiều đánh giá, giảm giá sâu (~81%), nội dung dài."),
    1: ("Khóa nhỏ, ít dữ liệu đánh giá", "Rating thấp nhất nhưng chỉ có rất ít lượt đánh giá."),
    2: ("Khóa ngắn nhập môn", "Ngắn nhất (~2,5 giờ), rating tốt, nhiều Beginner."),
    3: ("Khóa chuyên sâu, dài hạn", "Dài nhất (~16,5 giờ), phần lớn là lập trình (Python, Web)."),
}

LEVEL_ORDER = ["Beginner", "Intermediate", "Expert", "All Levels"]
PRICE_BINS = [0, 249_000, 349_000, 499_000, np.inf]
PRICE_LABELS = ["≤ 249k", "250k–349k", "350k–499k", "≥ 500k"]


def dump(name, obj):
    path = OUT_DIR / name
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2, allow_nan=False)
    print(f"✔ {path.relative_to(ROOT)} ({path.stat().st_size / 1024:.1f} KB)")


def crosstab_rows(df, col, order=None):
    ct = pd.crosstab(df["cluster"], df[col])
    if order is not None:
        ct = ct.reindex(columns=order, fill_value=0)
    keys = [str(k) for k in ct.columns]
    rows = []
    for cluster, r in ct.iterrows():
        row = {"cluster": int(cluster)}
        row.update({str(k): int(v) for k, v in r.items()})
        row["total"] = int(r.sum())
        rows.append(row)
    return {"keys": keys, "rows": rows}


# ---------- Đọc dữ liệu ----------
df = pd.read_csv(ROOT / "data" / "clustered_data.csv")
df["levels"] = df["levels"].fillna("Unknown")
profile = pd.read_csv(ROOT / "analysis" / "output" / "cluster_profile.csv", encoding="utf-8-sig")

# ---------- Ma trận đặc trưng giống kmeans.py ----------
X = df[FEATURES].copy()
X[LOG_COLS] = np.log1p(X[LOG_COLS])
X = StandardScaler().fit_transform(X)

# ---------- PCA 2D ----------
pca = PCA(n_components=2, random_state=RANDOM_STATE)
xy = pca.fit_transform(X)
df["pca_x"] = xy[:, 0].round(4)
df["pca_y"] = xy[:, 1].round(4)

# ---------- Silhouette / inertia theo K ----------
k_selection = []
for k in K_RANGE:
    km = KMeans(n_clusters=k, n_init=10, random_state=RANDOM_STATE).fit(X)
    k_selection.append({
        "k": k,
        "silhouette": round(float(silhouette_score(X, km.labels_)), 4),
        "inertia": round(float(km.inertia_), 1),
    })

sil_current = round(float(silhouette_score(X, df["cluster"])), 4)
print(f"Silhouette của nhãn hiện tại: {sil_current} (kỳ vọng ~0.2968)")

# ---------- 1) summary.json ----------
dump("summary.json", {
    "n_courses": int(len(df)),
    "n_clusters": int(df["cluster"].nunique()),
    "silhouette": sil_current,
    "k_selection": k_selection,
    "topics": sorted(df["topic"].unique().tolist()),
    "features": FEATURES,
    "pca_explained": [round(float(v), 4) for v in pca.explained_variance_ratio_],
})

# ---------- 2) clusters.json ----------
clusters = []
for _, r in profile.iterrows():
    c = int(r["cluster"])
    item = {k: (None if pd.isna(v) else float(v)) for k, v in r.items()}
    item["cluster"] = c
    item["n_courses"] = int(r["n_courses"])
    item["name"], item["description"] = CLUSTER_NAMES.get(c, (f"Cụm {c}", ""))
    clusters.append(item)
dump("clusters.json", clusters)

# ---------- 3) breakdown.json ----------
df["price_bin"] = pd.cut(df["price_now"], bins=PRICE_BINS, labels=PRICE_LABELS, include_lowest=True)

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
    "price_now_stats": json.loads(price_stats.to_json(orient="records")),
})

# ---------- 4) courses.json (bảng tra cứu + scatter PCA) ----------
cols = ["title", "url", "topic", "levels", "rating", "num_ratings", "hours",
        "lectures", "price_now", "price_list", "discount_pct", "cluster", "pca_x", "pca_y"]
courses = json.loads(df[cols].to_json(orient="records", force_ascii=False))
dump("courses.json", courses)