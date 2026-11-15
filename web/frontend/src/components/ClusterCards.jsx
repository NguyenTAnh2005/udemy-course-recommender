import { COLORS, FEATURE_LABELS, FEATURE_FMT, fmtNum } from '../lib/format'
import { CARD_BASE, CARD_HOVER, TEXT_SUBTITLE, TEXT_MUTED, TEXT_BODY } from '../utils/style'
import clsx from 'clsx'

export default function ClusterCards({ clusters, features }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {clusters.map(c => {
        const color = COLORS[c.cluster % COLORS.length]
        return (
          <div key={c.cluster} className={clsx(CARD_BASE, CARD_HOVER, "flex flex-col overflow-hidden")}>
            <div className="h-1.5" style={{ background: color }} />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-base font-bold text-white shadow-sm" style={{ background: color }}>
                  {c.cluster}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className={TEXT_SUBTITLE}>{c.name}</h3>
                  <p className={`mt-0.5 ${TEXT_MUTED}`}>{fmtNum(c.n_courses)} khóa · {c.pct}% tổng</p>
                </div>
              </div>

              <p className={`mt-3 ${TEXT_BODY}`}>{c.description}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/60">
                <div>
                  <div className={`text-xs font-medium uppercase ${TEXT_MUTED}`}>Giờ (median)</div>
                  <div className="mt-1 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-100">{c.hours_median}</div>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-700">
                  <div className={`text-xs font-medium uppercase ${TEXT_MUTED}`}>Median đánh giá</div>
                  <div className="mt-1 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-100">{fmtNum(c.num_ratings_median)}</div>
                </div>
                <div>
                  <div className={`text-xs font-medium uppercase ${TEXT_MUTED}`}>Giảm giá</div>
                  <div className="mt-1 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-100">{c.discount_pct_median}%</div>
                </div>
              </div>

              <div className="mt-4 flex-1 overflow-hidden rounded-xl ring-1 ring-slate-100 dark:ring-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Thuộc tính</th>
                      <th className="px-3 py-2 text-right font-medium">Trung bình</th>
                      <th className="px-3 py-2 text-right font-medium">Median</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map(f => (
                      <tr key={f} className="border-t border-slate-100 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{FEATURE_LABELS[f] ?? f}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-slate-900 dark:text-slate-100">{FEATURE_FMT[f](c[`${f}_mean`])}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-slate-500 dark:text-slate-400">{FEATURE_FMT[f](c[`${f}_median`])}</td>
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