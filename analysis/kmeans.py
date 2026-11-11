"""
analysis/kmeans.py - Chuẩn hóa + phân cụm K-means khóa học Udemy.

Chạy:
    python analysis/kmeans.py            # tự chọn K theo silhouette
    python analysis/kmeans.py --k 4      # ép K = 4 sau khi đã xem biểu đồ

Đầu vào : data/clean_data.csv
Đầu ra  : analysis/output/
            k_selection.png      (Elbow + Silhouette)
            clusters_pca.png     (cụm vẽ lên mặt phẳng PCA 2D)
            cluster_profile.csv  (đặc trưng trung bình/trung vị mỗi cụm)
            cluster_by_topic.csv (mỗi cụm có bao nhiêu khóa theo chủ đề)
          data/clustered_data.csv (clean_data + cột 'cluster')
"""
import argparse
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
OUT = ROOT / "analysis" / "output"
OUT.mkdir(parents=True, exist_ok=True)

# 6 thuộc tính dùng cho K-means
FEATURES = ["price_list", "rating", "num_ratings", "hours", "lectures", "discount_pct"]
# Các cột lệch phải mạnh -> log1p trước khi chuẩn hóa
LOG_COLS = ["price_list", "num_ratings", "hours", "lectures"]
K_RANGE = range(2, 11)
SEED = 42


def preprocess(df: pd.DataFrame):
    """log1p cho cột lệch, sau đó StandardScaler (mean=0, std=1)."""
    X = df[FEATURES].astype(float).copy()
    X[LOG_COLS] = np.log1p(X[LOG_COLS])
    scaler = StandardScaler()
    Xs = scaler.fit_transform(X)
    return Xs, X


def evaluate_k(Xs):
    inertias, sils = [], []
    for k in K_RANGE:
        km = KMeans(n_clusters=k, n_init=10, random_state=SEED).fit(Xs)
        inertias.append(km.inertia_)
        sils.append(silhouette_score(Xs, km.labels_))
        print(f"k={k:2d}  inertia={km.inertia_:9.1f}  silhouette={sils[-1]:.4f}")

    fig, ax = plt.subplots(1, 2, figsize=(11, 4))
    ax[0].plot(list(K_RANGE), inertias, "o-")
    ax[0].set(title="Elbow (inertia)", xlabel="K", ylabel="Inertia")
    ax[1].plot(list(K_RANGE), sils, "o-", color="tab:orange")
    ax[1].set(title="Silhouette score", xlabel="K", ylabel="Silhouette")
    for a in ax:
        a.grid(alpha=0.3)
    fig.tight_layout()
    fig.savefig(OUT / "k_selection.png", dpi=150)
    plt.close(fig)
    return list(K_RANGE)[int(np.argmax(sils))]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--k", type=int, default=None, help="số cụm (mặc định: K có silhouette cao nhất)")
    args = ap.parse_args()

    df = pd.read_csv(DATA / "clean_data.csv")
    print(f"Đọc {len(df)} dòng")

    Xs, X_log = preprocess(df)

    print("\n--- Chọn K ---")
    best_k = evaluate_k(Xs)
    k = args.k or best_k
    print(f"\nK tốt nhất theo silhouette: {best_k} | K dùng để phân cụm: {k}")

    km = KMeans(n_clusters=k, n_init=20, random_state=SEED).fit(Xs)
    df["cluster"] = km.labels_
    print(f"Silhouette (K={k}): {silhouette_score(Xs, km.labels_):.4f}")

    # --- Mô tả cụm theo thang đo GỐC (dễ đọc, dễ đưa lên báo cáo/dashboard) ---
    agg = {c: ["mean", "median"] for c in FEATURES}
    profile = df.groupby("cluster").agg(agg)
    profile.columns = [f"{c}_{s}" for c, s in profile.columns]
    profile.insert(0, "n_courses", df.groupby("cluster").size())
    profile.insert(1, "pct", (profile["n_courses"] / len(df) * 100).round(1))
    profile = profile.round(2)
    print("\n--- Đặc trưng mỗi cụm (thang gốc) ---")
    print(profile.T.to_string())

    by_topic = pd.crosstab(df["cluster"], df["topic"])
    print("\n--- Số khóa theo cụm x chủ đề ---")
    print(by_topic.to_string())

    # --- PCA 2D để vẽ ---
    pca = PCA(n_components=2, random_state=SEED)
    P = pca.fit_transform(Xs)
    fig, ax = plt.subplots(figsize=(7, 5.5))
    sc = ax.scatter(P[:, 0], P[:, 1], c=df["cluster"], cmap="tab10", s=12, alpha=0.7)
    ax.set(
        title=f"K-means (K={k}) trên mặt phẳng PCA",
        xlabel=f"PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)",
        ylabel=f"PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)",
    )
    ax.legend(*sc.legend_elements(), title="Cụm")
    ax.grid(alpha=0.3)
    fig.tight_layout()
    fig.savefig(OUT / "clusters_pca.png", dpi=150)
    plt.close(fig)

    profile.to_csv(OUT / "cluster_profile.csv", encoding="utf-8-sig")
    by_topic.to_csv(OUT / "cluster_by_topic.csv", encoding="utf-8-sig")
    df.to_csv(DATA / "clustered_data.csv", index=False, encoding="utf-8-sig")
    print(f"\nĐã lưu kết quả vào {OUT} và {DATA / 'clustered_data.csv'}")


if __name__ == "__main__":
    main()