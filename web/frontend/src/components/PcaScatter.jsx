import { useMemo, useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { COLORS } from '../lib/format'

function PointTip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="max-w-xs rounded-xl border border-slate-200 bg-white p-2.5 text-xs shadow-lg">
      <div className="font-semibold text-slate-900">{p.title}</div>
      <div className="mt-0.5 text-slate-500">
        Cụm {p.cluster} · {p.topic}
      </div>
    </div>
  )
}

export default function PcaScatter({ pointsData, clusters }) {
  const [hidden, setHidden] = useState(new Set())
  const { points, explained_variance: ev } = pointsData

  const byCluster = useMemo(() => {
    const m = {}
    points.forEach(p => (m[p.cluster] ??= []).push(p))
    return m
  }, [points])

  const toggle = id =>
    setHidden(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-2">
        {clusters.map(c => {
          const active = !hidden.has(c.cluster)
          return (
            <button
              key={c.cluster}
              onClick={() => toggle(c.cluster)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${
                active
                  ? 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300'
                  : 'border-transparent bg-slate-100 text-slate-400'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: active ? COLORS[c.cluster % COLORS.length] : '#cbd5e1',
                }}
              />
              Cụm {c.cluster}
            </button>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={480}>
        <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis
            type="number"
            dataKey="x"
            name="PC1"
            tick={{ fontSize: 11, fill: '#64748b' }}
            label={{
              value: `PC1 (${(ev[0] * 100).toFixed(1)}%)`,
              position: 'insideBottom',
              offset: -12,
              fill: '#64748b',
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="PC2"
            tick={{ fontSize: 11, fill: '#64748b' }}
            label={{
              value: `PC2 (${(ev[1] * 100).toFixed(1)}%)`,
              angle: -90,
              position: 'insideLeft',
              fill: '#64748b',
              fontSize: 11,
            }}
          />
          <Tooltip content={<PointTip />} cursor={{ strokeDasharray: '3 3' }} />
          {clusters.map(c =>
            hidden.has(c.cluster) ? null : (
              <Scatter
                key={c.cluster}
                data={byCluster[c.cluster] ?? []}
                fill={COLORS[c.cluster % COLORS.length]}
                fillOpacity={0.55}
                stroke={COLORS[c.cluster % COLORS.length]}
                strokeOpacity={0.9}
                isAnimationActive={false}
              />
            )
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}