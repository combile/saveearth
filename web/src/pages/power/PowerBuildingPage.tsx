/* Hallmark · redesign: full · shape: app screen · signature: 건물 원장 표 (순위·사용량 막대·전월 대비·비중·추이를 한 줄에) · states: full (목업) */
/* critique: 아이콘 KPI 카드 4장을 차트 옆 숫자 목록으로 접고, 상세 표를 화면의 중심으로 넓힌다 */
import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART, Sparkline } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { Button, Card, CardHeader, Delta, MoreLink, Segmented, SelectBox } from '../../components/ui'
import { BUILDINGS } from '../../data/mock'
import { bigNumber, theme } from '../../theme'
import PowerTabs, { ps } from './PowerTabs'

const total = BUILDINGS.reduce((s, b) => s + b.monthKwh, 0)
const rows = BUILDINGS.map((b) => ({ ...b, share: ((b.monthKwh / total) * 100).toFixed(1) }))
const max = rows[0].monthKwh

const { color, radius, ease } = theme

const FIGURES = [
  { label: '총 전력 사용량', value: '2,342', unit: 'kW', foot: <Delta value={-6.4} compare="전월 대비" /> },
  { label: '평균 일일 사용량', value: '75.5', unit: 'kW', foot: <Delta value={-5.1} compare="전월 대비" /> },
  { label: '최대 사용량', value: '1,652', unit: 'kW', foot: '2026.04.15' },
  { label: '추정 탄소 배출량', value: '583', unit: 'tCO₂', foot: <Delta value={-4.9} compare="전월 대비" /> },
]

const INSIGHTS = [
  { icon: 'lightbulb', fg: color.warn, t: `${rows[0].name}(${rows[0].code})이 가장 많은 전력을 사용하고 있어요.`, d: `전체 사용량의 ${rows[0].share}%를 차지합니다.` },
  { icon: 'trending_down', fg: color.good, t: '전월 대비 전체 사용량이 6.4% 감소했어요.', d: '지속적인 절감 노력이 효과를 보이고 있어요!' },
  { icon: 'bolt', fg: color.danger, t: '오후 2시 ~ 4시 사이 사용량이 가장 많아요.', d: '시간대별 분석을 통해 피크 시간 관리를 추천드려요.' },
]

const s = {
  // 차트 옆 숫자 목록: 라벨 · 값 · 비교를 헤어라인으로 나눈 행
  figures: css({
    padding: '4px 20px 8px',
    '& > div': { padding: '14px 0' },
    '& > div + div': { borderTop: `1px solid ${color.lineSoft}` },
    '& dt': { fontSize: 12, color: color.sub },
    '& dd': { marginTop: 4 },
  }),
  figure: css(bigNumber, { fontSize: 22 }),
  figureUnit: css({ marginLeft: 4, fontSize: 12, fontWeight: 400, letterSpacing: 0, color: color.mute }),
  figureFoot: css({ marginTop: 4, fontSize: 12, color: color.sub, '& > span': { fontSize: 12 } }),
  topLink: css({ display: 'flex', alignItems: 'baseline', gap: 12, padding: '10px 0', fontSize: 13, transition: `color 0.2s ${ease}`, '&:hover': { color: color.brand700 } }),
  rank: css({ width: 18, flexShrink: 0, fontSize: 12, fontVariantNumeric: 'tabular-nums', color: color.mute }),
  topValue: css({ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', color: color.sub, whiteSpace: 'nowrap' }),
  code: css({ marginRight: 6, fontWeight: 600 }),
  tableWrap: css({ overflowX: 'auto', paddingBottom: 8 }),
  table: css({
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 12px', fontSize: 12, fontWeight: 500, color: color.mute, textAlign: 'right', whiteSpace: 'nowrap', borderBottom: `1px solid ${color.line}` },
    '& td': { padding: '10px 12px', textAlign: 'right', whiteSpace: 'nowrap', borderBottom: `1px solid ${color.lineSoft}` },
    // 순위·건물명은 왼쪽, 숫자 열은 오른쪽 정렬
    '& th:nth-of-type(-n+2), & td:nth-of-type(-n+2)': { textAlign: 'left' },
    '& th:first-of-type, & td:first-of-type': { paddingLeft: 20 },
    '& th:last-of-type, & td:last-of-type': { paddingRight: 20 },
    '& tbody tr:last-of-type td': { borderBottom: 0 },
    '& tbody tr': { transition: `background 0.2s ${ease}` },
    '& tbody tr:hover': { background: color.lineSoft },
  }),
  rankCell: css({ color: color.mute }),
  name: css({ '& a': { transition: `color 0.2s ${ease}` }, '& a:hover': { color: color.brand700 } }),
  usage: css({ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }),
  track: css({ width: 120, height: 4, borderRadius: radius.pill, background: color.lineSoft }),
  bar: css({ height: '100%', borderRadius: radius.pill, background: color.brand700 }),
  delta: css({ display: 'inline-flex', '& > span': { fontSize: 13 } }),
  spark: css({ display: 'flex', justifyContent: 'flex-end' }),
  insight: css({ display: 'flex', gap: 10, padding: '14px 0' }),
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

      <div css={ps.split(320)}>
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
          <dl css={s.figures}>
            {FIGURES.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>
                  <p css={s.figure}>
                    {f.value}
                    <span css={s.figureUnit}>{f.unit}</span>
                  </p>
                  <div css={s.figureFoot}>{f.foot}</div>
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <div css={[ps.split(320), { alignItems: 'start' }]}>
        <Card>
          <CardHeader title="건물별 상세 데이터" />
          <div css={s.tableWrap}>
            <table ref={table} css={s.table}>
              <thead>
                <tr>
                  <th>순위</th>
                  <th>건물명</th>
                  <th>전력 사용량 (kWh)</th>
                  <th>전월 대비</th>
                  <th>비중</th>
                  <th>추이</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 6).map((b, i) => (
                  <tr key={b.id}>
                    <td css={s.rankCell}>{i + 1}</td>
                    <td css={s.name}>
                      <Link to={`/power/building/${b.id}`}>
                        <b css={s.code}>{b.code}</b>
                        {b.name}
                      </Link>
                    </td>
                    <td>
                      <div css={s.usage}>
                        <div css={s.track}>
                          <div data-bar css={s.bar} style={{ width: `${(b.monthKwh / max) * 100}%` }} />
                        </div>
                        {b.monthKwh.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <span css={s.delta}>
                        <Delta value={b.delta} />
                      </span>
                    </td>
                    <td>{b.share}%</td>
                    <td>
                      <div css={s.spark}>
                        <Sparkline data={b.trend} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MoreLink down />
        </Card>

        <div css={ps.stack}>
          <Card>
            <CardHeader title="상위 건물" />
            <ol css={ps.list}>
              {rows.slice(0, 5).map((b, i) => (
                <li key={b.id}>
                  <Link to={`/power/building/${b.id}`} css={s.topLink}>
                    <span css={s.rank}>{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <b css={s.code}>{b.code}</b>
                      {b.name}
                    </span>
                    <span css={s.topValue}>
                      {b.monthKwh.toLocaleString()} kWh ({b.share}%)
                    </span>
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
      </div>
    </PowerTabs>
  )
}
