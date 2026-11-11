import { css } from '@emotion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART, SimpleBars } from '../components/charts'
import { Icon } from '../components/Icon'
import { Card, CardHeader, Delta, KpiCard, PageHeader } from '../components/ui'
import { CAMPUS_CARBON } from '../data/mock'
import { CountUp } from '../motion'
import { bigNumber, eyebrow, theme } from '../theme'

const COLORS = [CHART.dark, CHART.mid, CHART.light]

const twoCol = css({ marginTop: 20, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 420px' } })

const s = {
  kpis: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, [theme.mq.md]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, [theme.mq.xxl]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' } }),
  kpiFoot: css({ fontWeight: 500, color: theme.color.good }),
  chart: css({ padding: '0 16px 16px' }),
  donut: css({ position: 'relative', margin: '0 auto', width: 208, height: 208 }),
  donutCenter: css({ pointerEvents: 'none', position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }),
  donutTotal: css(bigNumber, { marginTop: 2, fontSize: 22 }),
  factors: css({ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 24px' }),
  factor: css({ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }),
  dot: css({ width: 12, height: 12, borderRadius: theme.radius.pill }),
  factorName: css({ flex: 1, color: theme.color.sub }),
  factorPct: css({ width: 48, textAlign: 'right', color: theme.color.mute, fontVariantNumeric: 'tabular-nums' }),
  rank: css({ margin: '0 20px 20px', borderRadius: theme.radius.md, border: `1px solid ${theme.color.lineSoft}`, overflow: 'hidden' }),
  rankRow: css({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '14px 20px',
    fontSize: 14,
    transition: 'background-color 0.2s',
    '& + &': { borderTop: `1px solid ${theme.color.lineSoft}` },
    '&:hover': { background: theme.color.bg },
  }),
  rankNo: css({ width: 16, fontWeight: 700, fontFamily: theme.font.mono, color: theme.color.mute }),
  rankName: css({ width: 144, flexShrink: 0, '& b': { marginRight: 8 } }),
  track: css({ flex: 1, display: 'flex', alignItems: 'center' }),
  bar: css({ height: 3, borderRadius: theme.radius.pill, background: theme.color.brand700, transformOrigin: 'left center' }),
  rankValue: css({ width: 64, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }),
  rankDelta: css({ width: 80, display: 'flex', justifyContent: 'flex-end' }),
  cta: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: theme.radius.lg,
    background: `linear-gradient(135deg, ${theme.color.brand900}, ${theme.color.brand800})`,
    color: theme.color.nightInk,
  }),
  ctaIcon: css({ display: 'grid', placeItems: 'center', width: 48, height: 48, borderRadius: theme.radius.pill, background: theme.onDark(0.1), color: theme.color.lime }),
  ctaTitle: css({ marginTop: 16, fontSize: 18, fontWeight: 700 }),
  ctaText: css({ marginTop: 6, fontSize: 14, color: theme.onDark(0.75) }),
  ctaLink: css({
    marginTop: 24,
    padding: '10px 0',
    borderRadius: theme.radius.sm,
    background: theme.color.surface,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: theme.color.brand900,
    transition: 'background-color 0.2s, color 0.2s',
    '&:hover': { background: theme.color.lime },
  }),
}

export default function CarbonPage() {
  const c = CAMPUS_CARBON
  const total = c.breakdown.reduce((s, b) => s + b.value, 0)
  const prev = c.monthly[c.monthly.length - 2].saved
  const maxSaved = c.buildingRank[0].saved

  const rankRef = useRef<HTMLUListElement>(null)

  return (
    <>
      <PageHeader title="캠퍼스 탄소 절감 현황" subtitle="한밭대 구성원 모두의 노력으로 줄인 탄소 배출량을 확인하세요." />

      <div css={s.kpis}>
        <KpiCard
          icon={<Icon name="eco" size={24} />}
          tone="green"
          label="이번 달 탄소 절감량"
          value={String(c.monthSavedT)}
          unit="tCO₂"
          foot={<span css={s.kpiFoot}>지난달보다 +{(c.monthSavedT - prev).toFixed(1)} t</span>}
        />
        <KpiCard icon={<Icon name="park" size={24} />} tone="lime" label="나무 환산" value={c.trees.toLocaleString()} unit="그루" foot="이번 달 심은 효과" />
        <KpiCard icon={<Icon name="trending_down" size={24} />} tone="purple" label="전년 동월 대비 배출량" value={String(Math.abs(c.yoy))} unit="% 감소" foot={<Delta value={c.yoy} compare="2025년 4월 대비" />} />
        <KpiCard icon={<Icon name="apartment" size={24} />} tone="teal" label="강의실 추천 이용" value={c.recommendUses.toLocaleString()} unit="회" foot="이번 학기 누적" />
      </div>

      <div css={twoCol}>
        <Card>
          <CardHeader title="월별 탄소 절감량" sub="(tCO₂)" />
          <div css={s.chart}>
            <SimpleBars data={c.monthly} x="month" y="saved" unit="tCO₂" height={300} />
          </div>
        </Card>

        <Card>
          <CardHeader title="절감 요인" sub="(이번 달)" />
          <div css={s.donut}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={c.breakdown} dataKey="value" innerRadius="60%" outerRadius="95%" paddingAngle={2} stroke="none">
                  {c.breakdown.map((b, i) => (
                    <Cell key={b.name} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} tCO₂`} />
              </PieChart>
            </ResponsiveContainer>
            <div css={s.donutCenter}>
              <div>
                <p css={eyebrow}>합계</p>
                <p css={s.donutTotal}>
                  <CountUp value={total.toFixed(1)} /> t
                </p>
              </div>
            </div>
          </div>
          <ul css={s.factors}>
            {c.breakdown.map((b, i) => (
              <li key={b.name} css={s.factor}>
                <span css={s.dot} style={{ background: COLORS[i] }} />
                <span css={s.factorName}>{b.name}</span>
                <span css={{ fontWeight: 600 }}>{b.value} tCO₂</span>
                <span css={s.factorPct}>{Math.round((b.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div css={twoCol}>
        <Card>
          <CardHeader title="건물별 절감 순위" sub="(이번 달, kgCO₂)" />
          <ul css={s.rank} ref={rankRef}>
            {c.buildingRank.map((b, i) => (
              <li key={b.code} css={s.rankRow}>
                <span css={s.rankNo}>{i + 1}</span>
                <span css={s.rankName}>
                  <b>{b.code}</b>
                  {b.name}
                </span>
                <div css={s.track}>
                  <div data-bar css={s.bar} style={{ width: `${(b.saved / maxSaved) * 100}%` }} />
                </div>
                <span css={s.rankValue}>{b.saved}</span>
                <span css={s.rankDelta}>
                  <Delta value={b.yoy} />
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <section css={s.cta} data-reveal>
          <div>
            <span css={s.ctaIcon}>
              <Icon name="eco" size={24} />
            </span>
            <p css={s.ctaTitle}>나도 탄소 절감에 참여하기</p>
            <p css={s.ctaText}>스터디나 모임 장소를 정할 때 강의실 추천을 이용해 보세요. 이동 거리와 건물 전력 상태를 고려해 에너지 효율이 높은 강의실을 알려드려요.</p>
          </div>
          <Link to="/classroom" css={s.ctaLink}>
            강의실 추천 받기
          </Link>
        </section>
      </div>
    </>
  )
}
