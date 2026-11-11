/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 다크 계량 패널, 현재 값과 수신 궤적을 한 판에 · states: connecting, error, closed, empty, full */
/* critique: 장식 오브와 글로우를 걷고 값·궤적·기록만 남긴다. 라임은 현재 값과 연결 상태에만 쓴다 */
/* Hallmark · dropped hourglass_top, sensors · 빈 상태 아이콘은 상태별 안내 문장으로 대체, sensors 는 STATUS 표에서 그대로 씀 */
/* Hallmark · reworded "live-fill" to "trace-fill" · 그라데이션 내부 id, 바깥에서 읽는 곳 없음 */
import { css, keyframes } from '@emotion/react'
import { useRef } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Icon } from '../components/Icon'
import { Card, CardHeader, PageHeader } from '../components/ui'
import { MQTT_TOPIC, useMqttPower, type ConnectionStatus, type Reading } from '../hooks/useMqttPower'
import { gsap, reducedMotion, useGSAP } from '../motion'
import { bigNumber, theme } from '../theme'

const c = theme.color
const fmt = (n: number) => n.toFixed(1)

const STATUS: Record<ConnectionStatus, { icon: string; label: string; color: string }> = {
  connecting: { icon: 'sync', label: '연결 중', color: c.warn },
  connected: { icon: 'sensors', label: '연결됨', color: c.lime },
  reconnecting: { icon: 'sync', label: '재연결 중', color: c.warn },
  error: { icon: 'error', label: '연결 오류', color: c.danger },
  closed: { icon: 'sensors_off', label: '연결 끊김', color: c.mute },
}

/** 값이 없을 때 패널에 띄울 안내 (상태별로 원인과 할 일) */
function emptyNote(status: ConnectionStatus) {
  if (status === 'error') return { title: '브로커에 연결하지 못했습니다', body: '.env.local 의 VITE_MQTT_* 값과 네트워크를 확인한 뒤 새로고침하세요.' }
  if (status === 'closed') return { title: '연결이 끊겼습니다', body: '페이지를 새로고침하면 다시 연결합니다.' }
  if (status === 'connected') return { title: '아직 받은 값이 없습니다', body: `계량기가 ${MQTT_TOPIC ?? '토픽'} 으로 값을 보내고 있는지 확인하세요.` }
  return null // connecting / reconnecting → 스켈레톤
}

