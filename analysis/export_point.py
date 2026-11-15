# analysis/export_points.py
"""Xuất points.json để vẽ sơ đồ K-means (PCA 2D) trên dashboard.

Chạy (sau kmeans.py):  python analysis/export_points.py
"""
import json
from pathlib import Path

import pandas as pd
from sklearn.decomposition import PCA

from kmeans import SEED, preprocess  # dùng chung tiền xử lý + seed với kmeans.py

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "clustered_data.csv"
OUT = ROOT / "web" / "frontend" / "public" / "data" / "points.json"

df = pd.read_csv(SRC).reset_index(drop=True)

Xs, _ = preprocess(df)
pca = PCA(n_components=2, random_state=SEED)
xy = pca.fit_transform(Xs)
df["x"] = xy[:, 0].round(4)
df["y"] = xy[:, 1].round(4)

points = [
    {
        "id": int(i),
        "x": float(r.x),
        "y": float(r.y),
        "cluster": int(r.cluster),
        "title": r.title,
        "topic": r.topic,
    }
    for i, r in df.iterrows()
]

# Tâm mỗi cụm trong không gian PCA (trung bình tọa độ các điểm của cụm)
centroids = [
    {"cluster": int(c), "x": round(float(g["x"].mean()), 4), "y": round(float(g["y"].mean()), 4),
     "n": int(len(g))}
    for c, g in df.groupby("cluster")
]

OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(
        {
            "explained_variance": [round(float(v), 4) for v in pca.explained_variance_ratio_],
            "centroids": centroids,
            "points": points,
        },
        f,
        ensure_ascii=False,
        allow_nan=False,
    )

print(f"Đã ghi {len(points)} điểm, {len(centroids)} cụm -> {OUT}")
print("Phương sai giải thích:", pca.explained_variance_ratio_.round(4))