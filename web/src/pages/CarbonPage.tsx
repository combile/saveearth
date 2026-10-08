import { Building2, Leaf, TreeDeciduous, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART, SimpleBars } from '../components/charts'
import { Card, CardHeader, Delta, KpiCard, PageHeader } from '../components/ui'
import { CAMPUS_CARBON } from '../data/mock'

const COLORS = [CHART.dark, CHART.mid, CHART.light]

export default function CarbonPage() {
  const c = CAMPUS_CARBON
  const total = c.breakdown.reduce((s, b) => s + b.value, 0)
  const prev = c.monthly[c.monthly.length - 2].saved
  const maxSaved = c.buildingRank[0].saved

  return (
    <>
      <PageHeader title="캠퍼스 탄소 절감 현황" subtitle="한밭대 구성원 모두의 노력으로 줄인 탄소 배출량을 확인하세요." />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        <KpiCard
          icon={<Leaf />}
          tone="green"
          label="이번 달 탄소 절감량"
          value={String(c.monthSavedT)}
          unit="tCO₂"
          foot={<span className="font-medium text-good">지난달보다 +{(c.monthSavedT - prev).toFixed(1)} t</span>}
        />
        <KpiCard icon={<TreeDeciduous />} tone="lime" label="나무 환산" value={c.trees.toLocaleString()} unit="그루" foot="이번 달 심은 효과" />
        <KpiCard icon={<TrendingDown />} tone="purple" label="전년 동월 대비 배출량" value={String(Math.abs(c.yoy))} unit="% 감소" foot={<Delta value={c.yoy} compare="2025년 4월 대비" />} />
        <KpiCard icon={<Building2 />} tone="teal" label="강의실 추천 이용" value={c.recommendUses.toLocaleString()} unit="회" foot="이번 학기 누적" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader title="월별 탄소 절감량" sub="(tCO₂)" />
          <div className="px-4 pb-4">
            <SimpleBars data={c.monthly} x="month" y="saved" unit="tCO₂" height={300} />
          </div>
        </Card>

        <Card>
          <CardHeader title="절감 요인" sub="(이번 달)" />
          <div className="relative mx-auto h-52 w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={c.breakdown} dataKey="value" innerRadius="60%" outerRadius="95%" paddingAngle={2} stroke="none">
                  {c.breakdown.map((b, i) => (
                    <Cell key={b.name} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} tCO₂`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-xs text-gray-500">합계</p>
                <p className="text-lg font-bold">{total.toFixed(1)} t</p>
              </div>
            </div>
          </div>
          <ul className="flex flex-col gap-3 px-6 py-5">
            {c.breakdown.map((b, i) => (
              <li key={b.name} className="flex items-center gap-3 text-sm">
                <span className="size-3 rounded-full" style={{ background: COLORS[i] }} />
                <span className="flex-1 text-gray-700">{b.name}</span>
                <span className="font-semibold">{b.value} tCO₂</span>
                <span className="w-12 text-right text-gray-400">{Math.round((b.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader title="건물별 절감 순위" sub="(이번 달, kgCO₂)" />
          <ul className="mx-5 mb-5 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {c.buildingRank.map((b, i) => (
              <li key={b.code} className="flex items-center gap-4 px-5 py-3.5 text-sm">
                <span className="w-4 font-bold">{i + 1}</span>
                <span className="w-36 shrink-0">
                  <b className="mr-2">{b.code}</b>
                  {b.name}
                </span>
                <div className="flex flex-1 items-center">
                  <div className="h-2 rounded-full bg-brand-700" style={{ width: `${(b.saved / maxSaved) * 100}%` }} />
                </div>
                <span className="w-16 text-right font-semibold">{b.saved}</span>
                <span className="flex w-20 justify-end">
                  <Delta value={b.yoy} />
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <section className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-brand-900 to-[#04463b] p-6 text-white">
          <div>
            <span className="grid size-12 place-items-center rounded-full bg-white/10">
              <Leaf className="size-6 text-[#9bd36a]" />
            </span>
            <p className="mt-4 text-lg font-bold">나도 탄소 절감에 참여하기</p>
            <p className="mt-1.5 text-sm text-white/75">
              스터디나 모임 장소를 정할 때 강의실 추천을 이용해 보세요. 이동 거리와 건물 전력 상태를 고려해 에너지 효율이 높은 강의실을 알려드려요.
            </p>
          </div>
          <Link to="/classroom" className="mt-6 rounded-lg bg-white py-2.5 text-center text-sm font-semibold text-brand-900 hover:bg-white/90">
            강의실 추천 받기
          </Link>
        </section>
      </div>
    </>
  )
}
