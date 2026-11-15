import { useMemo, useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { COLORS } from '../lib/format'
import { CARD_BASE, TRANSITION } from '../utils/style'
import clsx from 'clsx'

function PointTip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  if (p.isCentroid) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className="font-semibold text-slate-900 dark:text-slate-100">Tâm cụm {p.cluster}</div>
        <div className="mt-0.5 text-slate-500 dark:text-slate-400">{p.n ? `${p.n} khóa học` : ''}</div>
      </div>
    )
  }
  return (
    <div className="max-w-xs rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="font-semibold text-slate-900 dark:text-slate-100">{p.title}</div>
      <div className="mt-0.5 text-slate-500 dark:text-slate-400">Cụm {p.cluster} · {p.topic}</div>
    </div>
  )
}

export default function PcaScatter({ pointsData, clusters }) {
  const [hidden, setHidden] = useState(new Set())
  const { points, explained_variance: ev, centroids = [] } = pointsData

  const byCluster = useMemo(() => {
    const m = {}
    points.forEach(p => (m[p.cluster] ??= []).push(p))
    return m
  }, [points])

  const toggle = id => setHidden(prev => {
    const n = new Set(prev)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })

  return (
    <div className={`${CARD_BASE} p-5`}>
      <div className="mb-4 flex flex-wrap gap-2">
        {clusters.map(c => {
          const active = !hidden.has(c.cluster)
          return (
            <button
              key={c.cluster}
              onClick={() => toggle(c.cluster)}
              className={clsx(
                'flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                active
                  ? 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  : 'border-transparent bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500'
              )}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${TRANSITION}`} style={{ background: active ? COLORS[c.cluster % COLORS.length] : '#94a3b8' }} />
              Cụm {c.cluster}
            </button>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ left: 8, right: 16, top: 8, bottom: 32 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #eef2f7)" />
          <XAxis type="number" dataKey="x" name="PC1" tick={{ fontSize: 13, fill: 'var(--chart-axis, #64748b)' }} label={{ value: `PC1 (${(ev[0] * 100).toFixed(1)}%)`, position: 'insideBottom', offset: -16, fill: 'var(--chart-axis, #64748b)', fontSize: 13 }} />
          <YAxis type="number" dataKey="y" name="PC2" tick={{ fontSize: 13, fill: 'var(--chart-axis, #64748b)' }} label={{ value: `PC2 (${(ev[1] * 100).toFixed(1)}%)`, angle: -90, position: 'insideLeft', fill: 'var(--chart-axis, #64748b)', fontSize: 13 }} />
          <Tooltip content={<PointTip />} cursor={{ strokeDasharray: '3 3' }} />
          {clusters.map(c => hidden.has(c.cluster) ? null : (
            <Scatter key={`pts-${c.cluster}`} data={byCluster[c.cluster] ?? []} fill={COLORS[c.cluster % COLORS.length]} fillOpacity={0.55} stroke={COLORS[c.cluster % COLORS.length]} strokeOpacity={0.9} isAnimationActive={false} />
          ))}
          {centroids.map(c => hidden.has(c.cluster) ? null : (
            <Scatter key={`centroid-${c.cluster}`} data={[{ x: c.x, y: c.y, cluster: c.cluster, n: c.n, isCentroid: true }]} fill={COLORS[c.cluster % COLORS.length]} stroke="#ffffff" strokeWidth={2.5} shape="star" isAnimationActive={false} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}