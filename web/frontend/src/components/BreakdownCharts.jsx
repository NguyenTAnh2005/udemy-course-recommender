import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { fmtVND, fmtNum } from '../lib/format'

const SERIES_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#a855f7']

function StackedTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload[0]?.payload?.total || 1
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg">
      <p className="mb-2 font-semibold text-slate-900">{label}</p>
      <div className="space-y-0.5">
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
              {p.name}
            </span>
            <span className="font-medium tabular-nums text-slate-900">
              {fmtNum(p.value)}{' '}
              <span className="font-normal text-slate-400">
                ({((p.value / total) * 100).toFixed(1)}%)
              </span>
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
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} stackOffset={percent ? 'expand' : 'none'} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={v => (percent ? `${Math.round(v * 100)}%` : fmtNum(v))}
          />
          <Tooltip content={<StackedTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
          {block.keys.map((k, i) => (
            <Bar
              key={k}
              dataKey={k}
              stackId="a"
              fill={SERIES_COLORS[i % SERIES_COLORS.length]}
              radius={i === block.keys.length - 1 ? [4, 4, 0, 0] : 0}
            />
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
      <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm ring-1 ring-slate-200/70">
        {[
          ['Số lượng', false],
          ['Phần trăm', true],
        ].map(([label, val]) => (
          <button
            key={label}
            onClick={() => setPercent(val)}
            className={`rounded-lg px-3.5 py-1.5 font-medium transition ${
              percent === val
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Stacked title="Chủ đề × cụm" block={breakdown.topic_by_cluster} percent={percent} />
        <Stacked title="Level × cụm" block={breakdown.level_by_cluster} percent={percent} />
        <Stacked title="Khoảng giá bán × cụm" block={breakdown.price_bin_by_cluster} percent={percent} />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Giá bán hiện tại (price_now) theo cụm
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 text-slate-500">
              <tr>
                {['Cụm', 'Số khóa', 'Trung bình', 'P25', 'Median', 'P75', 'Max'].map(h => (
                  <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {breakdown.price_now_stats.map(s => (
                <tr key={s.cluster} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-2 font-medium text-slate-900">
                    Cụm {s.cluster}
                  </td>
                  <td className="px-4 py-2 tabular-nums text-slate-700">{fmtNum(s.count)}</td>
                  <td className="px-4 py-2 tabular-nums text-slate-900 font-medium">
                    {fmtVND(s.mean)}
                  </td>
                  <td className="px-4 py-2 tabular-nums text-slate-600">{fmtVND(s.p25)}</td>
                  <td className="px-4 py-2 tabular-nums text-slate-600">{fmtVND(s.median)}</td>
                  <td className="px-4 py-2 tabular-nums text-slate-600">{fmtVND(s.p75)}</td>
                  <td className="px-4 py-2 tabular-nums text-slate-600">{fmtVND(s.max)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}