import { CalendarDays, Download } from 'lucide-react'
import { useState } from 'react'
import { CHART, GroupedBars, Legend } from '../components/charts'
import { Button, Card, CardHeader, Delta, MoreLink, PageHeader, SelectBox, UnderlineTabs } from '../components/ui'
import { DAILY, REPORTS } from '../data/mock'

const TABS = ['요약 리포트', '전력 사용 리포트', '탄소 배출 리포트', '사용자 참여 리포트']
const SERIES = [
  { key: 'kwh', name: '이번 달', color: CHART.dark },
  { key: 'prev', name: '전월', color: CHART.light },
]

export default function ReportPage() {
  const [tab, setTab] = useState(TABS[0])

  return (
    <>
      <PageHeader title="리포트" subtitle="전력 사용 현황과 성과를 리포트로 확인하고 다운로드할 수 있습니다." />
      <UnderlineTabs items={TABS.map((t) => ({ label: t, active: t === tab, onClick: () => setTab(t) }))} />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500">기간 선택</span>
          <SelectBox value="2026.04.01 - 2026.04.30" icon={<CalendarDays className="size-4" />} />
        </div>
        <Button className="px-5 py-2.5">
          <Download className="size-4" /> 다운로드
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {[
          { label: '총 전력 사용량', value: '56,782', unit: 'kWh', foot: <Delta value={-2.1} compare="전월 대비" /> },
          { label: '총 탄소 배출량', value: '853', unit: 'tCO₂', foot: <Delta value={-4.8} compare="전월 대비" /> },
          { label: '최대 전력', value: '1,842', unit: 'kW', foot: '2026.04.15 14:00' },
          { label: '전력 예비율', value: '21.3', unit: '%', foot: <span className="font-medium text-good">양호</span> },
        ].map((k) => (
          <Card key={k.label} className="px-6 py-5">
            <p className="text-sm text-gray-600">{k.label}</p>
            <p className="mt-1 text-[28px] font-bold tracking-tight">
              {k.value}
              <span className="ml-1 text-sm font-normal text-gray-500">{k.unit}</span>
            </p>
            <div className="mt-1 text-sm text-gray-500">{k.foot}</div>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card>
          <CardHeader title="일일 전력 사용량 추이" sub="(kWh)" right={<Legend items={SERIES} />} />
          <div className="px-4 pb-4">
            <GroupedBars data={DAILY} x="date" series={SERIES} height={300} />
          </div>
        </Card>
        <Card>
          <CardHeader title="리포트 목록" />
          <ul className="mx-5 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {REPORTS.map((r) => (
              <li key={r.title} className="flex items-center justify-between px-4 py-4 text-sm hover:bg-gray-50">
                <span className="font-medium">{r.title}</span>
                <span className="text-gray-400">{r.date}</span>
              </li>
            ))}
          </ul>
          <MoreLink />
        </Card>
      </div>
    </>
  )
}
