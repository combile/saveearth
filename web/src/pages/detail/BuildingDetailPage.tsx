import { Navigate, useParams } from 'react-router-dom'
import { BuildingThumb } from '../../components/CampusMap'
import { AreaTrend } from '../../components/charts'
import { Card, CardHeader, Delta, PageHeader } from '../../components/ui'
import { BUILDINGS, DAILY, getBuilding } from '../../data/mock'

export default function BuildingDetailPage() {
  const { id = '' } = useParams()
  const b = getBuilding(id)
  if (!b) return <Navigate to="/power/building" replace />

  const rank = BUILDINGS.findIndex((v) => v.id === b.id) + 1
  const scale = b.monthKwh / 12542
  const daily = DAILY.map((d) => ({ ...d, kwh: Math.round(d.kwh * scale) }))

  return (
    <>
      <PageHeader title={`건물 상세 - ${b.code} ${b.name}`} back={{ to: '/power/building', trail: ['전력 소비 시각화', '건물별'] }} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Card className="p-5">
          <BuildingThumb building={b} className="h-44 w-full" />
          <dl className="mt-5 flex flex-col gap-4 text-sm">
            {[
              ['건물명', `${b.code} ${b.name}`],
              ['연면적', `${b.area.toLocaleString()} ㎡`],
              ['준공연도', `${b.builtYear}년`],
              ['주요 용도', b.usage],
              ['실시간 사용량', `${b.kw.toLocaleString()} kW`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-gray-500">{k}</dt>
                <dd className="mt-0.5 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Card className="px-6 py-5">
              <p className="text-sm text-gray-600">이번 달 사용량</p>
              <p className="mt-1 text-[28px] font-bold">
                {b.monthKwh.toLocaleString()}
                <span className="ml-1 text-sm font-normal text-gray-500">kWh</span>
              </p>
              <Delta value={b.delta} compare="전월 대비" />
            </Card>
            <Card className="px-6 py-5">
              <p className="text-sm text-gray-600">평균 일일 사용량</p>
              <p className="mt-1 text-[28px] font-bold">
                {Math.round(b.monthKwh / 30).toLocaleString()}
                <span className="ml-1 text-sm font-normal text-gray-500">kWh</span>
              </p>
            </Card>
            <Card className="px-6 py-5">
              <p className="text-sm text-gray-600">전력 사용 순위</p>
              <p className="mt-1 text-[28px] font-bold">
                {rank}
                <span className="ml-1 text-sm font-normal text-gray-500">위 / {BUILDINGS.length}개 건물</span>
              </p>
            </Card>
          </div>

          <Card className="flex-1">
            <CardHeader title="일별 전력 사용량" sub="(kWh)" />
            <div className="px-4 pb-4">
              <AreaTrend data={daily} x="date" y="kwh" height={320} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
