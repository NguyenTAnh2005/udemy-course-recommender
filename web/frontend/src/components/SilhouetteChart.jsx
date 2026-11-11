import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
  fontSize: 12,
  padding: '8px 12px',
}

function Mini({ title, description, data, dataKey, k, color }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
        <span
          className="rounded-md px-2 py-1 text-xs font-semibold"
          style={{ backgroundColor: `${color}15`, color }}
        >
          K = {k}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis
            dataKey="k"
            tick={{ fontSize: 11, fill: '#64748b' }}
            label={{ value: 'K', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={['auto', 'auto']} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }} />
          <ReferenceLine
            x={k}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{ value: `K=${k}`, fill: '#ef4444', fontSize: 11, position: 'top' }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3.5, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function SilhouetteChart({ summary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Mini
        title="Silhouette theo K"
        description="Càng gần 1 càng tách cụm tốt"
        data={summary.k_selection}
        dataKey="silhouette"
        k={summary.n_clusters}
        color="#6366f1"
      />
      <Mini
        title="Inertia theo K (elbow)"
        description="Tìm điểm gãy giảm mạnh"
        data={summary.k_selection}
        dataKey="inertia"
        k={summary.n_clusters}
        color="#f59e0b"
      />
    </div>
  )
}