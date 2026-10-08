import { css } from '@emotion/react'
import { Icon } from '../../components/Icon'
import { Badge, Button, Card, CardHeader, KpiCard, PageHeader } from '../../components/ui'
import { DATA_SOURCES, LAST_UPDATED, MQTT_INFO, SENSORS, UPLOADS } from '../../data/mock'
import { eyebrow, theme } from '../../theme'

const SOURCE_STATUS = {
  ok: { tone: 'good', label: '수신 중' },
  pending: { tone: 'warn', label: '자료 대기' },
  none: { tone: 'blue', label: '연동 예정' },
} as const

const c = theme.color
const hover = `background-color 0.25s ${theme.ease}`

const s = {
  kpis: css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 20,
    [theme.mq.md]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.mq.xxl]: { gridTemplateColumns: 'repeat(4, 1fr)' },
  }),
  danger: css({ color: c.danger }),
  main: css({
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 20,
    [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 400px' },
  }),
  halves: css({
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 20,
    [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' },
  }),
  side: css({ display: 'flex', flexDirection: 'column', gap: 20 }),
  grow: css({ flex: 1 }),
  tableWrap: css({ margin: '0 20px 20px', overflowX: 'auto', border: `1px solid ${c.lineSoft}`, borderRadius: theme.radius.md }),
  table: css({
    fontSize: 14,
    'th, td': { padding: '10px 16px', textAlign: 'left' },
    th: [eyebrow, { fontWeight: 500, color: c.sub, backgroundColor: c.bg, whiteSpace: 'nowrap' }],
    'tbody tr': { borderTop: `1px solid ${c.lineSoft}`, transition: hover },
    'tbody tr:hover': { backgroundColor: c.bg },
  }),
  // 응답 없는 센서: 색 배경 대신 흐린 글자 + 빨간 점 배지로 구분
  offline: css({ '& td': { color: c.mute } }),
  right: css({ '&&': { textAlign: 'right' } }),
  center: css({ '&&': { textAlign: 'center' } }),
  mono: css({ fontFamily: theme.font.mono, fontSize: 12 }),
  num: css({ fontVariantNumeric: 'tabular-nums' }),
  strong: css({ fontWeight: 500 }),
  sub: css({ color: c.sub }),
  empty: css({ color: c.mute }),
  mqtt: css({ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px 24px', fontSize: 14 }),
  mqttRow: css({ display: 'flex', justifyContent: 'space-between', gap: 16, '& > dt': { color: c.sub } }),
  mqttValue: css({ textAlign: 'right', fontFamily: theme.font.mono, fontSize: 12, lineHeight: '20px' }),
  uploadWrap: css({ padding: '0 24px 24px' }),
  drop: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '28px 0',
    border: `2px dashed ${c.line}`,
    borderRadius: theme.radius.md,
    textAlign: 'center',
    fontSize: 14,
    color: c.sub,
    cursor: 'pointer',
    transition: `border-color 0.25s ${theme.ease}, ${hover}`,
    '& b, & > span:first-of-type': { color: c.brand700 },
    '&:hover, &:focus-within': { borderColor: c.brand600, backgroundColor: c.brand100 },
  }),
  // 화면에서만 숨겨 키보드 포커스는 유지
  file: css({ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }),
  list: css({
    margin: '0 20px 20px',
    border: `1px solid ${c.lineSoft}`,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    '& > li + li': { borderTop: `1px solid ${c.lineSoft}` },
  }),
  row: css({ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', fontSize: 14, transition: hover, '&:hover': { backgroundColor: c.bg } }),
  rowBody: css({ flex: 1, minWidth: 0 }),
  rowTitle: css({ fontWeight: 600 }),
  rowMeta: css({ fontSize: 12, color: c.sub }),
  rowDate: css(eyebrow, { flexShrink: 0 }),
  rowIcon: css({ color: c.mute }),
}

export default function DataManagementPage() {
  const online = SENSORS.filter((s) => s.status === 'online').length
  const offline = SENSORS.length - online

  return (
    <>
      <PageHeader title="데이터 관리" subtitle="전력 측정 센서와 데이터 수집 현황을 관리합니다." />

      <div css={s.kpis}>
        <KpiCard icon={<Icon name="sensors" size={24} />} tone="teal" label="연결된 센서" value={`${online}`} unit={`/ ${SENSORS.length}개`} foot={offline ? <span css={s.danger}>{offline}개 응답 없음</span> : '모두 정상'} />
        <KpiCard icon={<Icon name="monitoring" size={24} />} tone="lime" label="오늘 수집 건수" value="10,080" unit="건" foot={`${MQTT_INFO.interval} 간격 수집`} />
        <KpiCard icon={<Icon name="database" size={24} />} tone="purple" label="누적 저장 데이터" value="1.2" unit="GB" foot="SD 카드 CSV + 서버 DB" />
        <KpiCard icon={<Icon name="error" size={24} />} tone="green" label="마지막 수신" value={LAST_UPDATED.split(' ')[1]} unit="" foot={LAST_UPDATED.split(' ')[0]} />
      </div>

      <div css={s.main}>
        <Card>
          <CardHeader title="센서 상태" sub="S8 건설공학관 3층 분전반 · CT 클램프 센서" />
          <div css={s.tableWrap}>
            <table css={s.table}>
              <thead>
                <tr>
                  <th>센서 ID</th>
                  <th>측정 회로</th>
                  <th>구분</th>
                  <th css={s.right}>현재 전력</th>
                  <th css={s.center}>상태</th>
                </tr>
              </thead>
              <tbody>
                {SENSORS.map((sensor) => (
                  <tr key={sensor.id} css={sensor.status === 'offline' && s.offline}>
                    <td css={s.mono}>{sensor.id}</td>
                    <td css={s.strong}>{sensor.circuit}</td>
                    <td css={s.sub}>{sensor.type}</td>
                    <td css={[s.right, s.num]}>{sensor.value == null ? <span css={s.empty}>-</span> : `${sensor.value.toFixed(2)} kW`}</td>
                    <td css={s.center}>{sensor.status === 'online' ? <Badge tone="good">정상</Badge> : <Badge tone="danger">응답 없음</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div css={s.side}>
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

          <Card css={s.grow}>
            <CardHeader title="데이터 업로드" />
            <div css={s.uploadWrap}>
              <label css={s.drop}>
                <Icon name="upload_file" size={28} />
                <span>
                  SD 카드 로그(CSV) 또는 건물 전력 자료를
                  <br />
                  끌어다 놓거나 <b>파일 선택</b>
                </span>
                <input type="file" accept=".csv" css={s.file} />
              </label>
            </div>
          </Card>
        </div>
      </div>

      <div css={s.halves}>
        <Card>
          <CardHeader title="데이터 출처" />
          <ul css={s.list}>
            {DATA_SOURCES.map((d) => (
              <li key={d.building} css={s.row}>
                <div css={s.rowBody}>
                  <p css={s.rowTitle}>{d.building}</p>
                  <p css={s.rowMeta}>
                    {d.source} · {d.unit}
                  </p>
                </div>
                <span css={s.rowDate}>{d.lastSync}</span>
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
                <Icon name="download" size={16} /> 전체 내보내기
              </Button>
            }
          />
          <ul css={s.list}>
            {UPLOADS.map((u) => (
              <li key={u.file} css={s.row}>
                <Icon name="upload" size={16} css={s.rowIcon} />
                <div css={s.rowBody}>
                  <p css={[s.mono, s.rowTitle]}>{u.file}</p>
                  <p css={s.rowMeta}>
                    {u.rows.toLocaleString()}행 · {u.by}
                  </p>
                </div>
                <span css={s.rowDate}>{u.date}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
