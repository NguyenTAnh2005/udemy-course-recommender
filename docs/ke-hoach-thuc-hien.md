## Các việc cần làm

**1. Phân tích sau K-means**

- Đặt tên và mô tả 4 cụm từ `cluster_profile.csv`.
- Lập bảng level × cụm và price_now × cụm từ `clustered_data.csv`.
- Giải thích topic × cụm từ `cluster_by_topic.csv`.
- Nhớ kiểm tra `clustered_data.csv` còn giữ các cột `level`, `price_now`, `topic`, `url`, `title`.

**2. Viết `analysis/export_json.py`**

Sinh các file trong `web/public/data/`:

- `summary.json`: số dòng, K, silhouette, silhouette theo K.
- `clusters.json`: tên cụm, kích thước, trung bình và median các thuộc tính.
- `breakdown.json`: topic × cụm, level × cụm, price_now × cụm (cả số lượng và %).
- `points.json`: toạ độ PCA và cụm của từng khóa học.
- `courses.json`: danh sách khóa học cho bảng tra cứu.

**3. Dựng dashboard React**

- Khởi tạo bằng Vite + React + Tailwind, dùng Recharts cho biểu đồ.
- Làm xong trang chính rồi mới thêm phần lọc. Bám theo bản vẽ HTML mockup ở bài thực hành 1 để khỏi sửa lại thiết kế.

**4. FastAPI, tùy chọn (nếu còn dư thời gian)**

- Thư mục `api/` có một endpoint đọc `clustered_data.csv` bằng pandas để lọc khóa học. Chỉ làm khi bước 3 đã xong và ổn.
