import { RefreshCw } from 'lucide-react'
import CampusMap from '../components/CampusMap'
import { CHART, Legend, MultiLine } from '../components/charts'
import { Card, CardHeader, PageHeader, StatRows } from '../components/ui'
import { BUILDINGS, FORECAST, FORECAST_SUMMARY, LAST_UPDATED } from '../data/mock'

const SERIES = [
  { key: 'now', name: '현재', color: CHART.dark },
  { key: 'h1', name: '1시간 후', color: '#5b8def' },
  { key: 'h3', name: '3시간 후', color: '#f97316' },
]

export default function ForecastPage() {
  return (
    <>
      <PageHeader title="실시간 전력 예측" subtitle="건물별 실시간 전력 사용량과 예측 데이터를 확인할 수 있습니다." />

      <p className="mb-3 flex items-center justify-end gap-2 text-sm text-gray-500">
        마지막 업데이트: {LAST_UPDATED}
        <button aria-label="새로고침" className="text-gray-600 hover:text-brand-700">
          <RefreshCw className="size-4" />
        </button>
      </p>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card className="justify-center p-4">
          <CampusMap callouts={BUILDINGS} legend linkTo={(b) => `/forecast/${b.id}`} />
          <p className="pb-1 text-center text-xs text-gray-400">말풍선을 누르면 건물별 예측 상세로 이동합니다.</p>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="실시간 요약" />
            <StatRows rows={FORECAST_SUMMARY.map((r) => ({ label: r.label, value: r.value }))} />
          </Card>
          <Card className="flex-1">
            <CardHeader title="건물별 예측 추이" sub="(kW)" />
            <div className="px-5">
              <Legend items={SERIES} />
            </div>
            <div className="px-2 pt-2 pb-4">
              <MultiLine data={FORECAST} x="name" series={SERIES} height={240} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
