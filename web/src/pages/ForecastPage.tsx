/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 예측 말풍선이 올라간 캠퍼스 맵, 위에 실시간 요약 수치 · states: full (목업) */
/* critique: 맵을 화면의 주인공으로 넓히고 요약은 맵 위 수치 줄로 붙인다. 추이 차트 옆에 같은 값을 표로 둔다 */
import { css } from '@emotion/react'
import CampusMap from '../components/CampusMap'
import { CHART, Legend, MultiLine } from '../components/charts'
import { Icon } from '../components/Icon'
import { Card, CardHeader, PageHeader } from '../components/ui'
import { BUILDINGS, FORECAST, FORECAST_SUMMARY, LAST_UPDATED } from '../data/mock'
import { theme } from '../theme'

const c = theme.color

const SERIES = [
  { key: 'now', name: '현재', color: CHART.dark },
  { key: 'h1', name: '1시간 후', color: theme.color.seriesBlue },
  { key: 'h3', name: '3시간 후', color: theme.color.seriesOrange },
] as const

const s = {
  updated: css({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: c.sub, fontVariantNumeric: 'tabular-nums' }),
  refresh: css({
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    borderRadius: theme.radius.sm,
    color: c.sub,
    transition: 'color 0.2s, background-color 0.2s',
    '&:hover': { color: c.ink, background: c.lineSoft },
  }),
  summary: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px 0',
    padding: '4px 20px 20px',
    borderBottom: `1px solid ${c.lineSoft}`,
    [theme.mq.lg]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
    '& > div': { paddingRight: 16 },
    '& > div + div': { [theme.mq.lg]: { borderLeft: `1px solid ${c.lineSoft}`, paddingLeft: 16 } },
    '& dt': { fontSize: 12, color: c.sub },
    '& dd': { marginTop: 4, fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' },
  }),
  map: css({ padding: '16px 16px 12px' }),
  mapHint: css({ padding: '0 20px 16px', fontSize: 12, color: c.sub }),
  lower: css({ marginTop: 20 }),
  body: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 420px' } }),
  legend: css({ padding: '0 20px' }),
  chart: css({ padding: '8px 8px 16px' }),
  table: css({
    alignSelf: 'start',
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 20px', textAlign: 'left', fontWeight: 500, fontSize: 12, color: c.sub, whiteSpace: 'nowrap', borderBottom: `1px solid ${c.line}` },
    '& td': { padding: '10px 20px', borderBottom: `1px solid ${c.lineSoft}`, whiteSpace: 'nowrap' },
    '& tr:last-of-type td': { borderBottom: 0 },
    '& th:not(:first-of-type), & td:not(:first-of-type)': { textAlign: 'right' },
    '& td b': { marginRight: 6, fontWeight: 600 },
    '& td span': { color: c.sub },
  }),
}

export default function ForecastPage() {
  return (
    <>
      <PageHeader title="실시간 전력 예측" subtitle="건물별 실시간 전력 사용량과 예측 데이터를 확인할 수 있습니다." />

      <Card>
        <CardHeader
          title="실시간 요약"
          right={
            <p css={s.updated}>
              마지막 업데이트: {LAST_UPDATED}
              {/* 새로고침 로직은 아직 없다 (목업) */}
              <button type="button" aria-label="새로고침" css={s.refresh}>
                <Icon name="refresh" size={16} />
              </button>
            </p>
          }
        />
        <dl css={s.summary}>
          {FORECAST_SUMMARY.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
        <div css={s.map}>
          <CampusMap callouts={BUILDINGS} legend linkTo={(b) => `/forecast/${b.id}`} />
        </div>
        <p css={s.mapHint}>말풍선을 누르면 건물별 예측 상세로 이동합니다.</p>
      </Card>

      <Card css={s.lower}>
        <CardHeader title="건물별 예측 추이" sub="(kW)" />
        <div css={s.body}>
          <div css={{ minWidth: 0 }}>
            <div css={s.legend}>
              <Legend items={[...SERIES]} />
            </div>
            <div css={s.chart}>
              <MultiLine data={FORECAST} x="name" series={[...SERIES]} height={260} />
            </div>
          </div>
          <table css={s.table}>
            <thead>
              <tr>
                <th>건물</th>
                {SERIES.map((sr) => (
                  <th key={sr.key}>{sr.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FORECAST.map((r) => (
                <tr key={r.name}>
                  <td>
                    <b>{r.name}</b>
                    <span>{BUILDINGS.find((b) => b.code === r.name)?.name}</span>
                  </td>
                  {SERIES.map((sr) => (
                    <td key={sr.key}>{r[sr.key].toLocaleString()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
