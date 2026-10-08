import { Leaf, Triangle } from 'lucide-react'
import { CHART, GroupedBars, Legend } from '../../components/charts'
import { Card, CardHeader, MoreLink, SelectBox } from '../../components/ui'
import { SEASONAL } from '../../data/mock'
import PowerTabs from './PowerTabs'

const SERIES = [
  { key: 'cur', name: '2026년', color: CHART.mid },
  { key: 'prev', name: '2025년', color: CHART.light },
]

const pct = (a: number, b: number) => (((a - b) / b) * 100).toFixed(1)
const sumCur = SEASONAL.reduce((s, x) => s + x.cur, 0)
const sumPrev = SEASONAL.reduce((s, x) => s + x.prev, 0)

export default function PowerSeasonalPage() {
  return (
    <PowerTabs active="계절별">
      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-gray-200/70 bg-white px-6 py-3.5">
        <SelectBox label="연도 선택" value="2026년" options={['2026년', '2025년', '2024년']} />
        <SelectBox label="비교 기준" value="전년도(2025년)" options={['전년도(2025년)', '2년 전(2024년)']} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card>
          <CardHeader title="계절별 전력 소비량" sub="(kWh)" right={<Legend items={SERIES} />} />
          <div className="px-4 pb-2">
            <GroupedBars data={SEASONAL} x="season" series={SERIES} height={340} labels />
          </div>
          <MoreLink to="/power/seasonal/detail" />
        </Card>
        <Card>
          <CardHeader title="계절별 비교" />
          <dl className="divide-y divide-gray-100 px-6 pb-4">
            {[...SEASONAL.map((s) => ({ label: s.season.split(' ')[0], v: pct(s.cur, s.prev) })), { label: '연간 총 사용량', v: pct(sumCur, sumPrev) }].map((r) => (
              <div key={r.label} className="flex items-center justify-between py-4 text-sm">
                <dt className="text-gray-600">{r.label}</dt>
                <dd className="flex items-center gap-1 font-semibold text-good">
                  <Triangle className="size-2.5 fill-current" />
                  {r.v}%
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <Card className="mt-5 flex-row items-center gap-5 px-6 py-5">
        <span className="grid size-12 place-items-center rounded-full bg-brand-100 text-brand-700">
          <Leaf className="size-6" />
        </span>
        <div>
          <p className="font-bold">계절별 인사이트</p>
          <p className="mt-0.5 text-sm text-gray-600">여름철(6~8월) 전력 사용량이 가장 높으며, 전년 대비 {pct(SEASONAL[1].cur, SEASONAL[1].prev)}% 증가했습니다.</p>
        </div>
      </Card>
    </PowerTabs>
  )
}
