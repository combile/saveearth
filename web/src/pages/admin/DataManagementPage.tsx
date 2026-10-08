import { Activity, CircleAlert, Database, Download, FileUp, Radio, Upload } from 'lucide-react'
import { Badge, Button, Card, CardHeader, KpiCard, PageHeader, cx } from '../../components/ui'
import { DATA_SOURCES, LAST_UPDATED, MQTT_INFO, SENSORS, UPLOADS } from '../../data/mock'

const SOURCE_STATUS = {
  ok: { tone: 'good', label: '수신 중' },
  pending: { tone: 'warn', label: '자료 대기' },
  none: { tone: 'blue', label: '연동 예정' },
} as const

export default function DataManagementPage() {
  const online = SENSORS.filter((s) => s.status === 'online').length
  const offline = SENSORS.length - online

  return (
    <>
      <PageHeader title="데이터 관리" subtitle="전력 측정 센서와 데이터 수집 현황을 관리합니다." />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        <KpiCard icon={<Radio />} tone="teal" label="연결된 센서" value={`${online}`} unit={`/ ${SENSORS.length}개`} foot={offline ? <span className="text-red-500">{offline}개 응답 없음</span> : '모두 정상'} />
        <KpiCard icon={<Activity />} tone="lime" label="오늘 수집 건수" value="10,080" unit="건" foot={`${MQTT_INFO.interval} 간격 수집`} />
        <KpiCard icon={<Database />} tone="purple" label="누적 저장 데이터" value="1.2" unit="GB" foot="SD 카드 CSV + 서버 DB" />
        <KpiCard icon={<CircleAlert />} tone="green" label="마지막 수신" value={LAST_UPDATED.split(' ')[1]} unit="" foot={LAST_UPDATED.split(' ')[0]} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card>
          <CardHeader title="센서 상태" sub="S8 건설공학관 3층 분전반 · CT 클램프 센서" />
          <div className="mx-5 mb-5 overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr className="[&>th]:px-4 [&>th]:py-2.5 [&>th]:text-left [&>th]:font-medium">
                  <th>센서 ID</th>
                  <th>측정 회로</th>
                  <th>구분</th>
                  <th className="!text-right">현재 전력</th>
                  <th className="!text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SENSORS.map((s) => (
                  <tr key={s.id} className={cx('[&>td]:px-4 [&>td]:py-2.5', s.status === 'offline' && 'bg-red-50/40')}>
                    <td className="font-mono text-xs">{s.id}</td>
                    <td className="font-medium">{s.circuit}</td>
                    <td className="text-gray-500">{s.type}</td>
                    <td className="text-right">{s.value == null ? <span className="text-gray-300">-</span> : `${s.value.toFixed(2)} kW`}</td>
                    <td className="text-center">
                      {s.status === 'online' ? <Badge tone="good">정상</Badge> : <Badge tone="danger">응답 없음</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="MQTT 연결" right={<Badge tone="good">연결됨</Badge>} />
            <dl className="flex flex-col gap-3 px-6 pb-6 text-sm">
              {[
                ['브로커', MQTT_INFO.broker],
                ['토픽', MQTT_INFO.topic],
                ['전송 주기', MQTT_INFO.interval],
                ['장치', 'ESP32 DevKit V1 + PZEM-004T × 5'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="text-right font-mono text-xs leading-5">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="flex-1">
            <CardHeader title="데이터 업로드" />
            <div className="px-6 pb-6">
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-7 text-center text-sm text-gray-500 hover:border-brand-600 hover:bg-brand-100/30">
                <FileUp className="size-7 text-brand-700" />
                <span>
                  SD 카드 로그(CSV) 또는 건물 전력 자료를
                  <br />
                  끌어다 놓거나 <b className="text-brand-700">파일 선택</b>
                </span>
                <input type="file" accept=".csv" className="hidden" />
              </label>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader title="데이터 출처" />
          <ul className="mx-5 mb-5 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {DATA_SOURCES.map((d) => (
              <li key={d.building} className="flex items-center gap-4 px-5 py-3.5 text-sm">
                <div className="flex-1">
                  <p className="font-semibold">{d.building}</p>
                  <p className="text-xs text-gray-500">
                    {d.source} · {d.unit}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{d.lastSync}</span>
                <Badge tone={SOURCE_STATUS[d.status].tone}>{SOURCE_STATUS[d.status].label}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="업로드 기록"
            right={
              <Button variant="outline">
                <Download className="size-4" /> 전체 내보내기
              </Button>
            }
          />
          <ul className="mx-5 mb-5 divide-y divide-gray-100 rounded-xl border border-gray-100">
            {UPLOADS.map((u) => (
              <li key={u.file} className="flex items-center gap-4 px-5 py-3.5 text-sm">
                <Upload className="size-4 text-gray-400" />
                <div className="flex-1">
                  <p className="font-mono text-xs font-semibold">{u.file}</p>
                  <p className="text-xs text-gray-500">
                    {u.rows.toLocaleString()}행 · {u.by}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{u.date}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
