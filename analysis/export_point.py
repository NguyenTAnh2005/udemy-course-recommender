# analysis/export_points.py
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "clustered_data.csv"
OUT = ROOT / "web" / "frontend" / "public" / "data" / "points.json"

FEATURES = ["price_list", "rating", "num_ratings", "hours", "lectures", "discount_pct"]
LOG_COLS = ["price_list", "num_ratings", "hours", "lectures"]

df = pd.read_csv(SRC)

X = df[FEATURES].copy()
X[LOG_COLS] = np.log1p(X[LOG_COLS])
X = StandardScaler().fit_transform(X)

pca = PCA(n_components=2, random_state=42)
xy = pca.fit_transform(X)

points = [
    {
        "id": int(i),
        "x": round(float(xy[i, 0]), 4),
        "y": round(float(xy[i, 1]), 4),
        "cluster": int(df.loc[i, "cluster"]),
        "title": df.loc[i, "title"],
        "topic": df.loc[i, "topic"],
    }
    for i in range(len(df))
]

OUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(
        {
            "explained_variance": [round(float(v), 4) for v in pca.explained_variance_ratio_],
            "points": points,
        },
        f,
        ensure_ascii=False,
    )

print(f"Đã ghi {len(points)} điểm -> {OUT}")
print("Phương sai giải thích:", pca.explained_variance_ratio_.round(4))