# analysis/level_price.py
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "analysis" / "output"
pd.set_option("display.width", 200)

df = pd.read_csv(ROOT / "data" / "clustered_data.csv")
print("Cột:", df.columns.tolist())

# 1) level x cụm
lv_n = pd.crosstab(df["cluster"], df["levels"])
lv_row = (pd.crosstab(df["cluster"], df["levels"], normalize="index") * 100).round(1)   # trong mỗi cụm
lv_col = (pd.crosstab(df["cluster"], df["levels"], normalize="columns") * 100).round(1) # mỗi level nằm ở cụm nào

# 2) price_now x cụm
price = df.groupby("cluster")["price_now"].describe().round(0)

for name, t in [("level_by_cluster_n", lv_n), ("level_by_cluster_pct_row", lv_row),
                ("level_by_cluster_pct_col", lv_col), ("price_now_by_cluster", price)]:
    print(f"\n== {name} ==\n{t}")
    t.to_csv(OUT / f"{name}.csv", encoding="utf-8-sig")