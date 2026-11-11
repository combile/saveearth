/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 데이터 출처 표, 자료가 어디서 언제 들어오는지 한 줄씩 · states: full (목업) */
/* critique: 아이콘 KPI 카드와 테두리 상자 목록이 흩어져 있었다. 수집 현황은 한 줄 수치로, 출처·센서·업로드는 모두 가로선 표로 맞춘다 */
/* Hallmark · dropped KPI icons sensors, monitoring, database, error and upload row icon · 수치 옆 아이콘 타일 금지, 라벨은 그대로 */
import { css } from '@emotion/react'
import type { ReactNode } from 'react'
import { Icon } from '../../components/Icon'
import { Badge, Button, Card, CardHeader, PageHeader } from '../../components/ui'
import { DATA_SOURCES, LAST_UPDATED, MQTT_INFO, SENSORS, UPLOADS } from '../../data/mock'
import { bigNumber, theme } from '../../theme'

const SOURCE_STATUS = {
  ok: { tone: 'good', label: '수신 중' },
  pending: { tone: 'warn', label: '자료 대기' },
  none: { tone: 'blue', label: '연동 예정' },
} as const

const c = theme.color
const hover = `background-color 0.2s ${theme.ease}`

const s = {
  stats: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    '& > div': { padding: '16px 20px', minWidth: 0 },
    '& > div:nth-of-type(even)': { borderLeft: `1px solid ${c.lineSoft}` },
    '& > div:nth-of-type(n+3)': { borderTop: `1px solid ${c.lineSoft}` },
    [theme.mq.lg]: {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      '& > div + div': { borderLeft: `1px solid ${c.lineSoft}` },
      '& > div:nth-of-type(n+3)': { borderTop: 0 },
    },
    '& dt': { fontSize: 12, color: c.sub },
  }),
  value: css(bigNumber, { marginTop: 6, fontSize: 22 }),
  unit: css({ marginLeft: 4, fontSize: 12, fontWeight: 400, letterSpacing: 0, color: c.mute }),
  foot: css({ marginTop: 4, fontSize: 12, color: c.sub }),
  danger: css({ color: c.danger }),
  stack: css({ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }),
  split: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: 20,
    alignItems: 'start',
    [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 360px' },
  }),
  scroll: css({ overflowX: 'auto', paddingBottom: 8 }),
  table: css({
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    'th, td': { padding: '10px 12px', textAlign: 'left', whiteSpace: 'nowrap' },
    'th:first-of-type, td:first-of-type': { paddingLeft: 20 },
    'th:last-of-type, td:last-of-type': { paddingRight: 20 },
    th: { fontSize: 12, fontWeight: 500, color: c.mute, borderBottom: `1px solid ${c.line}` },
    td: { borderBottom: `1px solid ${c.lineSoft}` },
    'tbody tr:last-of-type td': { borderBottom: 0 },
    'tbody tr': { transition: hover },
    'tbody tr:hover': { backgroundColor: c.bg },
  }),
  // 응답 없는 센서: 색 배경 대신 흐린 글자 + 빨간 점 배지로 구분
  offline: css({ '& td': { color: c.mute } }),
  right: css({ '&&': { textAlign: 'right' } }),
  mono: css({ fontFamily: theme.font.mono, fontSize: 12 }),
  strong: css({ fontWeight: 600 }),
  sub: css({ color: c.sub }),
  empty: css({ color: c.mute }),
  mqtt: css({ padding: '0 20px 12px', fontSize: 13, '& > div + div': { borderTop: `1px solid ${c.lineSoft}` } }),
  mqttRow: css({ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', '& > dt': { color: c.sub, flexShrink: 0 } }),
  mqttValue: css({ textAlign: 'right', fontFamily: theme.font.mono, fontSize: 12, lineHeight: '20px', overflowWrap: 'anywhere' }),
  drop: css({
    margin: '0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '28px 16px',
    borderRadius: theme.radius.md,
    background: c.bg,
    textAlign: 'center',
    fontSize: 13,
    color: c.sub,
    cursor: 'pointer',
    transition: hover,
    '& b': { color: c.brand700 },
    '&:hover': { backgroundColor: c.brand100 },
    '&:focus-within': { backgroundColor: c.brand100, outline: `2px solid ${c.brand600}`, outlineOffset: -2 },
  }),
  // 화면에서만 숨겨 키보드 포커스는 유지
  file: css({ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }),
}

function Stat({ label, value, unit, foot }: { label: string; value: string; unit: string; foot: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd css={s.value}>
        {value}
        {unit && <span css={s.unit}>{unit}</span>}
      </dd>
      <dd css={s.foot}>{foot}</dd>
    </div>
  )
}

export default function DataManagementPage() {
  const online = SENSORS.filter((s) => s.status === 'online').length
  const offline = SENSORS.length - online

  return (
    <>
      <PageHeader title="데이터 관리" subtitle="전력 측정 센서와 데이터 수집 현황을 관리합니다." />

      <Card>
        <dl css={s.stats}>
          <Stat label="연결된 센서" value={`${online}`} unit={`/ ${SENSORS.length}개`} foot={offline ? <span css={s.danger}>{offline}개 응답 없음</span> : '모두 정상'} />
          <Stat label="오늘 수집 건수" value="10,080" unit="건" foot={`${MQTT_INFO.interval} 간격 수집`} />
          <Stat label="누적 저장 데이터" value="1.2" unit="GB" foot="SD 카드 CSV + 서버 DB" />
          <Stat label="마지막 수신" value={LAST_UPDATED.split(' ')[1]} unit="" foot={LAST_UPDATED.split(' ')[0]} />
        </dl>
      </Card>

      <div css={s.stack}>
        <Card>
          <CardHeader title="데이터 출처" />
          <div css={s.scroll}>
            <table css={s.table}>
              <thead>
                <tr>
                  <th>대상</th>
                  <th>출처</th>
                  <th>단위</th>
                  <th>마지막 동기화</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {DATA_SOURCES.map((d) => (
                  <tr key={d.building}>
                    <td css={s.strong}>{d.building}</td>
                    <td css={s.sub}>{d.source}</td>
                    <td css={s.sub}>{d.unit}</td>
                    <td>{d.lastSync}</td>
                    <td>
                      <Badge tone={SOURCE_STATUS[d.status].tone}>{SOURCE_STATUS[d.status].label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div css={s.split}>
          <Card>
            <CardHeader title="센서 상태" sub="S8 건설공학관 3층 분전반, CT 클램프 센서" />
            <div css={s.scroll}>
              <table css={s.table}>
                <thead>
                  <tr>
                    <th>센서 ID</th>
                    <th>측정 회로</th>
                    <th>구분</th>
                    <th css={s.right}>현재 전력</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {SENSORS.map((sensor) => (
                    <tr key={sensor.id} css={sensor.status === 'offline' && s.offline}>
                      <td css={s.mono}>{sensor.id}</td>
                      <td css={s.strong}>{sensor.circuit}</td>
                      <td css={s.sub}>{sensor.type}</td>
                      <td css={s.right}>{sensor.value == null ? <span css={s.empty}>-</span> : `${sensor.value.toFixed(2)} kW`}</td>
                      <td>{sensor.status === 'online' ? <Badge tone="good">정상</Badge> : <Badge tone="danger">응답 없음</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="MQTT 연결" right={<Badge tone="good">연결됨</Badge>} />
            <dl css={s.mqtt}>
              {[
                ['브로커', MQTT_INFO.broker],
                ['토픽', MQTT_INFO.topic],
                ['전송 주기', MQTT_INFO.interval],
                ['장치', 'ESP32 DevKit V1 + PZEM-004T × 5'],
              ].map(([k, v]) => (
                <div key={k} css={s.mqttRow}>
                  <dt>{k}</dt>
                  <dd css={s.mqttValue}>{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div css={s.split}>
          <Card>
            <CardHeader
              title="업로드 기록"
              right={
                <Button variant="outline">
                  <Icon name="download" size={16} /> 전체 내보내기
                </Button>
              }
            />
            <div css={s.scroll}>
              <table css={s.table}>
                <thead>
                  <tr>
                    <th>파일</th>
                    <th css={s.right}>행 수</th>
                    <th>올린 사람</th>
                    <th>업로드 시각</th>
                  </tr>
                </thead>
                <tbody>
                  {UPLOADS.map((u) => (
                    <tr key={u.file}>
                      <td css={s.mono}>{u.file}</td>
                      <td css={s.right}>{u.rows.toLocaleString()}행</td>
                      <td>{u.by}</td>
                      <td css={s.sub}>{u.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="데이터 업로드" />
            <label css={s.drop}>
              <Icon name="upload_file" size={28} />
              <span>
                SD 카드 로그(CSV) 또는 건물 전력 자료를
                <br />
                끌어다 놓거나 <b>파일 선택</b>
              </span>
              <input type="file" accept=".csv" css={s.file} />
            </label>
          </Card>
        </div>
      </div>
    </>
  )
}
