import { useMemo, useState } from 'react'
import { fmtVND, fmtNum } from '../lib/format'
import { IconSearch, IconChevronLeft, IconChevronRight, IconInbox } from './Icons'
import { CARD_BASE, INPUT_BASE, BTN_ICON, TABLE_HEAD, TABLE_TH, TABLE_ROW, TABLE_TD, TEXT_MUTED } from '../utils/style'
import clsx from 'clsx'

const PAGE = 20

export default function CourseTable({ courses, points, clusters, topics }) {
  const [q, setQ] = useState('')
  const [cluster, setCluster] = useState('all')
  const [topic, setTopic] = useState('all')
  const [sort, setSort] = useState({ key: 'num_ratings', dir: 'desc' })
  const [page, setPage] = useState(0)

  const rows = useMemo(() => courses.map((c, i) => {
    const p = points[i]
    if (p && p.title !== c.title) console.warn('courses/points lệch thứ tự ở dòng', i)
    return { ...c, cluster: c.cluster ?? p?.cluster }
  }), [courses, points])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    const out = rows.filter(r =>
      (cluster === 'all' || r.cluster === Number(cluster)) &&
      (topic === 'all' || r.topic === topic) &&
      (!s || r.title.toLowerCase().includes(s))
    )
    const { key, dir } = sort
    out.sort((a, b) => {
      const x = a[key]
      const y = b[key]
      const r = typeof x === 'string' ? x.localeCompare(y) : (x ?? 0) - (y ?? 0)
      return dir === 'asc' ? r : -r
    })
    return out
  }, [rows, q, cluster, topic, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const view = filtered.slice(page * PAGE, page * PAGE + PAGE)

  const reset = fn => v => { fn(v); setPage(0) }

  const th = (key, label, right) => (
    <th
      className={clsx(
        'cursor-pointer select-none whitespace-nowrap px-3 py-3 font-medium transition hover:text-slate-900 dark:hover:text-slate-100',
        right ? 'text-right' : 'text-left'
      )}
      onClick={() => setSort(s => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }))}
    >
      {label}{sort.key === key ? (sort.dir === 'desc' ? ' ↓' : ' ↑') : ''}
    </th>
  )

  return (
    <div className={`${CARD_BASE} p-4 sm:p-5`}>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={e => reset(setQ)(e.target.value)}
            placeholder="Tìm theo tên khóa học…"
            className={`w-full pl-10 ${INPUT_BASE}`}
          />
        </div>
        <select value={cluster} onChange={e => reset(setCluster)(e.target.value)} className={INPUT_BASE}>
          <option value="all">Tất cả cụm</option>
          {clusters.map(c => <option key={c.cluster} value={c.cluster}>Cụm {c.cluster}</option>)}
        </select>
        <select value={topic} onChange={e => reset(setTopic)(e.target.value)} className={INPUT_BASE}>
          <option value="all">Tất cả chủ đề</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-slate-100 dark:ring-slate-800">
        <div className="max-h-[640px] overflow-auto">
          <table className="w-full text-sm">
            <thead className={`sticky top-0 z-10 backdrop-blur ${TABLE_HEAD}`}>
              <tr>
                {th('title', 'Khóa học')}
                {th('cluster', 'Cụm')}
                {th('topic', 'Chủ đề')}
                {th('rating', 'Rating', true)}
                {th('num_ratings', 'Đánh giá', true)}
                {th('hours', 'Giờ', true)}
                {th('price_now', 'Giá bán', true)}
                {th('discount_pct', 'Giảm', true)}
              </tr>
            </thead>
            <tbody>
              {view.map((r, i) => (
                <tr key={r.url ?? i} className={TABLE_ROW}>
                  <td className={`max-w-md ${TABLE_TD}`}>
                    <a href={r.url} target="_blank" rel="noreferrer" className="line-clamp-2 font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300">
                      {r.title}
                    </a>
                  </td>
                  <td className={TABLE_TD}>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {r.cluster}
                    </span>
                  </td>
                  <td className={`text-slate-600 dark:text-slate-400 ${TABLE_TD}`}>{r.topic}</td>
                  <td className={`text-right tabular-nums text-slate-900 dark:text-slate-100 ${TABLE_TD}`}>{r.rating}</td>
                  <td className={`text-right tabular-nums text-slate-700 dark:text-slate-300 ${TABLE_TD}`}>{fmtNum(r.num_ratings)}</td>
                  <td className={`text-right tabular-nums text-slate-700 dark:text-slate-300 ${TABLE_TD}`}>{r.hours}</td>
                  <td className={`text-right tabular-nums font-medium text-slate-900 dark:text-slate-100 ${TABLE_TD}`}>{fmtVND(r.price_now)}</td>
                  <td className={`text-right tabular-nums text-emerald-600 dark:text-emerald-400 ${TABLE_TD}`}>{fmtNum(r.discount_pct, 0)}%</td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-16 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                      <IconInbox className="h-9 w-9" />
                      <p className="text-base">Không có khóa học nào khớp bộ lọc</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-base">
        <span className={TEXT_MUTED}>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{fmtNum(filtered.length)}</span> khóa học
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={clsx(BTN_ICON, "h-9 w-9")}>
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[72px] px-3 text-center font-medium text-slate-700 tabular-nums dark:text-slate-200">
            {page + 1} / {pages}
          </span>
          <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className={clsx(BTN_ICON, "h-9 w-9")}>
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}