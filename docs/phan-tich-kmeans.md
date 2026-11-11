## Đặt tên 4 cụm

| Cụm       | Tên gợi ý                          | Đặc điểm nổi bật                                                                             |
| --------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| 0 (25,2%) | **Khóa flagship, đông học viên**   | Giá gốc cao nhất (~1,44 triệu), median 2.564 lượt đánh giá, giảm ~81%, dài (12 giờ, 107 bài) |
| 1 (10,6%) | **Khóa nhỏ, chưa được kiểm chứng** | Rating thấp nhất (4,0), median chỉ 41 lượt đánh giá, ngắn (4,5 giờ)                          |
| 2 (39,4%) | **Khóa ngắn, nhập môn**            | Ngắn nhất (2,5 giờ, 28 bài), rating tốt (4,5), lượng đánh giá vừa phải (74)                  |
| 3 (24,8%) | **Khóa chuyên sâu, dài hạn**       | Dài nhất (16,5 giờ, 135 bài), 169 lượt đánh giá, rating 4,5, giá gốc phổ thông               |

## Nhận xét chính

1. **Giảm giá tách thành hai kiểu rõ rệt.** Cụm 0 giảm ~81%, ba cụm còn lại giảm ~37,6%. Ước tính giá bán thực tế (giá gốc × (1 − giảm giá)) của cụm 0 là ~275k và của ba cụm kia ~249k, nghĩa là giá người học thực trả khá gần nhau dù giá gốc chênh lớn. Đây là gợi ý hay cho phần price_now, cần xác nhận bằng dữ liệu.
2. **Cụm 2 và 3 giống nhau về giá, rating, mức giảm giá, và khác nhau chủ yếu ở độ dài** (3,2 giờ so với 24 giờ). Nên diễn giải là "ngắn nhập môn" và "dài chuyên sâu".
3. **Cụm 1 là cụm cần nói thận trọng.** Rating trung bình 3,91 nhưng chỉ ~140 lượt đánh giá, nên chưa thể kết luận khóa kém chất lượng. Nên nói là "ít dữ liệu đánh giá".

## Chủ đề trong từng cụm (% theo cụm)

| Cụm | business | design | english  | python   | web      |
| --- | -------- | ------ | -------- | -------- | -------- |
| 0   | 13,7     | 17,5   | 23,5     | **29,4** | 15,9     |
| 1   | 18,6     | 22,4   | 12,2     | 18,6     | **28,2** |
| 2   | **28,2** | 23,2   | **26,5** | 10,3     | 11,7     |
| 3   | 10,1     | 13,4   | 12,1     | **30,7** | **33,7** |

Nhìn theo hướng ngược lại (mỗi chủ đề phân bố ra sao):

- **business, english, design** nằm nhiều nhất ở cụm 2: 58%, 51% và 48%. Chủ đề kinh doanh, ngôn ngữ và thiết kế chủ yếu là khóa ngắn nhập môn.
- **python và web** dồn vào cụm 0 và cụm 3 (python 35% và 36%, web 20% và 42%). Chủ đề lập trình có nhiều khóa dài và chuyên sâu. Riêng web development nghiêng về cụm 3 nhiều nhất.

## Lưu ý trung thực cho báo cáo

Silhouette K=4 chỉ 0,30, nghĩa là các cụm chồng lấn khá nhiều, đặc biệt cụm 2 và 3 trải trên một dải liên tục về độ dài. Nên nói đây là "các nhóm tương đối", đừng nói "phân tách rõ".

Phần level và price_now đã xong, kết quả như sau.

## Level × cụm

- **Cụm 3 (khóa chuyên sâu)** có 70,7% là "All Levels", cao nhất, và chỉ 4,7% Intermediate. Khóa dài ở đây thường được thiết kế cho mọi trình độ.
- **Cụm 1 (khóa nhỏ, ít đánh giá)** nghiêng về người mới nhất: 40,4% Beginner, cao nhất trong các cụm.
- **Cụm 2 (khóa ngắn nhập môn)** chiếm 45,5% tổng số khóa Beginner, trong khi toàn tập dữ liệu chỉ ~39% nằm ở cụm này. Hợp với việc đặt tên là "nhập môn".
- **Cụm 0 (flagship)** gom 35,6% khóa Intermediate và 35% khóa Expert (dù cụm này chỉ chiếm 25% tập dữ liệu), nên là nơi tập trung khóa nâng cao hơn trung bình.
- **Expert** chỉ có 20 khóa trong cả tập dữ liệu, quá ít để rút ra kết luận. Trong dashboard nên gộp chung Intermediate và Expert, hoặc ghi chú cỡ mẫu nhỏ.

## price_now × cụm

Giá bán hiện tại gần như **không phân biệt được các cụm**: median 249k ở cụm 1–3, riêng cụm 0 cao hơn một chút (269k). Điều này khớp nhận xét trước: khác biệt về giá gốc phần lớn bị mức giảm giá "xóa" đi. Các giá trị max 2,499 triệu ở cụm 2 và 3 là ngoại lệ, nên khi vẽ biểu đồ dùng median hoặc boxplot rồi cắt trục, đừng dùng mean.

Thông điệp cho báo cáo: cụm khác nhau ở **độ dài, độ phổ biến và chủ đề**, còn **giá người học thực trả thì gần như đồng đều**.
