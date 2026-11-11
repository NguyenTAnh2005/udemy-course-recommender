import { COLORS, FEATURE_LABELS, FEATURE_FMT, fmtNum } from '../lib/format'

export default function ClusterCards({ clusters, features }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {clusters.map(c => {
        const color = COLORS[c.cluster % COLORS.length]
        return (
          <div
            key={c.cluster}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm transition hover:shadow-md"
          >
            <div className="h-1.5" style={{ background: color }} />
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold text-white shadow-sm"
                  style={{ background: color }}
                >
                  {c.cluster}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-500">
                    {fmtNum(c.n_courses)} khóa · {c.pct}% tổng
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.description}</p>

              <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Thuộc tính</th>
                      <th className="px-3 py-2 text-right font-medium">Trung bình</th>
                      <th className="px-3 py-2 text-right font-medium">Median</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map(f => (
                      <tr key={f} className="border-t border-slate-100 hover:bg-slate-50/60">
                        <td className="px-3 py-1.5 text-slate-700">{FEATURE_LABELS[f] ?? f}</td>
                        <td className="px-3 py-1.5 text-right tabular-nums text-slate-900">
                          {FEATURE_FMT[f](c[`${f}_mean`])}
                        </td>
                        <td className="px-3 py-1.5 text-right tabular-nums text-slate-500">
                          {FEATURE_FMT[f](c[`${f}_median`])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}