// Xuất dữ liệu đã tích lũy ra CSV, mỗi chủ đề một file (python.csv, web.csv, ...).
(() => {
  const TOPIC = 'all';        // tên chủ đề cần xuất, hoặc 'all' để xuất tất cả
  const CLEAR_AFTER = false;     // true: xóa các dòng vừa xuất khỏi bộ nhớ trình duyệt (chỉ bật sau khi đã kiểm tra file CSV)
  const KEY = 'udemy_courses';
  const COLS = ['url', 'title', 'topic', 'rating', 'num_ratings', 'hours', 'lectures', 'level',
                'price_now_raw', 'price_list_raw', 'price_now', 'price_list', 'collected'];

  const store = JSON.parse(localStorage.getItem(KEY) || '{}');
  const rows = Object.values(store).filter(r => TOPIC === 'all' || r.topic === TOPIC);
  if (!rows.length) {
    console.warn(`Không có dữ liệu cho chủ đề "${TOPIC}".`);
    return;
  }

  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = '\ufeff' + [COLS.join(','), ...rows.map(r => COLS.map(c => esc(r[c])).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = `${TOPIC}.csv`;
  a.click();
  console.log(`Đã xuất ${rows.length} dòng → ${TOPIC}.csv`);

  if (CLEAR_AFTER) {
    rows.forEach(r => delete store[r.url]);
    localStorage.setItem(KEY, JSON.stringify(store));
    console.log(`Đã xóa ${rows.length} dòng khỏi bộ nhớ. Còn lại: ${Object.keys(store).length}`);
  }
})();