import { useLayoutEffect, useState } from 'react'
import useData from './hooks/useData'
import SummaryCards from './components/SummaryCards'
import SilhouetteChart from './components/SilhouetteChart'
import ClusterCards from './components/ClusterCards'
import BreakdownCharts from './components/BreakdownCharts'
import PcaScatter from './components/PcaScatter'
import CourseTable from './components/CourseTable'
import { IconSparkles, IconAlertCircle, IconSun, IconMoon } from './components/Icons'
import { fmtNum } from './lib/format'
import { 
  BG_PAGE, BG_HEADER, BG_FOOTER, TEXT_BODY,
  TEXT_TITLE, TEXT_EYEBROW, TEXT_MUTED, BTN_ICON 
} from './utils/style'

const Section = ({ eyebrow, title, description, children }) => (
  <section className="space-y-5">
    <div>
      {eyebrow && <p className={TEXT_EYEBROW}>{eyebrow}</p>}
      <h2 className={`mt-1 ${TEXT_TITLE}`}>{title}</h2>
      {description && <p className={`mt-1.5 ${TEXT_MUTED}`}>{description}</p>}
    </div>
    {children}
  </section>
)

const LoadingState = () => (
  <div className={`grid min-h-screen place-items-center ${BG_PAGE}`}>
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400" />
      <p className={`mt-4 text-base font-medium ${TEXT_BODY}`}>Đang tải dữ liệu…</p>
    </div>
  </div>
)

const ErrorState = ({ message }) => (
  <div className={`grid min-h-screen place-items-center p-4 ${BG_PAGE}`}>
    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center ring-1 ring-red-200 shadow-sm dark:bg-slate-900 dark:ring-red-900/50">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <IconAlertCircle className="h-6 w-6" />
      </div>
      <h2 className={`mt-4 text-lg font-semibold ${TEXT_TITLE}`}>Không thể tải dữ liệu</h2>
      <p className={`mt-1 text-base ${TEXT_MUTED}`}>{message}</p>
    </div>
  </div>
)

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const { data, error } = useData()
  const [theme, setTheme] = useState(getInitialTheme)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    if (theme === 'dark') {
      root.style.setProperty('--chart-grid', '#334155')
      root.style.setProperty('--chart-axis', '#94a3b8')
      root.style.setProperty('--chart-tooltip-bg', '#1e293b')
      root.style.setProperty('--chart-tooltip-border', '#334155')
      root.style.setProperty('--chart-tooltip-text', '#f1f5f9')
    } else {
      root.style.setProperty('--chart-grid', '#eef2f7')
      root.style.setProperty('--chart-axis', '#64748b')
      root.style.setProperty('--chart-tooltip-bg', '#ffffff')
      root.style.setProperty('--chart-tooltip-border', '#e2e8f0')
      root.style.setProperty('--chart-tooltip-text', '#0f172a')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  if (error) return <ErrorState message={error.message} />
  if (!data) return <LoadingState />

  const { summary, clusters, breakdown, points, courses } = data

  return (
    <div className={BG_PAGE}>
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-indigo-50 via-white to-transparent dark:from-indigo-950/40 dark:via-slate-950 dark:to-transparent" />

      <header className={BG_HEADER}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <IconSparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className={`text-lg font-bold tracking-tight ${TEXT_TITLE}`}>Phân cụm khóa học Udemy</h1>
              <p className={`text-sm ${TEXT_MUTED}`}>
                K-means · {summary.features.length} thuộc tính · {summary.topics.length} chủ đề
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-700/40">
                {summary.n_clusters} cụm
              </span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-700/40">
                {fmtNum(summary.n_courses)} khóa
              </span>
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={BTN_ICON} title="Đổi giao diện">
              {theme === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-14 px-4 py-10">
        <Section eyebrow="Tổng quan" title="Số liệu chính">
          <SummaryCards summary={summary} />
        </Section>
        <Section eyebrow="Tối ưu K" title="Chọn số cụm" description="Silhouette cao hơn và elbow rõ hơn là tốt hơn — đường đỏ đánh dấu K đang dùng.">
          <SilhouetteChart summary={summary} />
        </Section>
        <Section eyebrow="Hồ sơ cụm" title="Đặc điểm từng cụm" description="So sánh trung bình và median các thuộc tính giữa các cụm.">
          <ClusterCards clusters={clusters} features={summary.features} />
        </Section>
        <Section eyebrow="Phân bố" title="Chủ đề, level và khoảng giá" description="Cơ cấu từng cụm theo chủ đề, level, giá bán hiện tại và giá niêm yết.">
          <BreakdownCharts breakdown={breakdown} />
        </Section>
        <Section eyebrow="Không gian 2 chiều" title="Bản đồ PCA" description="Mỗi điểm là một khóa học, tô màu theo cụm; ngôi sao là tâm cụm.">
          <PcaScatter pointsData={points} clusters={clusters} />
        </Section>
        <Section eyebrow="Tra cứu" title="Danh sách khóa học">
          <CourseTable courses={courses} points={points.points} clusters={clusters} topics={summary.topics} />
        </Section>
      </main>

      <footer className={BG_FOOTER}>
        Dữ liệu phân tích khóa học Udemy · K-means clustering
      </footer>
    </div>
  )
}