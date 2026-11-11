export const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#a855f7']

export const fmtVND = n =>
  n == null ? '–' : new Intl.NumberFormat('vi-VN').format(Math.round(n)) + '₫'

export const fmtNum = (n, d = 0) =>
  n == null ? '–' : new Intl.NumberFormat('vi-VN', { maximumFractionDigits: d }).format(n)

export const FEATURE_LABELS = {
  price_list: 'Giá gốc',
  rating: 'Rating',
  num_ratings: 'Số đánh giá',
  hours: 'Số giờ',
  lectures: 'Số bài giảng',
  discount_pct: 'Giảm giá (%)',
}

export const FEATURE_FMT = {
  price_list: fmtVND,
  rating: n => fmtNum(n, 2),
  num_ratings: n => fmtNum(n),
  hours: n => fmtNum(n, 1),
  lectures: n => fmtNum(n),
  discount_pct: n => fmtNum(n, 1) + '%',
}