import { Leaf } from 'lucide-react'
import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardHeader, PageHeader, SelectBox } from '../../components/ui'
import { BUILDINGS, SEASONAL } from '../../data/mock'

const COLORS = ['#5fae86', '#2f8a5b', '#8cc7a6', '#b9dcc8']

export default function SeasonalDetailPage() {
  const options = BUILDINGS.map((b) => `${b.code} ${b.name}`)
  const [building, setBuilding] = useState(options[0])
  const b = BUILDINGS[options.indexOf(building)]
  const scale = b.monthKwh / 12542 / 1.83
  const data = SEASONAL.map((s) => ({ name: s.season, value: Math.round(s.cur * scale) }))
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <>
      <PageHeader title="계절별 상세 분석" back={{ to: '/power/seasonal', trail: ['전력 소비 시각화', '계절별'] }} />

      <div className="mb-5 flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500">연도 선택</span>
          <SelectBox value="2026년" options={['2026년', '2025년']} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500">건물</span>
          <SelectBox value={building} options={options} onChange={setBuilding} />
        </div>
      </div>

      <Card>
        <CardHeader title="계절별 전력 사용량" sub="(kWh)" />
        <div className="grid grid-cols-1 items-center gap-8 px-6 pb-6 lg:grid-cols-[360px_1fr]">
          <div className="relative h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={data} dataKey="value" innerRadius="58%" outerRadius="95%" paddingAngle={2} stroke="none">
                  {data.map((d, i) => (
                    <Cell key={d.name} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()} kWh`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-xs text-gray-500">연간 총 사용량</p>
                <p className="text-xl font-bold">{total.toLocaleString()} kWh</p>
              </div>
            </div>
          </div>
          <ul className="flex flex-col gap-5">
            {data.map((d, i) => (
              <li key={d.name} className="flex items-center gap-3 text-sm">
                <span className="size-3 rounded-full" style={{ background: COLORS[i] }} />
                <span className="flex-1 text-gray-700">{d.name}</span>
                <span className="font-semibold">{d.value.toLocaleString()} kWh</span>
                <span className="w-16 text-right text-gray-400">({((d.value / total) * 100).toFixed(1)}%)</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="mt-5 flex-row items-center gap-5 bg-gray-50 px-6 py-5">
        <span className="grid size-12 place-items-center rounded-full bg-white text-brand-700">
          <Leaf className="size-6" />
        </span>
        <div>
          <p className="font-bold">인사이트</p>
          <p className="mt-0.5 text-sm text-gray-600">여름철 냉방 사용 증가로 인해 전력 사용량이 가장 높습니다.</p>
        </div>
      </Card>
    </>
  )
}
