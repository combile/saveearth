import { Navigate, useParams } from 'react-router-dom'
import { BuildingThumb } from '../../components/CampusMap'
import { AreaTrend } from '../../components/charts'
import { Card, CardHeader, PageHeader } from '../../components/ui'
import { REALTIME_TREND, getBuilding, levelOf } from '../../data/mock'

export default function ForecastDetailPage() {
  const { id = '' } = useParams()
  const b = getBuilding(id)
  if (!b) return <Navigate to="/forecast" replace />

  const scale = b.kw / 1380
  const trend = REALTIME_TREND.map((t) => ({ ...t, kw: Math.round(t.kw * scale) }))
  const reserve = levelOf(b.kw) === 'high' ? { v: '15.2% (주의)', c: 'text-red-500' } : { v: '24.8% (양호)', c: 'text-good' }

  return (
    <>
      <PageHeader title={`건물 예측 상세 - ${b.code} ${b.name}`} back={{ to: '/forecast', trail: ['실시간 전력 예측'] }} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Card className="p-5">
          <BuildingThumb building={b} className="h-44 w-full" />
          <dl className="mt-5 flex flex-col gap-4 text-sm">
            {[
              ['건물명', `${b.code} ${b.name}`],
              ['연면적', `${b.area.toLocaleString()} ㎡`],
              ['현재 사용량', `${b.kw.toLocaleString()} kW`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-gray-500">{k}</dt>
                <dd className="mt-0.5 font-semibold">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs text-gray-500">전력 예비율</dt>
              <dd className={`mt-0.5 font-semibold ${reserve.c}`}>{reserve.v}</dd>
            </div>
          </dl>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="예측 사용량" sub="(kW)" />
            <div className="grid grid-cols-3 gap-4 px-6 pb-6">
              {[
                ['1시간 후', 1.074],
                ['3시간 후', 1.24],
                ['6시간 후', 1.373],
              ].map(([label, f]) => (
                <div key={label} className="rounded-xl border border-gray-200/80 py-4 text-center">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="mt-1 text-2xl font-bold">
                    {Math.round(b.kw * (f as number)).toLocaleString()} <span className="text-sm font-normal text-gray-500">kW</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex-1">
            <CardHeader title="실시간 사용량 추이" sub="(kW)" />
            <div className="px-4 pb-4">
              <AreaTrend data={trend} x="time" y="kw" color="#ef4444" unit="kW" height={300} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
