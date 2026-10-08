import { CalendarDays } from 'lucide-react'
import { useState } from 'react'
import { AreaTrend, CHART, GroupedBars, Legend } from '../../components/charts'
import { Card, CardHeader, MoreLink, Segmented, SelectBox, StatRows } from '../../components/ui'
import { HOURLY, HOURLY_COMPARE } from '../../data/mock'
import PowerTabs from './PowerTabs'

const total = HOURLY.reduce((s, h) => s + h.kwh, 0)
const peak = HOURLY.reduce((a, b) => (b.kwh > a.kwh ? b : a))
const low = HOURLY.reduce((a, b) => (b.kwh < a.kwh ? b : a))

const COMPARE_SERIES = [
  { key: 'mon', name: '월요일', color: CHART.dark },
  { key: 'wed', name: '수요일', color: CHART.mid },
  { key: 'fri', name: '금요일', color: CHART.light },
]

export default function PowerHourlyPage() {
  const [unit, setUnit] = useState<'kWh' | 'kW'>('kWh')

  return (
    <PowerTabs active="시간대별">
      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-gray-200/70 bg-white px-6 py-3.5">
        <SelectBox label="기간 선택" value="일자 선택" options={['일자 선택', '주간 선택']} />
        <SelectBox value="2026.04.28 (화)" icon={<CalendarDays className="size-4" />} />
        <SelectBox label="비교 건물" value="전체 건물" options={['전체 건물', 'N4 산업정보관', 'S1 도서관']} />
        <div className="ml-auto">
          <Segmented options={['kWh', 'kW'] as const} value={unit} onChange={setUnit} size="sm" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title="시간대별 전력 소비량" sub={`(${unit})`} />
          <div className="px-4 pb-2">
            <AreaTrend data={HOURLY} x="hour" y="kwh" height={320} unit={unit} />
          </div>
          <MoreLink to="/power/hourly/detail" />
        </Card>
        <Card>
          <CardHeader title="요약 정보" />
          <StatRows
            rows={[
              { label: '일일 총 사용량', value: `${total.toLocaleString()} kWh` },
              { label: '평균 사용량', value: `${Math.round(total / 24).toLocaleString()} kWh` },
              { label: '최대 사용량', value: <>{peak.kwh.toLocaleString()} kWh <span className="font-normal text-gray-400">({peak.hour})</span></> },
              { label: '최소 사용량', value: <>{low.kwh.toLocaleString()} kWh <span className="font-normal text-gray-400">({low.hour})</span></> },
            ]}
          />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title="시간대별 비교" right={<Legend items={COMPARE_SERIES} />} />
          <div className="px-4 pb-4">
            <GroupedBars data={HOURLY_COMPARE} x="label" series={COMPARE_SERIES} height={220} />
          </div>
        </Card>
        <Card>
          <CardHeader title="피크 시간 분석" />
          <StatRows
            rows={[
              { label: '피크 시간', value: `${peak.hour} ~ ${String(parseInt(peak.hour) + 1).padStart(2, '0')}:00` },
              { label: '피크 사용량', value: `${peak.kwh.toLocaleString()} kWh` },
              { label: '평균 대비', value: `${Math.round((peak.kwh / (total / 24)) * 100)}%` },
            ]}
          />
        </Card>
      </div>
    </PowerTabs>
  )
}
