import { CalendarDays, ChartNoAxesCombined, Cloud, Download, Leaf, Lightbulb, Settings2, TrendingDown, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART, Sparkline } from '../../components/charts'
import { Button, Card, CardHeader, Delta, KpiCard, MoreLink, Segmented, SelectBox } from '../../components/ui'
import { BUILDINGS } from '../../data/mock'
import PowerTabs from './PowerTabs'

const total = BUILDINGS.reduce((s, b) => s + b.monthKwh, 0)
const rows = BUILDINGS.map((b) => ({ ...b, share: ((b.monthKwh / total) * 100).toFixed(1) }))
const max = rows[0].monthKwh

function BuildingTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const b = BUILDINGS.find((v) => v.code === payload?.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" dy={14} fontSize={13} fill="#333">
        {payload?.value}
      </text>
      <text textAnchor="middle" dy={32} fontSize={12} fill="#8a8f8d">
        {b?.name}
      </text>
    </g>
  )
}

export default function PowerBuildingPage() {
  const [unit, setUnit] = useState<'kWh' | 'kW'>('kWh')
  const key = unit === 'kWh' ? 'monthKwh' : 'kw'

  return (
    <PowerTabs active="건물별">
      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-gray-200/70 bg-white px-6 py-3.5">
        <SelectBox label="기간 선택" value="2026.04.01 - 2026.04.30" icon={<CalendarDays className="size-4" />} />
        <SelectBox label="비교 선택" value="전체 건물" options={['전체 건물', 'N동', 'S동']} />
        <Button variant="outline" className="ml-auto">
          <Settings2 className="size-4" /> 비교 설정
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        <KpiCard icon={<Zap />} tone="teal" label="총 전력 사용량" value="2,342" unit="kW" foot={<Delta value={-6.4} compare="전월 대비" />} />
        <KpiCard icon={<Leaf />} tone="lime" label="평균 일일 사용량" value="75.5" unit="kW" foot={<Delta value={-5.1} compare="전월 대비" />} />
        <KpiCard icon={<ChartNoAxesCombined />} tone="purple" label="최대 사용량" value="1,652" unit="kW" foot="2026.04.15" />
        <KpiCard icon={<Cloud />} tone="green" label="추정 탄소 배출량" value="583" unit="tCO₂" foot={<Delta value={-4.9} compare="전월 대비" />} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardHeader
            title="건물별 전력 소비량"
            sub={`(${unit})`}
            right={
              <>
                <Button variant="outline">
                  <Download className="size-4" /> 차트 다운로드
                </Button>
                <Segmented options={['kWh', 'kW'] as const} value={unit} onChange={setUnit} size="sm" />
              </>
            }
          />
          <div className="px-4 pb-2">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={BUILDINGS.slice(0, 6)} margin={{ top: 24, right: 8, left: -4, bottom: 16 }}>
                <CartesianGrid vertical={false} stroke={CHART.grid} />
                <XAxis dataKey="code" axisLine={false} tickLine={false} tick={<BuildingTick />} interval={0} />
                <YAxis tick={CHART.axis} axisLine={false} tickLine={false} tickFormatter={(v: number) => v.toLocaleString()} />
                <Tooltip cursor={{ fill: '#f3f6f4' }} formatter={(v) => `${Number(v).toLocaleString()} ${unit}`} />
                <Bar dataKey={key} fill={CHART.dark} radius={[3, 3, 0, 0]} maxBarSize={64} isAnimationActive={false}>
                  <LabelList dataKey={key} position="top" fontSize={13} fill="#333" formatter={(v) => Number(v).toLocaleString()} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <MoreLink down />
        </Card>

        <Card>
          <CardHeader title="상위 건물" />
          <ol className="mx-5 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {rows.slice(0, 5).map((b, i) => (
              <li key={b.id}>
                <Link to={`/power/building/${b.id}`} className="flex gap-4 px-4 py-2.5 hover:bg-gray-50">
                  <span className="w-3 font-bold">{i + 1}</span>
                  <div className="text-sm">
                    <p>
                      <b className="mr-2">{b.code}</b>
                      {b.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {b.monthKwh.toLocaleString()} kWh <span className="text-good">({b.share}%)</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          <div className="p-5">
            <Button variant="outline" className="w-full">
              전체 건물 보기 →
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_480px]">
        <Card>
          <CardHeader title="건물별 상세 데이터" />
          <div className="mx-5 overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr className="[&>th]:px-4 [&>th]:py-2.5 [&>th]:font-medium">
                  <th className="text-left">순위</th>
                  <th className="text-left">건물명</th>
                  <th className="text-left">전력 사용량 (kWh)</th>
                  <th>전월 대비</th>
                  <th>비중</th>
                  <th>추이</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.slice(0, 6).map((b, i) => (
                  <tr key={b.id} className="hover:bg-gray-50 [&>td]:px-4 [&>td]:py-2">
                    <td>{i + 1}</td>
                    <td className="whitespace-nowrap">
                      <Link to={`/power/building/${b.id}`} className="hover:text-brand-700">
                        <b className="mr-2 font-medium">{b.code}</b>
                        {b.name}
                      </Link>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-brand-700" style={{ width: `${(b.monthKwh / max) * 160}px` }} />
                        {b.monthKwh.toLocaleString()}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="inline-flex">
                        <Delta value={b.delta} />
                      </span>
                    </td>
                    <td className="text-center">{b.share}%</td>
                    <td>
                      <Sparkline data={b.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MoreLink down />
        </Card>

        <Card>
          <CardHeader title="인사이트" />
          <ul className="mx-5 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {[
              { icon: <Lightbulb />, bg: 'bg-amber-50 text-amber-500', t: `${rows[0].name}(${rows[0].code})이 가장 많은 전력을 사용하고 있어요.`, d: `전체 사용량의 ${rows[0].share}%를 차지합니다.` },
              { icon: <TrendingDown />, bg: 'bg-brand-100 text-brand-700', t: '전월 대비 전체 사용량이 6.4% 감소했어요.', d: '지속적인 절감 노력이 효과를 보이고 있어요!' },
              { icon: <Zap />, bg: 'bg-red-50 text-red-400', t: '오후 2시 ~ 4시 사이 사용량이 가장 많아요.', d: '시간대별 분석을 통해 피크 시간 관리를 추천드려요.' },
            ].map((x) => (
              <li key={x.t} className="flex gap-4 px-5 py-4">
                <span className={`grid size-11 shrink-0 place-items-center rounded-full [&>svg]:size-5 ${x.bg}`}>{x.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{x.t}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-auto p-5">
            <Button variant="outline" className="w-full">
              인사이트 더보기 →
            </Button>
          </div>
        </Card>
      </div>
    </PowerTabs>
  )
}
