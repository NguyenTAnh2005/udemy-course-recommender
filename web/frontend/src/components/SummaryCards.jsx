import { fmtNum } from '../lib/format'
import { IconBook, IconLayers, IconTarget, IconChartPie } from './Icons'

export default function SummaryCards({ summary }) {
  const pca = summary.pca_explained.reduce((a, b) => a + b, 0)

  const items = [
    {
      label: 'Số khóa học',
      value: fmtNum(summary.n_courses),
      icon: IconBook,
      gradient: 'from-indigo-500 to-violet-600',
      desc: 'Tổng số khóa học trong tập dữ liệu',
    },
    {
      label: 'Số cụm (K)',
      value: summary.n_clusters,
      icon: IconLayers,
      gradient: 'from-emerald-500 to-teal-600',
      desc: 'Số cụm tối ưu theo silhouette',
    },
    {
      label: 'Silhouette',
      value: summary.silhouette.toFixed(4),
      icon: IconTarget,
      gradient: 'from-amber-500 to-orange-600',
      desc: 'Chất lượng phân cụm (càng cao càng tốt)',
    },
    {
      label: 'PCA giải thích (2 PC)',
      value: (pca * 100).toFixed(1) + '%',
      icon: IconChartPie,
      gradient: 'from-sky-500 to-cyan-600',
      desc: 'Tỷ lệ phương sai được giải thích',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(i => {
        const Icon = i.icon
        return (
          <div
            key={i.label}
            className="group rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300"
          >
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${i.gradient} text-white shadow-sm`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{i.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {i.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{i.desc}</p>
          </div>
        )
      })}
    </div>
  )
}