import { CalendarDays } from 'lucide-react'
import { useState } from 'react'
import { BuildingThumb } from '../components/CampusMap'
import { Badge, Button, Card, CardHeader, MoreLink, PageHeader, SelectBox, StatRows, cx } from '../components/ui'
import { CLASSROOMS, getBuilding } from '../data/mock'

export default function ClassroomPage() {
  const [selectedId, setSelectedId] = useState(CLASSROOMS[0].id)
  const selected = CLASSROOMS.find((c) => c.id === selectedId)!
  const building = getBuilding(selected.buildingId)!

  return (
    <>
      <PageHeader title="강의실 추천" subtitle="전력 소비량과 이동 동선을 고려한 최적의 강의실을 추천합니다." />

      <div className="flex flex-wrap items-end gap-6 rounded-2xl border border-gray-200/70 bg-white px-6 py-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500">강의 일시</span>
          <SelectBox value="2026.04.29 (수) 10:00 - 12:00" icon={<CalendarDays className="size-4" />} className="min-w-80" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500">예상 인원</span>
          <SelectBox value="60 명" options={['30 명', '60 명', '90 명', '120 명']} />
        </div>
        <Button className="px-6 py-2.5">추천 받기</Button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card>
          <CardHeader title="추천 결과" />
          <ul className="flex flex-col gap-3 px-6 pb-4">
            {CLASSROOMS.map((c, i) => {
              const active = c.id === selectedId
              return (
                <li key={c.id} className={cx('flex items-center gap-5 rounded-xl border px-5 py-4 transition-colors', active ? 'border-brand-600 bg-brand-100/40' : 'border-gray-200/80')}>
                  <span className="text-2xl font-bold">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{c.room}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      <Badge tone="blue">도보 {c.walk}분</Badge>
                      <Badge tone="green">전력 효율 {c.efficiency}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-gray-500">예상 전력 사용량 {c.expectKwh} kWh</p>
                  </div>
                  <Button variant={active ? 'primary' : 'outline'} onClick={() => setSelectedId(c.id)}>
                    {active ? '선택됨' : '선택'}
                  </Button>
                </li>
              )
            })}
          </ul>
          <MoreLink />
        </Card>

        <Card>
          <CardHeader title="선택한 강의실 정보" />
          <div className="px-6">
            <p className="mb-3 text-lg font-bold">{selected.room}</p>
            <BuildingThumb building={building} className="h-48 w-full" />
            <p className="mt-1.5 text-xs text-gray-400">
              {building.name} ({building.code}) 위치
            </p>
          </div>
          <StatRows
            rows={[
              { label: '수용 인원', value: `${selected.capacity} 명` },
              { label: '층수', value: `${selected.floor}층` },
              { label: '시설', value: selected.facilities },
              { label: '예상 전력 사용량', value: `${selected.expectKwh} kWh` },
            ]}
          />
          <div className="mt-auto p-6 pt-0">
            <Button className="w-full py-3">선택하기</Button>
          </div>
        </Card>
      </div>
    </>
  )
}
