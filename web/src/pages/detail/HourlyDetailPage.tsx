import { CalendarDays } from 'lucide-react'
import { AreaTrend, Legend } from '../../components/charts'
import { Card, CardHeader, PageHeader, SelectBox } from '../../components/ui'
import { HOURLY } from '../../data/mock'

const peak = HOURLY.reduce((a, b) => (b.kwh > a.kwh ? b : a))
const BANDS = [
  { label: '야간 (00시~06시)', from: 0, to: 6 },
  { label: '오전 (06시~12시)', from: 6, to: 12 },
  { label: '오후 (12시~18시)', from: 12, to: 18 },
  { label: '저녁 (18시~24시)', from: 18, to: 24 },
].map((b) => ({ ...b, avg: Math.round(HOURLY.slice(b.from, b.to).reduce((s, h) => s + h.kwh, 0) / (b.to - b.from)) }))

export default function HourlyDetailPage() {
  return (
    <>
      <PageHeader title="시간대별 상세 분석" back={{ to: '/power/hourly', trail: ['전력 소비 시각화', '시간대별'] }} />

      <div className="mb-5 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500">일자 선택</span>
          <SelectBox value="2026.04.28 (화)" icon={<CalendarDays className="size-4" />} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500">비교 기준</span>
          <SelectBox value="7일 평균" options={['7일 평균', '30일 평균', '전년 동일']} />
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-6 px-6 pt-5">
          <div>
            <p className="text-2xl font-bold">{peak.hour}</p>
            <p className="text-xs text-gray-500">피크 시간</p>
          </div>
          <span className="h-10 w-px bg-gray-200" />
          <p className="text-2xl font-bold">
            {peak.kwh.toLocaleString()} <span className="text-sm font-normal text-gray-500">kWh</span>
          </p>
          <div className="ml-auto">
            <Legend items={[{ name: '선택일', color: '#2f8a5b' }, { name: '7일 평균', color: '#f59e0b' }]} />
          </div>
        </div>
        <div className="px-4 pb-4">
          <AreaTrend data={HOURLY} x="hour" y="kwh" compareKey="avg" height={340} />
        </div>
      </Card>

      <Card className="mt-5">
        <CardHeader title="시간대별 요약" />
        <div className="grid grid-cols-2 gap-4 px-6 pb-6 lg:grid-cols-4">
          {BANDS.map((b) => (
            <div key={b.label} className="rounded-xl border border-gray-200/80 px-5 py-4">
              <p className="text-xs text-gray-500">{b.label}</p>
              <p className="mt-1 text-2xl font-bold">
                {b.avg.toLocaleString()} <span className="text-sm font-normal text-gray-500">kWh</span>
              </p>
              <p className="text-xs text-gray-500">평균</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
