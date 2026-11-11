import useData from './hooks/useData'
import SummaryCards from './components/SummaryCards'
import SilhouetteChart from './components/SilhouetteChart'
import ClusterCards from './components/ClusterCards'
import BreakdownCharts from './components/BreakdownCharts'
import PcaScatter from './components/PcaScatter'
import CourseTable from './components/CourseTable'
import { IconSparkles, IconAlertCircle } from './components/Icons'
import { fmtNum } from './lib/format'

const Section = ({ eyebrow, title, description, children }) => (
  <section className="space-y-4">
    <div>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    {children}
  </section>
)

const LoadingState = () => (
  <div className="grid min-h-screen place-items-center bg-slate-50">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
      <p className="mt-4 text-sm font-medium text-slate-600">Đang tải dữ liệu…</p>
    </div>
  </div>
)

const ErrorState = ({ message }) => (
  <div className="grid min-h-screen place-items-center bg-slate-50 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center ring-1 ring-red-200 shadow-sm">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
        <IconAlertCircle className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">Không thể tải dữ liệu</h2>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  </div>
)

export default function App() {
  const { data, error } = useData()

  if (error) return <ErrorState message={error.message} />
  if (!data) return <LoadingState />

  const { summary, clusters, breakdown, points, courses } = data

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Vệt gradient mờ phía trên */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-indigo-50 via-white to-transparent" />

      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <IconSparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                Phân cụm khóa học Udemy
              </h1>
              <p className="text-xs text-slate-500">
                K-means · {summary.features.length} thuộc tính · {summary.topics.length} chủ đề
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              {summary.n_clusters} cụm
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
              {fmtNum(summary.n_courses)} khóa học
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-10">
        <Section eyebrow="Tổng quan" title="Số liệu chính">
          <SummaryCards summary={summary} />
        </Section>

        <Section
          eyebrow="Tối ưu K"
          title="Chọn số cụm"
          description="Silhouette cao hơn và elbow rõ hơn là tốt hơn — đường đỏ đánh dấu K đang dùng."
        >
          <SilhouetteChart summary={summary} />
        </Section>

        <Section
          eyebrow="Hồ sơ cụm"
          title="Đặc điểm từng cụm"
          description="So sánh trung bình và median các thuộc tính giữa các cụm."
        >
          <ClusterCards clusters={clusters} features={summary.features} />
        </Section>

        <Section
          eyebrow="Phân bố"
          title="Chủ đề, level và khoảng giá"
          description="Cơ cấu từng cụm theo các chiều phân loại chính."
        >
          <BreakdownCharts breakdown={breakdown} />
        </Section>

        <Section
          eyebrow="Không gian 2 chiều"
          title="Bản đồ PCA"
          description="Mỗi điểm là một khóa học, tô màu theo cụm."
        >
          <PcaScatter pointsData={points} clusters={clusters} />
        </Section>

        <Section eyebrow="Tra cứu" title="Danh sách khóa học">
          <CourseTable
            courses={courses}
            points={points.points}
            clusters={clusters}
            topics={summary.topics}
          />
        </Section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 py-6 text-center text-xs text-slate-500">
        Dữ liệu phân tích khóa học Udemy · K-means clustering
      </footer>
    </div>
  )
}