/** 현재 값: 바뀔 때마다 이전 값에서 카운트업 */
function Readout({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  useGSAP(
    () => {
      const el = ref.current!
      if (reducedMotion()) return void (el.textContent = fmt(value))
      const o = { n: prev.current }
      gsap.to(o, { n: value, duration: 0.6, ease: 'power2.out', onUpdate: () => void (el.textContent = fmt(o.n)) })
      prev.current = value
    },
    { dependencies: [value] },
  )
  return (
    <p css={s.value}>
      <span ref={ref}>{fmt(value)}</span>
      <span css={s.unit}>Wh</span>
    </p>
  )
}

function Trace({ data, avg }: { data: Reading[]; avg: number }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trace-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.lime} stopOpacity={0.22} />
            <stop offset="100%" stopColor={c.lime} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={c.nightLine} />
        <XAxis dataKey="t" tick={{ fontSize: 11, fill: c.nightSub }} axisLine={false} tickLine={false} minTickGap={40} />
        <YAxis tick={{ fontSize: 11, fill: c.nightSub }} axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={fmt} />
        <ReferenceLine y={avg} stroke={c.nightSub} strokeDasharray="4 4" label={{ value: `평균 ${fmt(avg)}`, position: 'insideTopRight', fontSize: 11, fill: c.nightSub }} />
        <Tooltip
          cursor={{ stroke: c.nightLine }}
          formatter={(v) => [`${fmt(Number(v))} Wh`, '사용량']}
          contentStyle={{ borderRadius: theme.radius.md, border: 0, background: c.nightSoft, fontSize: 12 }}
          labelStyle={{ color: c.nightSub }}
          itemStyle={{ color: c.nightInk }}
        />
        {/* 값이 계속 붙으므로 진입 애니메이션은 끈다 */}
        <Area isAnimationActive={false} type="monotone" dataKey="v" stroke={c.lime} strokeWidth={2} fill="url(#trace-fill)" dot={false} activeDot={{ r: 4, fill: c.lime, stroke: c.night, strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default function LivePage() {
  const { value, history, raw, status } = useMqttPower()
  const meta = STATUS[status]
  const vs = history.map((h) => h.v)
  const avg = vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : 0
  const stats = [
    { label: '최소', value: vs.length ? fmt(Math.min(...vs)) : '없음' },
    { label: '평균', value: vs.length ? fmt(avg) : '없음' },
    { label: '최대', value: vs.length ? fmt(Math.max(...vs)) : '없음' },
    { label: '수신', value: `${history.length}건` },
  ]
  const recent = history.slice(-8).reverse()
  const note = emptyNote(status)

  return (
    <>
      <PageHeader title="실시간 전력 모니터" subtitle="316호 스마트 계량기 값을 MQTT로 받아 그대로 보여 줍니다." />

      <section data-reveal css={s.panel} aria-live="polite">
        <div css={s.bar}>
          <span css={s.state}>
            <Icon name={meta.icon} size={18} fill css={{ color: meta.color }} />
            {meta.label}
          </span>
          <code css={s.topic}>{MQTT_TOPIC ?? '토픽 미설정'}</code>
          {history.length > 0 && <span css={s.at}>{history.at(-1)!.t} 수신</span>}
        </div>

        <div css={s.body}>
          <div css={s.readout}>
            <p css={s.label}>현재 사용량</p>
            {value !== null ? <Readout value={value} /> : note ? <p css={[s.value, s.dim]}>없음</p> : <span css={s.skeleton} aria-label="불러오는 중" />}
            <dl css={s.stats}>
              {stats.map((st) => (
                <div key={st.label}>
                  <dt>{st.label}</dt>
                  <dd>{st.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div css={s.trace}>
            {history.length >= 2 ? (
              <Trace data={history} avg={avg} />
            ) : note ? (
              <div css={s.note}>
                <p css={s.noteTitle}>{note.title}</p>
                <p>{note.body}</p>
              </div>
            ) : (
              <span css={[s.skeleton, s.skeletonChart]} aria-label="불러오는 중" />
            )}
          </div>
        </div>
      </section>

      <div css={s.lower}>
        <Card>
          <CardHeader title="최근 수신 기록" sub="최신 8건" />
          {recent.length ? (
            <table css={s.table}>
              <thead>
                <tr>
                  <th>시각</th>
                  <th>값 (Wh)</th>
                  <th>직전 대비</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => {
                  const before = recent[i + 1]?.v
                  const d = before === undefined ? null : r.v - before
                  return (
                    <tr key={`${r.t}-${i}`}>
                      <td>{r.t}</td>
                      <td>{fmt(r.v)}</td>
                      <td css={{ color: c.sub }}>{d === null ? '없음' : `${d > 0 ? '+' : ''}${fmt(d)}`}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p css={s.cardEmpty}>값을 받으면 여기에 쌓입니다.</p>
          )}
        </Card>

        <Card>
          <CardHeader title="마지막 수신 메시지" />
          <pre css={s.raw}>{raw ?? '아직 받은 메시지가 없습니다.'}</pre>
        </Card>
      </div>
    </>
  )
}

const shimmer = keyframes({ '0%, 100%': { opacity: 0.5 }, '50%': { opacity: 1 } })
const pulse = css({
  animation: `${shimmer} 1.4s ease-in-out infinite`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
})

const s = {
  panel: css({ borderRadius: theme.radius.lg, background: c.night, color: c.nightInk }),
  bar: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', padding: '14px 24px', borderBottom: `1px solid ${c.nightLine}`, fontSize: 13 }),
  state: css({ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }),
  topic: css({ fontFamily: theme.font.mono, fontSize: 12, color: c.nightSub }),
  at: css({ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', color: c.nightSub }),

  body: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', [theme.mq.lg]: { gridTemplateColumns: '320px minmax(0, 1fr)' } }),
  readout: css({
    display: 'flex',
    flexDirection: 'column',
    padding: 24,
    borderBottom: `1px solid ${c.nightLine}`,
    [theme.mq.lg]: { borderBottom: 0, borderRight: `1px solid ${c.nightLine}` },
  }),
  label: css({ fontSize: 13, color: c.nightSub }),
  value: css(bigNumber, { marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 'clamp(56px, 6vw, 72px)', color: c.lime }),
  dim: css({ color: c.nightSub }),
  unit: css({ fontSize: 16, fontWeight: 500, letterSpacing: 0, color: c.nightSub }),
  stats: css({
    marginTop: 'auto',
    paddingTop: 24,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    '& > div + div': { borderLeft: `1px solid ${c.nightLine}`, paddingLeft: 12 },
    '& dt': { fontSize: 12, color: c.nightSub },
    '& dd': { marginTop: 2, fontSize: 17, fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  }),

  trace: css({ minWidth: 0, display: 'grid', alignItems: 'center', padding: '16px 16px 12px' }),
  note: css({ padding: '48px 24px', textAlign: 'center', fontSize: 14, color: c.nightSub }),
  noteTitle: css({ marginBottom: 4, fontSize: 16, fontWeight: 600, color: c.nightInk }),
  skeleton: css(pulse, { display: 'block', marginTop: 12, width: 180, height: 64, borderRadius: theme.radius.md, background: c.nightSoft }),
  skeletonChart: css({ width: '100%', height: 280, marginTop: 0 }),

  lower: css({ marginTop: 20, display: 'grid', gap: 20, gridTemplateColumns: 'minmax(0, 1fr)', [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)' } }),
  table: css({
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 24px', textAlign: 'left', fontWeight: 500, fontSize: 12, color: c.mute, borderBottom: `1px solid ${c.line}` },
    '& td': { padding: '10px 24px', borderBottom: `1px solid ${c.lineSoft}` },
    '& tr:last-of-type td': { borderBottom: 0 },
    '& th:not(:first-of-type), & td:not(:first-of-type)': { textAlign: 'right' },
    marginBottom: 12,
  }),
  cardEmpty: css({ padding: '8px 24px 24px', fontSize: 13, color: c.mute }),
  raw: css({ margin: '0 24px 20px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', borderRadius: theme.radius.md, background: c.lineSoft, padding: '12px 14px', fontFamily: theme.font.mono, fontSize: 12, color: c.sub }),
}
