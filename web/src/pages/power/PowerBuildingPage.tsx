import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART, Sparkline } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { Button, Card, CardHeader, Delta, KpiCard, MoreLink, Segmented, SelectBox } from '../../components/ui'
import { BUILDINGS } from '../../data/mock'
import { eyebrow, theme } from '../../theme'
import PowerTabs, { ps } from './PowerTabs'

const total = BUILDINGS.reduce((s, b) => s + b.monthKwh, 0)
const rows = BUILDINGS.map((b) => ({ ...b, share: ((b.monthKwh / total) * 100).toFixed(1) }))
const max = rows[0].monthKwh

const { color, radius, mq, ease } = theme

const INSIGHTS = [
  { icon: 'lightbulb', fg: color.warn, t: `${rows[0].name}(${rows[0].code})이 가장 많은 전력을 사용하고 있어요.`, d: `전체 사용량의 ${rows[0].share}%를 차지합니다.` },
  { icon: 'trending_down', fg: color.good, t: '전월 대비 전체 사용량이 6.4% 감소했어요.', d: '지속적인 절감 노력이 효과를 보이고 있어요!' },
  { icon: 'bolt', fg: color.danger, t: '오후 2시 ~ 4시 사이 사용량이 가장 많아요.', d: '시간대별 분석을 통해 피크 시간 관리를 추천드려요.' },
]

const s = {
  kpis: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, marginTop: 20, [mq.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, [mq.xxl]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' } }),
  topLink: css({ display: 'flex', alignItems: 'baseline', gap: 16, padding: '10px 16px', fontSize: 14, transition: `background 0.25s ${ease}`, '&:hover': { background: color.lineSoft } }),
  rank: css(eyebrow, { width: 16, fontSize: 12, color: color.sub }),
  code: css({ marginRight: 8, fontWeight: 600 }),
  good: css({ color: color.good }),
  tableWrap: css({ margin: '0 20px', overflowX: 'auto' }),
  table: css({
    fontSize: 14,
    fontVariantNumeric: 'tabular-nums',
    '& th': [eyebrow, { padding: '10px 16px', fontWeight: 500, color: color.sub, background: color.bg, whiteSpace: 'nowrap' }],
    '& td': { padding: '8px 16px', borderTop: `1px solid ${color.lineSoft}` },
    '& tbody tr': { transition: `background 0.25s ${ease}` },
    '& tbody tr:hover': { background: color.lineSoft },
  }),
  left: css({ textAlign: 'left' }),
  center: css({ textAlign: 'center' }),
  name: css({ whiteSpace: 'nowrap', '& a': { transition: `color 0.25s ${ease}` }, '& a:hover': { color: color.brand700 } }),
  usage: css({ display: 'flex', alignItems: 'center', gap: 8 }),
  bar: css({ height: 3, borderRadius: radius.pill, background: color.brand700, transformOrigin: 'left' }),
  inline: css({ display: 'inline-flex' }),
  // 색 원형 배경 없이 작은 아이콘만 제목 줄에 맞춘다
  insight: css({ display: 'flex', gap: 10, padding: '14px 16px' }),
  insightIcon: css({ flexShrink: 0, marginTop: 1 }),
  insightTitle: css({ fontSize: 13, fontWeight: 600 }),
}

function BuildingTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const b = BUILDINGS.find((v) => v.code === payload?.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" dy={14} fontSize={13} fill={color.ink}>
        {payload?.value}
      </text>
      <text textAnchor="middle" dy={32} fontSize={12} fill={CHART.axis.fill}>
        {b?.name}
      </text>
    </g>
  )
}

