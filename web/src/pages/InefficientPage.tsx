import { Leaf } from 'lucide-react'
import CampusMap from '../components/CampusMap'
import { Badge, Card, CardHeader, PageHeader } from '../components/ui'
import { INEFFICIENT, getBuilding } from '../data/mock'

const STATUS = { danger: '매우 높음', warn: '주의', good: '보통' } as const

export default function InefficientPage() {
  return (
    <>
      <PageHeader title="비효율 구역 분석" subtitle="전력 사용 효율이 낮은 구역과 낭비 가능성이 높은 구역을 확인하세요." />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <Card>
          <CardHeader title="비효율 구역 TOP 5" />
          <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:font-medium">
                  <th>순위</th>
                  <th className="text-left">구역</th>
                  <th className="text-red-400">비효율 지수</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {INEFFICIENT.map((z) => (
                  <tr key={z.rank} className="[&>td]:px-4 [&>td]:py-3.5">
                    <td className="text-center font-semibold">{z.rank}</td>
                    <td>{z.place}</td>
                    <td className="text-center">{z.ratio}%</td>
                    <td className="text-center">
                      <Badge tone={z.status}>{STATUS[z.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="비효율 구역 지도" />
          <div className="flex flex-1 items-center px-5 pb-5">
            <CampusMap pins={INEFFICIENT.map((z) => ({ building: getBuilding(z.buildingId)!, tone: z.status }))} />
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader title="비효율 지수 안내" />
        <div className="px-6 pb-6">
          <p className="mb-4 text-sm text-gray-600">비효율 지수는 유사 시간대, 유사 면적 대비 전력 사용량의 비율을 의미합니다.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <span className="flex items-center justify-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 py-3 text-sm font-medium text-emerald-700">
              <Leaf className="size-4" /> 양호 (≤100%)
            </span>
            <span className="rounded-lg border border-amber-100 bg-amber-50 py-3 text-center text-sm font-medium text-amber-600">주의 (100~120%)</span>
            <span className="rounded-lg border border-red-100 bg-red-50 py-3 text-center text-sm font-medium text-red-500">비효율 (≥120%)</span>
          </div>
        </div>
      </Card>
    </>
  )
}
