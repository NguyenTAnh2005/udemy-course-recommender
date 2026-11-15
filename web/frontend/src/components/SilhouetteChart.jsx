import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { CARD_BASE, TEXT_SUBTITLE, TEXT_MUTED } from '../utils/style'

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid var(--chart-tooltip-border, #e2e8f0)',
  background: 'var(--chart-tooltip-bg, #ffffff)',
  color: 'var(--chart-tooltip-text, #0f172a)',
  boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
  fontSize: 13,
  padding: '8px 12px',
}

function Mini({ title, description, data, dataKey, k, color }) {
  return (
    <div className={`${CARD_BASE} p-5`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className={TEXT_SUBTITLE}>{title}</h3>
          <p className={`mt-0.5 ${TEXT_MUTED}`}>{description}</p>
        </div>
        <span className="rounded-md px-2.5 py-1 text-sm font-semibold" style={{ backgroundColor: `${color}20`, color }}>
          K = {k}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ left: 4, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #eef2f7)" />
          <XAxis dataKey="k" tick={{ fontSize: 13, fill: 'var(--chart-axis, #64748b)' }} label={{ value: 'K', position: 'insideBottom', offset: -2, fill: 'var(--chart-axis, #64748b)', fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13, fill: 'var(--chart-axis, #64748b)' }} domain={['auto', 'auto']} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }} />
          <ReferenceLine x={k} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `K=${k}`, fill: '#ef4444', fontSize: 12, position: 'top' }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: 'var(--chart-tooltip-bg, #ffffff)' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function SilhouetteChart({ summary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Mini title="Silhouette theo K" description="Càng gần 1 càng tách cụm tốt" data={summary.k_selection} dataKey="silhouette" k={summary.n_clusters} color="#6366f1" />
      <Mini title="Inertia theo K (elbow)" description="Tìm điểm gãy giảm mạnh" data={summary.k_selection} dataKey="inertia" k={summary.n_clusters} color="#f59e0b" />
    </div>
  )
}