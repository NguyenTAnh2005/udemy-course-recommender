// Thu thập các thẻ khóa học đang hiển thị trên trang kết quả tìm kiếm Udemy.
// Cách dùng: lưu vào DevTools > Sources > Snippets, mỗi trang kết quả bấm Run một lần.
(() => {
  const TOPIC = 'business';   // ← đổi cho mỗi chủ đề: python | web | english | design | business
  const KEY = 'udemy_courses';
  const hrefOf = a => a.href.split('?')[0].split('#')[0];

  // 1) Tìm từng thẻ khóa học
  const cards = new Set();
  document.querySelectorAll('a[href*="/course/"]').forEach(a => {
    let el = a;
    while (el.parentElement) {
      const hs = new Set([...el.parentElement.querySelectorAll('a[href*="/course/"]')].map(hrefOf));
      if (hs.size > 1) break;
      el = el.parentElement;
    }
    cards.add(el);
  });

  // 2) Đọc thuộc tính từ các dòng chữ
  const toInt = s => s ? parseInt(String(s).replace(/[^\d]/g, ''), 10) || null : null;
  const rows = [...cards].map(el => {
    const lines = el.innerText.split('\n').map(s => s.trim()).filter(Boolean);
    const find = re => lines.find(l => re.test(l)) ?? null;
    const next = re => { const i = lines.findIndex(l => re.test(l)); return i >= 0 ? (lines[i + 1] ?? null) : null; };

    const dur = find(/total (hours?|mins?)/i);
    const durNum = dur ? parseFloat(dur) : null;
    const nowRaw = next(/^Current price/i);
    const listRaw = next(/^Original Price/i);

    // Khóa miễn phí: giá = 0. Khóa không giảm giá (thẻ không có dòng Original Price): giá gốc = giá hiện tại.
    const isFree = /^free$/i.test(nowRaw || '');
    const priceNow = isFree ? 0 : toInt(nowRaw);
    const priceList = isFree ? 0 : (toInt(listRaw) ?? priceNow);

    return {
      url: el.querySelector('a[href*="/course/"]') ? hrefOf(el.querySelector('a[href*="/course/"]')) : null,
      title: lines[0] ?? null,
      topic: TOPIC,
      rating: parseFloat((find(/^Rating:/i) || '').match(/([\d.]+)\s*out of 5/i)?.[1]) || null,
      num_ratings: toInt(find(/^[\d,]+\s+ratings?$/i)),
      hours: durNum == null ? null : (/mins?/i.test(dur) ? durNum / 60 : durNum),
      lectures: toInt(find(/^[\d,]+\s+lectures?$/i)),
      level: find(/^(All Levels|Beginner|Intermediate|Expert)$/i),
      price_now_raw: nowRaw,
      price_list_raw: listRaw,
      price_now: priceNow,
      price_list: priceList,
      collected: new Date().toISOString().slice(0, 10)
    };
  });

  if (rows.length === 0) {
    console.warn('Không tìm thấy thẻ khóa học nào. Hãy cuộn hết trang rồi chạy lại.');
    return;
  }

  // 3) Cộng dồn, giữ bản ghi đầu tiên nếu trùng URL (kể cả trùng giữa các chủ đề)
  const store = JSON.parse(localStorage.getItem(KEY) || '{}');
  let added = 0;
  rows.filter(r => r.url && r.title).forEach(r => { if (!store[r.url]) { store[r.url] = r; added++; } });
  localStorage.setItem(KEY, JSON.stringify(store));

  const all = Object.values(store);
  const perTopic = all.reduce((o, r) => (o[r.topic] = (o[r.topic] || 0) + 1, o), {});
  const miss = k => rows.filter(r => r[k] == null).length;

  console.log(`Chủ đề: ${TOPIC} | thẻ tìm thấy: ${rows.length} | mới thêm: ${added} | trùng: ${rows.length - added}`);
  console.log(`Tổng tích lũy: ${all.length} | theo chủ đề:`, perTopic);
  console.log(`Thiếu → rating:${miss('rating')} num_ratings:${miss('num_ratings')} hours:${miss('hours')} lectures:${miss('lectures')} price_now:${miss('price_now')} price_list:${miss('price_list')}`);
  console.table(rows.slice(0, 3));
})();