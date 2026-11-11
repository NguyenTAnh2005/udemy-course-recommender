"""
clean.py - Làm sạch dữ liệu khóa học Udemy trước khi chạy K-means.

Đọc : data/raw_data.csv
Ghi : data/clean_data.csv

Chạy (từ thư mục CODE):  python analysis/clean.py
"""

from pathlib import Path

import numpy as np
import pandas as pd

# ----------------------------------------------------------------------
# CẤU HÌNH
# ----------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_PATH = BASE_DIR / "data" / "raw_data.csv"
CLEAN_PATH = BASE_DIR / "data" / "clean_data.csv"

# True  = giữ khóa Free (price = 0, discount = 0) như một nhóm riêng
# False = bỏ khóa Free, chỉ phân cụm khóa trả phí
KEEP_FREE = False

# 6 thuộc tính dùng cho K-means
FEATURES = ["price_list", "rating", "num_ratings", "hours", "lectures", "discount_pct"]

# Tên cột có thể khác nhau tùy script cào -> đổi về tên chuẩn
RENAME_MAP = {
    "ratings": "rating",
    "num_rating": "num_ratings",
    "level": "levels",
    "course_title": "title",
    "name": "title",
}


def log(step: str, df: pd.DataFrame, prev: int | None = None) -> int:
    n = len(df)
    diff = f"  (-{prev - n})" if prev is not None and prev != n else ""
    print(f"[{step}] {n} dòng{diff}")
    return n


def main() -> None:
    # ------------------------------------------------------------------
    # 1. Đọc dữ liệu + chuẩn hóa tên cột
    # ------------------------------------------------------------------
    df = pd.read_csv(RAW_PATH, encoding="utf-8-sig")
    df.columns = [c.strip().lower() for c in df.columns]
    df = df.rename(columns=RENAME_MAP)
    print("Các cột:", list(df.columns))
    n = log("Đọc file gốc", df)

    # ------------------------------------------------------------------
    # 2. Xóa dòng trùng
    # ------------------------------------------------------------------
    if "url" in df.columns:
        # bỏ phần ?query và dấu "/" cuối để cùng một khóa không bị coi là khác nhau
        url_key = df["url"].astype(str).str.split("?").str[0].str.rstrip("/").str.lower()
        df = df[~url_key.duplicated(keep="first")]
        label = "url"
    else:
        df = df.drop_duplicates(subset="title" if "title" in df.columns else None)
        label = "title"
    n = log(f"Xóa trùng theo '{label}'", df, n)

    # ------------------------------------------------------------------
    # 3. Ép kiểu số cho các cột cần tính toán
    # ------------------------------------------------------------------
    num_cols = ["price_now", "price_list", "rating", "num_ratings", "hours", "lectures", "discount_pct"]
    for c in num_cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")
        else:
            df[c] = np.nan  # cột chưa có -> tạo trống, sẽ tính lại bên dưới

    # ------------------------------------------------------------------
    # 4. Khóa Free
    # ------------------------------------------------------------------
    is_free = df["price_now"].isna()
    if "price_now_raw" in df.columns:
        is_free |= (
            df["price_now_raw"].astype(str).str.strip().str.lower().isin(["free", "miễn phí"])
        )

    if KEEP_FREE:
        df.loc[is_free, ["price_now", "price_list", "discount_pct"]] = 0
        print(f"Giữ {int(is_free.sum())} khóa Free (giá = 0)")
    else:
        df = df[~is_free].copy()
        n = log("Bỏ khóa Free", df, n)

    # ------------------------------------------------------------------
    # 5. Giá gốc và tỉ lệ giảm giá
    #    - Không có giá gốc (khóa không giảm giá) -> giá gốc = giá hiện tại
    #    - discount_pct trống -> tính lại từ hai giá
    # ------------------------------------------------------------------
    df["price_list"] = df["price_list"].fillna(df["price_now"])

    calc_discount = (1 - df["price_now"] / df["price_list"]) * 100
    df["discount_pct"] = df["discount_pct"].fillna(calc_discount).round(1)
    df.loc[df["price_list"].eq(df["price_now"]), "discount_pct"] = 0

    # ------------------------------------------------------------------
    # 6. Cột mô tả (không dùng cho K-means): điền "Null"
    # ------------------------------------------------------------------
    if "levels" in df.columns:
        df["levels"] = df["levels"].fillna("Null")

    # ------------------------------------------------------------------
    # 7. Bỏ dòng thiếu một trong 6 thuộc tính K-means
    # ------------------------------------------------------------------
    print("\nSố ô thiếu theo thuộc tính (trước khi bỏ):")
    print(df[FEATURES].isna().sum().to_string(), "\n")
    df = df.dropna(subset=FEATURES)
    n = log("Bỏ dòng thiếu thuộc tính K-means", df, n)

    # ------------------------------------------------------------------
    # 8. Kiểm tra giá trị bất thường
    # ------------------------------------------------------------------
    valid = (
        (df["hours"] > 0)
        & (df["lectures"] > 0)
        & (df["num_ratings"] >= 0)
        & df["rating"].between(0, 5)
        & df["discount_pct"].between(0, 100)
        & (df["price_now"] <= df["price_list"])
    )
    if not KEEP_FREE:
        valid &= df["price_list"] > 0
    df = df[valid]
    n = log("Bỏ dòng giá trị bất thường", df, n)

    # ------------------------------------------------------------------
    # 9. Báo cáo + lưu file
    # ------------------------------------------------------------------
    if "topic" in df.columns:
        print("\nSố dòng còn lại theo chủ đề:")
        print(df["topic"].value_counts().to_string())

    print("\nThống kê mô tả 6 thuộc tính:")
    print(df[FEATURES].describe().round(2).to_string())

    df.to_csv(CLEAN_PATH, index=False, encoding="utf-8-sig")
    print(f"\nĐã lưu {len(df)} dòng -> {CLEAN_PATH}")


if __name__ == "__main__":
    main()