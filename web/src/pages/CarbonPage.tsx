/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 건물별 절감 장부 (순위·막대·절감량·전년 대비 한 표) · states: full (목업) */
/* critique: 아이콘 KPI 카드 넷을 수치 한 줄로 접고, 순위 표를 장부로 키운다. 그라데이션 CTA는 흰 카드와 라임 버튼 하나로 */
/* Hallmark · dropped KpiCard icons (eco, park, trending_down, apartment) and CTA eco 아이콘 원 · 수치 옆 아이콘 타일이라 뺌, 라벨과 값은 그대로 */
import { css } from '@emotion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART, SimpleBars } from '../components/charts'
import { Card, CardHeader, Delta, PageHeader } from '../components/ui'
import { CAMPUS_CARBON } from '../data/mock'
import { CountUp } from '../motion'
import { bigNumber, theme } from '../theme'

const c = theme.color
const COLORS = [CHART.dark, CHART.mid, CHART.light]

const twoCol = css({ marginTop: 20, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 400px' } })

const table = css({
  fontSize: 13,
  fontVariantNumeric: 'tabular-nums',
  '& th': { padding: '8px 12px', textAlign: 'left', fontWeight: 500, fontSize: 12, color: c.sub, whiteSpace: 'nowrap', borderBottom: `1px solid ${c.line}` },
  '& td': { padding: '12px', borderBottom: `1px solid ${c.lineSoft}`, whiteSpace: 'nowrap' },
  '& th:first-of-type, & td:first-of-type': { paddingLeft: 20 },
  '& th:last-of-type, & td:last-of-type': { paddingRight: 20 },
  '& tr:last-of-type td': { borderBottom: 0 },
  '& [data-num]': { textAlign: 'right' },
})

const s = {
  kpis: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: '20px 0',
    padding: 20,
    [theme.mq.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    [theme.mq.xl]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', '& > div + div': { borderLeft: `1px solid ${c.lineSoft}`, paddingLeft: 20 } },
    '& > div': { paddingRight: 20 },
    '& dt': { fontSize: 12, color: c.sub },
  }),
  kpiValue: css(bigNumber, { marginTop: 6, fontSize: 22, '& small': { marginLeft: 4, fontSize: 12, fontWeight: 400, letterSpacing: 0, color: c.sub } }),
  kpiFoot: css({ marginTop: 4, fontSize: 12, color: c.sub, '& > span': { fontSize: 12 } }),
  kpiGood: css({ fontWeight: 500, color: c.good }),
  ledger: css(table, { marginBottom: 12, '& td:first-of-type': { width: 40, fontWeight: 700, color: c.mute } }),
  name: css({ '& b': { marginRight: 6, fontWeight: 600 }, '& span': { color: c.sub } }),
  track: css({ width: '40%', minWidth: 80 }),
  bar: css({ height: 4, borderRadius: theme.radius.pill, background: c.brand700 }),
  saved: css({ fontWeight: 600 }),
  delta: css({ display: 'flex', justifyContent: 'flex-end' }),
  donut: css({ position: 'relative', margin: '0 auto', width: 200, height: 200 }),
  donutCenter: css({ pointerEvents: 'none', position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }),
  donutLabel: css({ fontSize: 12, color: c.sub }),
  donutTotal: css(bigNumber, { marginTop: 2, fontSize: 22 }),
  factors: css(table, { marginTop: 12, marginBottom: 12 }),
  swatch: css({ display: 'inline-block', marginRight: 8, width: 10, height: 10, borderRadius: 3, verticalAlign: '-1px' }),
  chart: css({ padding: '0 16px 16px' }),
  cta: css({ padding: 20, gap: 8 }),
  ctaTitle: css({ fontSize: 16, fontWeight: 700 }),
  ctaText: css({ fontSize: 14, color: c.sub, maxWidth: '40em' }),
  ctaLink: css({
    marginTop: 'auto',
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: theme.control,
    padding: '0 14px',
    borderRadius: theme.radius.sm,
    background: c.lime,
    color: c.night,
    fontSize: 13,
    fontWeight: 600,
    transition: 'background-color 0.2s',
    '&:hover': { background: c.limeHover },
  }),
}

export default function CarbonPage() {
  const cc = CAMPUS_CARBON
  const total = cc.breakdown.reduce((s, b) => s + b.value, 0)
  const prev = cc.monthly[cc.monthly.length - 2].saved
  const maxSaved = cc.buildingRank[0].saved

  const rankRef = useRef<HTMLTableSectionElement>(null)

  const kpis = [
    { label: '이번 달 탄소 절감량', value: String(cc.monthSavedT), unit: 'tCO₂', foot: <span css={s.kpiGood}>지난달보다 +{(cc.monthSavedT - prev).toFixed(1)} t</span> },
    { label: '나무 환산', value: cc.trees.toLocaleString(), unit: '그루', foot: '이번 달 심은 효과' },
    { label: '전년 동월 대비 배출량', value: String(Math.abs(cc.yoy)), unit: '% 감소', foot: <Delta value={cc.yoy} compare="2025년 4월 대비" /> },
    { label: '강의실 추천 이용', value: cc.recommendUses.toLocaleString(), unit: '회', foot: '이번 학기 누적' },
  ]

  return (
    <>
      <PageHeader title="캠퍼스 탄소 절감 현황" subtitle="한밭대 구성원 모두의 노력으로 줄인 탄소 배출량을 확인하세요." />

      <Card>
        <dl css={s.kpis}>
          {kpis.map((k) => (
            <div key={k.label}>
              <dt>{k.label}</dt>
              <dd css={s.kpiValue}>
                <CountUp value={k.value} />
                <small>{k.unit}</small>
              </dd>
              <dd css={s.kpiFoot}>{k.foot}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div css={twoCol}>
        <Card>
          <CardHeader title="건물별 절감 순위" sub="(이번 달, kgCO₂)" />
          <table css={s.ledger}>
            <thead>
              <tr>
                <th>순위</th>
                <th>건물</th>
                <th css={s.track}>
                  <span css={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>비율</span>
                </th>
                <th data-num>절감량</th>
                <th data-num>전년 대비</th>
              </tr>
            </thead>
            <tbody ref={rankRef}>
              {cc.buildingRank.map((b, i) => (
                <tr key={b.code}>
                  <td>{i + 1}</td>
                  <td css={s.name}>
                    <b>{b.code}</b>
                    <span>{b.name}</span>
                  </td>
                  <td css={s.track}>
                    <div data-bar css={s.bar} style={{ width: `${(b.saved / maxSaved) * 100}%` }} />
                  </td>
                  <td data-num css={s.saved}>
                    {b.saved}
                  </td>
                  <td>
                    <span css={s.delta}>
                      <Delta value={b.yoy} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHeader title="절감 요인" sub="(이번 달)" />
          <div css={s.donut}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={cc.breakdown} dataKey="value" innerRadius="60%" outerRadius="95%" paddingAngle={2} stroke="none">
                  {cc.breakdown.map((b, i) => (
                    <Cell key={b.name} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} tCO₂`} />
              </PieChart>
            </ResponsiveContainer>
            <div css={s.donutCenter}>
              <div>
                <p css={s.donutLabel}>합계</p>
                <p css={s.donutTotal}>
                  <CountUp value={total.toFixed(1)} /> t
                </p>
              </div>
            </div>
          </div>
          <table css={s.factors}>
            <tbody>
              {cc.breakdown.map((b, i) => (
                <tr key={b.name}>
                  <td>
                    <span css={s.swatch} style={{ background: COLORS[i] }} aria-hidden="true" />
                    {b.name}
                  </td>
                  <td data-num css={{ fontWeight: 600 }}>
                    {b.value} tCO₂
                  </td>
                  <td data-num css={{ color: c.sub }}>
                    {Math.round((b.value / total) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div css={twoCol}>
        <Card>
          <CardHeader title="월별 탄소 절감량" sub="(tCO₂)" />
          <div css={s.chart}>
            <SimpleBars data={cc.monthly} x="month" y="saved" unit="tCO₂" height={280} />
          </div>
        </Card>

        <Card css={s.cta}>
          <p css={s.ctaTitle}>나도 탄소 절감에 참여하기</p>
          <p css={s.ctaText}>스터디나 모임 장소를 정할 때 강의실 추천을 이용해 보세요. 이동 거리와 건물 전력 상태를 고려해 에너지 효율이 높은 강의실을 알려드려요.</p>
          <Link to="/classroom" css={s.ctaLink}>
            강의실 추천 받기
          </Link>
        </Card>
      </div>
    </>
  )
}
