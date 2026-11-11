/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 하루 곡선, 피크 시각과 값을 머리에 얹은 24시간 추이 · states: full (mock) */
/* critique: 시간대 요약이 테두리 타일 넷으로 흩어져 있었다. 곡선을 앞에 두고 요약은 옆의 표로 읽게 한다 */
import { css } from '@emotion/react'
import { AreaTrend, CHART, Legend } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { Card, CardHeader, PageHeader, SelectBox } from '../../components/ui'
import { HOURLY } from '../../data/mock'
import { CountUp } from '../../motion'
import { bigNumber, theme } from '../../theme'

const { color: c, mq } = theme

const peak = HOURLY.reduce((a, b) => (b.kwh > a.kwh ? b : a))
const BANDS = [
  { label: '야간 (00시~06시)', from: 0, to: 6 },
  { label: '오전 (06시~12시)', from: 6, to: 12 },
  { label: '오후 (12시~18시)', from: 12, to: 18 },
  { label: '저녁 (18시~24시)', from: 18, to: 24 },
].map((b) => ({ ...b, avg: Math.round(HOURLY.slice(b.from, b.to).reduce((s, h) => s + h.kwh, 0) / (b.to - b.from)) }))

export default function HourlyDetailPage() {
  return (
    <>
      <PageHeader title="시간대별 상세 분석" back={{ to: '/power/hourly', trail: ['전력 소비 시각화', '시간대별'] }} />

      <div css={s.toolbar}>
        <SelectBox label="일자 선택" value="2026.04.28 (화)" icon={<Icon name="calendar_month" size={16} />} />
        <SelectBox label="비교 기준" value="7일 평균" options={['7일 평균', '30일 평균', '전년 동일']} />
      </div>

      <div css={s.split}>
        <Card>
          <div css={s.head}>
            <dl>
              <dt css={s.label}>피크 시간</dt>
              <dd css={s.peak}>
                {peak.hour}
                <span css={s.unit}>
                  <CountUp value={peak.kwh} /> kWh
                </span>
              </dd>
            </dl>
            <div css={s.legend}>
              {/* 비교선 색은 AreaTrend 의 compareKey 선 색과 맞춘다 */}
              <Legend items={[{ name: '선택일', color: CHART.mid }, { name: '7일 평균', color: theme.color.warn }]} />
            </div>
          </div>
          <div css={s.chart}>
            <AreaTrend data={HOURLY} x="hour" y="kwh" compareKey="avg" height={340} />
          </div>
        </Card>

        <Card>
          <CardHeader title="시간대별 요약" />
          <table css={s.table}>
            <thead>
              <tr>
                <th>시간대</th>
                <th>평균 (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {BANDS.map((b) => (
                <tr key={b.label}>
                  <td>{b.label}</td>
                  <td>
                    <CountUp value={b.avg} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  )
}

const s = {
  toolbar: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 24px', marginBottom: 20 }),
  split: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, alignItems: 'start', [mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 320px' } }),
  head: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16, padding: '20px 24px 4px' }),
  label: css({ fontSize: 13, color: c.sub }),
  peak: css(bigNumber, { marginTop: 6, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 12, fontSize: 32 }),
  unit: css({ fontSize: 16, fontWeight: 500, letterSpacing: 0, color: c.sub }),
  legend: css({ marginLeft: 'auto', paddingBottom: 4 }),
  chart: css({ padding: '0 16px 16px' }),
  table: css({
    marginBottom: 12,
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 24px', textAlign: 'left', fontWeight: 500, fontSize: 12, color: c.mute, whiteSpace: 'nowrap', borderBottom: `1px solid ${c.line}` },
    '& td': { padding: '12px 24px', borderBottom: `1px solid ${c.lineSoft}` },
    '& tr:last-of-type td': { borderBottom: 0 },
    '& th:last-of-type, & td:last-of-type': { textAlign: 'right' },
    '& td:last-of-type': { fontWeight: 600 },
  }),
}
