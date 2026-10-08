import { css } from '@emotion/react'
import { AreaTrend, CHART, Legend } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { Card, CardHeader, PageHeader, SelectBox } from '../../components/ui'
import { HOURLY } from '../../data/mock'
import { CountUp } from '../../motion'
import { theme } from '../../theme'
import { ps } from '../power/PowerTabs'

const peak = HOURLY.reduce((a, b) => (b.kwh > a.kwh ? b : a))
const BANDS = [
  { label: '야간 (00시~06시)', from: 0, to: 6 },
  { label: '오전 (06시~12시)', from: 6, to: 12 },
  { label: '오후 (12시~18시)', from: 12, to: 18 },
  { label: '저녁 (18시~24시)', from: 18, to: 24 },
].map((b) => ({ ...b, avg: Math.round(HOURLY.slice(b.from, b.to).reduce((s, h) => s + h.kwh, 0) / (b.to - b.from)) }))

const s = {
  peak: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24, padding: '20px 24px 0' }),
  divider: css({ width: 1, height: 40, background: theme.color.line }),
  bands: css({ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, padding: '0 24px 24px', [theme.mq.lg]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' } }),
  value: css(ps.num, { fontSize: 24 }),
}

export default function HourlyDetailPage() {
  return (
    <>
      <PageHeader title="시간대별 상세 분석" back={{ to: '/power/hourly', trail: ['전력 소비 시각화', '시간대별'] }} />

      <div css={ps.fields} data-reveal>
        <div css={ps.field}>
          <span css={ps.label}>일자 선택</span>
          <SelectBox value="2026.04.28 (화)" icon={<Icon name="calendar_month" size={16} />} />
        </div>
        <div css={ps.field}>
          <span css={ps.label}>비교 기준</span>
          <SelectBox value="7일 평균" options={['7일 평균', '30일 평균', '전년 동일']} />
        </div>
      </div>

      <Card>
        <div css={s.peak}>
          <div>
            <p css={s.value}>{peak.hour}</p>
            <p css={ps.label}>피크 시간</p>
          </div>
          <span css={s.divider} />
          <p css={s.value}>
            <CountUp value={peak.kwh} /> <span css={ps.unit}>kWh</span>
          </p>
          <div css={ps.pushRight}>
            {/* 비교선 색은 AreaTrend 의 compareKey 선 색과 맞춘다 */}
            <Legend items={[{ name: '선택일', color: CHART.mid }, { name: '7일 평균', color: theme.color.warn }]} />
          </div>
        </div>
        <div css={ps.chart}>
          <AreaTrend data={HOURLY} x="hour" y="kwh" compareKey="avg" height={340} />
        </div>
      </Card>

      <Card css={ps.gap}>
        <CardHeader title="시간대별 요약" />
        <div css={s.bands}>
          {BANDS.map((b) => (
            <div key={b.label} css={ps.tile}>
              <p css={ps.label}>{b.label}</p>
              <p css={[s.value, { margin: '6px 0 2px' }]}>
                <CountUp value={b.avg} /> <span css={ps.unit}>kWh</span>
              </p>
              <p css={ps.caption}>평균</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
