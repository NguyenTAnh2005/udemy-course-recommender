import { fmtNum } from '../lib/format'
import { IconBook, IconLayers, IconTarget, IconChartPie } from './Icons'
import { CARD_BASE, CARD_HOVER, TEXT_MUTED } from '../utils/style'
import clsx from 'clsx'

export default function SummaryCards({ summary }) {
  const pca = summary.pca_explained.reduce((a, b) => a + b, 0)

  const items = [
    { label: 'Số khóa học', value: fmtNum(summary.n_courses), icon: IconBook, gradient: 'from-indigo-500 to-violet-600', desc: 'Tổng số khóa học' },
    { label: 'Số cụm (K)', value: summary.n_clusters, icon: IconLayers, gradient: 'from-emerald-500 to-teal-600', desc: 'Số cụm tối ưu' },
    { label: 'Silhouette', value: summary.silhouette.toFixed(4), icon: IconTarget, gradient: 'from-amber-500 to-orange-600', desc: 'Chất lượng phân cụm' },
    { label: 'PCA giải thích', value: (pca * 100).toFixed(1) + '%', icon: IconChartPie, gradient: 'from-sky-500 to-cyan-600', desc: 'Phương sai 2 PC' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(i => {
        const Icon = i.icon
        return (
          <div key={i.label} className={clsx(CARD_BASE, CARD_HOVER, "p-5")}>
            <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${i.gradient} text-white shadow-sm`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className={`mt-4 text-sm font-medium ${TEXT_MUTED}`}>{i.label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {i.value}
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{i.desc}</p>
          </div>
        )
      })}
    </div>
  )
}