export default function PowerBuildingPage() {
  const [unit, setUnit] = useState<'kWh' | 'kW'>('kWh')
  const key = unit === 'kWh' ? 'monthKwh' : 'kw'
  const table = useRef<HTMLTableElement>(null)

  return (
    <PowerTabs active="건물별">
      <div css={ps.filterBar} data-reveal>
        <SelectBox label="기간 선택" value="2026.04.01 - 2026.04.30" icon={<Icon name="calendar_month" size={16} />} />
        <SelectBox label="비교 선택" value="전체 건물" options={['전체 건물', 'N동', 'S동']} />
        <Button variant="outline" css={ps.pushRight}>
          <Icon name="tune" size={16} /> 비교 설정
        </Button>
      </div>

      <div css={s.kpis}>
        <KpiCard icon={<Icon name="bolt" size={24} />} tone="teal" label="총 전력 사용량" value="2,342" unit="kW" foot={<Delta value={-6.4} compare="전월 대비" />} />
        <KpiCard icon={<Icon name="eco" size={24} />} tone="lime" label="평균 일일 사용량" value="75.5" unit="kW" foot={<Delta value={-5.1} compare="전월 대비" />} />
        <KpiCard icon={<Icon name="insights" size={24} />} tone="purple" label="최대 사용량" value="1,652" unit="kW" foot="2026.04.15" />
        <KpiCard icon={<Icon name="cloud" size={24} />} tone="green" label="추정 탄소 배출량" value="583" unit="tCO₂" foot={<Delta value={-4.9} compare="전월 대비" />} />
      </div>

      <div css={ps.split(340)}>
        <Card>
          <CardHeader
            title="건물별 전력 소비량"
            sub={`(${unit})`}
            right={
              <>
                <Button variant="outline">
                  <Icon name="download" size={16} /> 차트 다운로드
                </Button>
                <Segmented options={['kWh', 'kW'] as const} value={unit} onChange={setUnit} size="sm" />
              </>
            }
          />
          <div css={ps.chart}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={BUILDINGS.slice(0, 6)} margin={{ top: 24, right: 8, left: -4, bottom: 16 }}>
                <CartesianGrid vertical={false} stroke={CHART.grid} />
                <XAxis dataKey="code" axisLine={false} tickLine={false} tick={<BuildingTick />} interval={0} />
                <YAxis tick={CHART.axis} axisLine={false} tickLine={false} tickFormatter={(v: number) => v.toLocaleString()} />
                <Tooltip cursor={{ fill: color.lineSoft }} formatter={(v) => [`${Number(v).toLocaleString()} ${unit}`, '사용량']} />
                <Bar dataKey={key} fill={CHART.dark} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false}>
                  <LabelList dataKey={key} position="top" fontSize={13} fill={color.ink} formatter={(v) => Number(v).toLocaleString()} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <MoreLink down />
        </Card>

        <Card>
          <CardHeader title="상위 건물" />
          <ol css={ps.list}>
            {rows.slice(0, 5).map((b, i) => (
              <li key={b.id}>
                <Link to={`/power/building/${b.id}`} css={s.topLink}>
                  <span css={s.rank}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p>
                      <b css={s.code}>{b.code}</b>
                      {b.name}
                    </p>
                    <p css={ps.caption}>
                      {b.monthKwh.toLocaleString()} kWh <span css={s.good}>({b.share}%)</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          <div css={ps.cardFoot}>
            <Button variant="outline" css={ps.full}>
              전체 건물 보기
            </Button>
          </div>
        </Card>
      </div>

      <div css={ps.split(480)}>
        <Card>
          <CardHeader title="건물별 상세 데이터" />
          <div css={s.tableWrap}>
            <table ref={table} css={s.table}>
              <thead>
                <tr>
                  <th css={s.left}>순위</th>
                  <th css={s.left}>건물명</th>
                  <th css={s.left}>전력 사용량 (kWh)</th>
                  <th>전월 대비</th>
                  <th>비중</th>
                  <th>추이</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 6).map((b, i) => (
                  <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td css={s.name}>
                      <Link to={`/power/building/${b.id}`}>
                        <b css={s.code}>{b.code}</b>
                        {b.name}
                      </Link>
                    </td>
                    <td>
                      <div css={s.usage}>
                        <div data-bar css={s.bar} style={{ width: `${(b.monthKwh / max) * 160}px` }} />
                        {b.monthKwh.toLocaleString()}
                      </div>
                    </td>
                    <td css={s.center}>
                      <span css={s.inline}>
                        <Delta value={b.delta} />
                      </span>
                    </td>
                    <td css={s.center}>{b.share}%</td>
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
          <ul css={ps.list}>
            {INSIGHTS.map((x) => (
              <li key={x.t} css={s.insight}>
                <span css={s.insightIcon} style={{ color: x.fg }}>
                  <Icon name={x.icon} size={18} />
                </span>
                <div>
                  <p css={s.insightTitle}>{x.t}</p>
                  <p css={[ps.caption, { marginTop: 2 }]}>{x.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <div css={ps.cardFoot}>
            <Button variant="outline" css={ps.full}>
              인사이트 더보기
            </Button>
          </div>
        </Card>
      </div>
    </PowerTabs>
  )
}
