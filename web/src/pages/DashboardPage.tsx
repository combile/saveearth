import { ChartNoAxesCombined, Cloud, Leaf, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import CampusMap from '../components/CampusMap'
import { CHART, GroupedBars, SimpleBars } from '../components/charts'
import { Badge, Button, Card, CardHeader, Delta, KpiCard, MoreLink, PageHeader, Segmented, SelectBox } from '../components/ui'
import { BUILDINGS, CLASSROOMS, DASHBOARD_KPIS, HOURLY, INEFFICIENT, CAMPUS_CARBON, SEASONAL, getBuilding } from '../data/mock'

const KPI_ICONS = {
  now: { icon: <Zap />, tone: 'teal' },
  today: { icon: <Leaf />, tone: 'lime' },
  month: { icon: <ChartNoAxesCombined />, tone: 'purple' },
  carbon: { icon: <Cloud />, tone: 'green' },
} as const

const TABS = ['건물별', '시간대별', '계절별'] as const

const STATUS_LABEL = { danger: '비효율', warn: '주의', good: '양호' } as const
const RANK_BG = ['bg-red-500', 'bg-orange-500', 'bg-amber-400']

export default function DashboardPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('건물별')
  const { admin } = useAuth()

  return (
    <>
      <PageHeader title="안녕하세요, 한밭대학교!" subtitle="지속 가능한 캠퍼스를 위한 오늘의 전력 현황입니다." />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {DASHBOARD_KPIS.map((k) => (
          <KpiCard key={k.key} {...KPI_ICONS[k.key]} label={k.label} value={k.value} unit={k.unit} foot={<Delta value={k.delta} compare={k.compare} />} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Card>
          <CardHeader title="건물별 전력 소비량" info right={<SelectBox value="오늘" options={['오늘', '이번 주', '이번 달']} />} />
          <div className="px-6">
            <Segmented options={TABS} value={tab} onChange={setTab} />
          </div>
          <div className="px-4 pt-3 pb-2">
            {tab === '건물별' && <SimpleBars data={BUILDINGS.slice(0, 6)} x="code" y="kw" unit="kWh" />}
            {tab === '시간대별' && <SimpleBars data={HOURLY.filter((_, i) => i % 4 === 0)} x="hour" y="kwh" unit="kWh" />}
            {tab === '계절별' && (
              <GroupedBars
                data={SEASONAL.map((s) => ({ ...s, season: s.season.split(' ')[0] }))}
                x="season"
                series={[
                  { key: 'cur', name: '2026년', color: CHART.dark },
                  { key: 'prev', name: '2025년', color: CHART.light },
                ]}
              />
            )}
          </div>
          <MoreLink to={tab === '건물별' ? '/power/building' : tab === '시간대별' ? '/power/hourly' : '/power/seasonal'} />
        </Card>

        <Card>
          <CardHeader title="구역별 실시간 전력 예측 소비량" info right={<SelectBox value="실시간" options={['실시간', '1시간 후', '3시간 후']} />} />
          <div className="flex flex-1 items-center px-6 pb-3">
            <CampusMap callouts={BUILDINGS} legend linkTo={(b) => `/forecast/${b.id}`} />
          </div>
          <MoreLink to="/forecast" />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {admin ? <InefficientCard /> : <CampusCarbonCard />}

        <Card>
          <CardHeader title="전력 소비량 및 이동 동선 기반 강의실 추천" info right={<Button variant="outline">조건 설정</Button>} />
          <ul className="flex flex-col gap-3 px-6 pb-4">
            {CLASSROOMS.map((c, i) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200/80 px-5 py-3.5">
                <span className="w-5 text-lg font-bold">{i + 1}</span>
                <span className="w-28 font-semibold">{c.room}</span>
                <Badge tone="blue">도보 {c.walk}분</Badge>
                <Badge tone="green">전력 효율 {c.efficiency}</Badge>
                <span className="ml-auto text-sm text-gray-500">
                  예상 전력 사용량 <b className="text-base font-semibold text-gray-900">{c.expectKwh} kWh</b>
                </span>
                <Link to="/classroom">
                  <Button className="px-3 py-1.5">선택</Button>
                </Link>
              </li>
            ))}
          </ul>
          <MoreLink to="/classroom" />
        </Card>
      </div>
    </>
  )
}

function InefficientCard() {
  return (
    <Card>
      <CardHeader title="비효율 및 낭비 구역" info />
      <div className="grid flex-1 grid-cols-1 gap-4 px-6 pb-4 sm:grid-cols-2">
        <ul className="divide-y divide-gray-100">
          {INEFFICIENT.slice(0, 3).map((z, i) => (
            <li key={z.rank} className="flex items-center gap-3 py-3.5">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full font-bold text-white ${RANK_BG[i]}`}>{z.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{z.place}</p>
                <p className="text-xs text-gray-500">평균 대비 {z.ratio}% 소비</p>
              </div>
              <Badge tone={z.status}>{STATUS_LABEL[z.status]}</Badge>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden rounded-xl bg-gray-50">
          <CampusMap
            className="scale-[1.6] origin-[45%_40%]"
            pins={INEFFICIENT.slice(0, 3).map((z) => ({ building: getBuilding(z.buildingId)!, tone: z.status }))}
          />
        </div>
      </div>
      <MoreLink to="/inefficient" />
    </Card>
  )
}

/** 공개 대시보드: 비효율 구역(관리자용) 대신 캠퍼스 탄소 절감 요약 */
function CampusCarbonCard() {
  const c = CAMPUS_CARBON
  return (
    <Card>
      <CardHeader title="캠퍼스 탄소 절감 현황" info />
      <div className="grid flex-1 grid-cols-1 gap-4 px-6 pb-4 sm:grid-cols-[200px_1fr]">
        <div className="flex flex-col justify-center rounded-xl bg-brand-100/60 p-5">
          <Leaf className="size-7 text-brand-700" />
          <p className="mt-3 text-sm text-gray-600">이번 달 절감량</p>
          <p className="text-3xl font-bold">
            {c.monthSavedT}
            <span className="ml-1 text-sm font-normal text-gray-500">tCO₂</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">나무 {c.trees.toLocaleString()}그루 심은 효과</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {c.buildingRank.slice(0, 3).map((b, i) => (
            <li key={b.code} className="flex items-center gap-3 py-3.5">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full font-bold text-white ${['bg-brand-900', 'bg-brand-700', 'bg-brand-300'][i]}`}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {b.code} {b.name}
                </p>
                <p className="text-xs text-gray-500">이번 달 {b.saved} kgCO₂ 절감</p>
              </div>
              <Delta value={b.yoy} />
            </li>
          ))}
        </ul>
      </div>
      <MoreLink to="/carbon" />
    </Card>
  )
}
