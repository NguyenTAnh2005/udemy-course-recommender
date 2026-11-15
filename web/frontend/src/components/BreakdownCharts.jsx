import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fmtVND, fmtNum } from '../lib/format'
import { CARD_BASE, TEXT_SUBTITLE, TABLE_HEAD, TABLE_ROW, TABLE_TD, TRANSITION } from '../utils/style'
import clsx from 'clsx'

const SERIES_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#a855f7']

function StackedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload[0]?.payload?.total || 1
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-2 font-semibold text-slate-900 dark:text-slate-100">{label}</p>
      <div className="space-y-1">
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
              {p.name}
            </span>
            <span className="font-medium tabular-nums text-slate-900 dark:text-slate-100">
              {fmtNum(p.value)} <span className="font-normal text-slate-400 dark:text-slate-500">({((p.value / total) * 100).toFixed(1)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stacked({ title, block, percent }) {
  const data = block.rows.map(r => ({ ...r, name: `Cụm ${r.cluster}` }))
  return (
    <div className={`${CARD_BASE} p-5`}>
      <h3 className={`mb-3 ${TEXT_SUBTITLE}`}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} stackOffset={percent ? 'expand' : 'none'} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #eef2f7)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 13, fill: 'var(--chart-axis, #64748b)' }} />
          <YAxis tick={{ fontSize: 13, fill: 'var(--chart-axis, #64748b)' }} tickFormatter={v => (percent ? `${Math.round(v * 100)}%` : fmtNum(v))} />
          <Tooltip content={<StackedTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
          <Legend formatter={value => <span style={{ color: 'var(--chart-axis, #64748b)' }}>{value}</span>} wrapperStyle={{ fontSize: 13, paddingTop: 8 }} iconType="circle" iconSize={8} />
          {block.keys.map((k, i) => (
            <Bar key={k} dataKey={k} stackId="a" fill={SERIES_COLORS[i % SERIES_COLORS.length]} radius={i === block.keys.length - 1 ? [4, 4, 0, 0] : 0} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function BreakdownCharts({ breakdown }) {
  const [percent, setPercent] = useState(false)

  return (
    <div className="space-y-4">
      <div className={`inline-flex rounded-xl bg-slate-100 p-1 text-sm ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700 ${TRANSITION}`}>
        {[['Số lượng', false], ['Phần trăm', true]].map(([label, val]) => (
          <button
            key={label}
            onClick={() => setPercent(val)}
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-medium transition',
              percent === val
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Stacked title="Chủ đề × cụm" block={breakdown.topic_by_cluster} percent={percent} />
        <Stacked title="Level × cụm" block={breakdown.level_by_cluster} percent={percent} />
        <Stacked title="Khoảng giá bán (price_now) × cụm" block={breakdown.price_bin_by_cluster} percent={percent} />
        <Stacked title="Khoảng giá niêm yết (price_list) × cụm" block={breakdown.price_list_bin_by_cluster} percent={percent} />
      </div>

      <div className={`overflow-hidden ${CARD_BASE}`}>
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h3 className={TEXT_SUBTITLE}>Giá bán hiện tại (price_now) theo cụm</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={TABLE_HEAD}>
              <tr>
                {['Cụm', 'Số khóa', 'Trung bình', 'P25', 'Median', 'P75', 'Max'].map(h => (
                  <th key={h} className={`whitespace-nowrap px-4 py-3 text-left font-medium ${TRANSITION}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {breakdown.price_now_stats.map(s => (
                <tr key={s.cluster} className={TABLE_ROW}>
                  <td className={`px-4 font-medium text-slate-900 dark:text-slate-100 ${TABLE_TD}`}>Cụm {s.cluster}</td>
                  <td className={`px-4 tabular-nums text-slate-700 dark:text-slate-300 ${TABLE_TD}`}>{fmtNum(s.count)}</td>
                  <td className={`px-4 tabular-nums font-medium text-slate-900 dark:text-slate-100 ${TABLE_TD}`}>{fmtVND(s.mean)}</td>
                  <td className={`px-4 tabular-nums text-slate-600 dark:text-slate-400 ${TABLE_TD}`}>{fmtVND(s.p25)}</td>
                  <td className={`px-4 tabular-nums text-slate-600 dark:text-slate-400 ${TABLE_TD}`}>{fmtVND(s.median)}</td>
                  <td className={`px-4 tabular-nums text-slate-600 dark:text-slate-400 ${TABLE_TD}`}>{fmtVND(s.p75)}</td>
                  <td className={`px-4 tabular-nums text-slate-600 dark:text-slate-400 ${TABLE_TD}`}>{fmtVND(s.max)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}