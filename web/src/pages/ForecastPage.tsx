import { css } from '@emotion/react'
import CampusMap from '../components/CampusMap'
import { CHART, Legend, MultiLine } from '../components/charts'
import { Icon } from '../components/Icon'
import { Card, CardHeader, PageHeader, StatRows } from '../components/ui'
import { BUILDINGS, FORECAST, FORECAST_SUMMARY, LAST_UPDATED } from '../data/mock'
import { eyebrow, theme } from '../theme'

const SERIES = [
  { key: 'now', name: '현재', color: CHART.dark },
  { key: 'h1', name: '1시간 후', color: '#5b8def' },
  { key: 'h3', name: '3시간 후', color: '#f97316' },
]

const s = {
  updated: css(eyebrow, { marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }),
  refresh: css({
    display: 'grid',
    placeItems: 'center',
    color: theme.color.sub,
    transition: `color 0.2s, transform 0.6s ${theme.ease}`,
    '&:hover': { color: theme.color.brand700, transform: 'rotate(180deg)' },
  }),
  grid: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 400px' } }),
  mapCard: css({ justifyContent: 'center', padding: 16 }),
  mapHint: css({ paddingBottom: 4, textAlign: 'center', fontSize: 12, color: theme.color.mute }),
  side: css({ display: 'flex', flexDirection: 'column', gap: 20 }),
  legend: css({ padding: '0 20px' }),
  chart: css({ padding: '8px 8px 16px' }),
}

export default function ForecastPage() {
  return (
    <>
      <PageHeader title="실시간 전력 예측" subtitle="건물별 실시간 전력 사용량과 예측 데이터를 확인할 수 있습니다." />

      <p css={s.updated}>
        마지막 업데이트: {LAST_UPDATED}
        <button aria-label="새로고침" css={s.refresh}>
          <Icon name="refresh" size={16} />
        </button>
      </p>

      <div css={s.grid}>
        <Card css={s.mapCard}>
          <CampusMap callouts={BUILDINGS} legend linkTo={(b) => `/forecast/${b.id}`} />
          <p css={s.mapHint}>말풍선을 누르면 건물별 예측 상세로 이동합니다.</p>
        </Card>

        <div css={s.side}>
          <Card>
            <CardHeader title="실시간 요약" />
            <StatRows rows={FORECAST_SUMMARY.map((r) => ({ label: r.label, value: r.value }))} />
          </Card>
          <Card css={{ flex: 1 }}>
            <CardHeader title="건물별 예측 추이" sub="(kW)" />
            <div css={s.legend}>
              <Legend items={SERIES} />
            </div>
            <div css={s.chart}>
              <MultiLine data={FORECAST} x="name" series={SERIES} height={240} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
