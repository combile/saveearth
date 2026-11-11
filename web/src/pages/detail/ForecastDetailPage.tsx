/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 예측 장부, 위치·제원 옆에 1·3·6시간 예측값과 실시간 추이를 한 판에 · states: full (mock) */
/* critique: 정보 카드와 예측 타일 카드, 차트 카드가 따로 놀았다. 건물 상세와 같은 장부 한 장으로 모으고 예측값을 앞에 세운다 */
import { css } from '@emotion/react'
import { Navigate, useParams } from 'react-router-dom'
import { BuildingThumb } from '../../components/CampusMap'
import { AreaTrend } from '../../components/charts'
import { Card, CardHeader, PageHeader, StatRows } from '../../components/ui'
import { REALTIME_TREND, getBuilding, levelOf } from '../../data/mock'
import { CountUp } from '../../motion'
import { bigNumber, theme } from '../../theme'

const { color: c, mq } = theme

export default function ForecastDetailPage() {
  const { id = '' } = useParams()
  const b = getBuilding(id)
  if (!b) return <Navigate to="/forecast" replace />

  const scale = b.kw / 1380
  const trend = REALTIME_TREND.map((t) => ({ ...t, kw: Math.round(t.kw * scale) }))
  const reserve = levelOf(b.kw) === 'high' ? { v: '15.2% (주의)', c: theme.color.danger } : { v: '24.8% (양호)', c: theme.color.good }

  return (
    <>
      <PageHeader title={`건물 예측 상세 - ${b.code} ${b.name}`} back={{ to: '/forecast', trail: ['실시간 전력 예측'] }} />

      <Card css={s.sheet}>
        <aside css={s.side}>
          <BuildingThumb building={b} css={s.thumb} />
          <StatRows
            rows={[
              { label: '건물명', value: `${b.code} ${b.name}` },
              { label: '연면적', value: `${b.area.toLocaleString()} ㎡` },
              { label: '현재 사용량', value: `${b.kw.toLocaleString()} kW` },
              { label: '전력 예비율', value: <span style={{ color: reserve.c }}>{reserve.v}</span> },
            ]}
          />
        </aside>

        <div css={s.main}>
          <CardHeader title="예측 사용량" sub="(kW)" />
          <dl css={s.figs}>
            {[
              ['1시간 후', 1.074],
              ['3시간 후', 1.24],
              ['6시간 후', 1.373],
            ].map(([label, f]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd css={s.fig}>
                  <CountUp value={Math.round(b.kw * (f as number))} />
                  <span css={s.unit}>kW</span>
                </dd>
              </div>
            ))}
          </dl>

          <CardHeader title="실시간 사용량 추이" sub="(kW)" />
          <div css={s.chart}>
            <AreaTrend data={trend} x="time" y="kw" color={theme.color.danger} unit="kW" height={300} />
          </div>
        </div>
      </Card>
    </>
  )
}

const s = {
  sheet: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', [mq.xl]: { gridTemplateColumns: '300px minmax(0, 1fr)' } }),
  side: css({ paddingTop: 20, borderBottom: `1px solid ${c.lineSoft}`, [mq.xl]: { borderBottom: 0, borderRight: `1px solid ${c.lineSoft}` } }),
  thumb: css({ height: 176, margin: '0 24px 8px' }),
  main: css({ minWidth: 0, display: 'flex', flexDirection: 'column' }),
  figs: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    borderTop: `1px solid ${c.lineSoft}`,
    borderBottom: `1px solid ${c.lineSoft}`,
    '& > div': { padding: '16px 16px 20px', [mq.md]: { padding: '16px 24px 20px' } },
    '& > div + div': { borderLeft: `1px solid ${c.lineSoft}` },
    '& dt': { fontSize: 13, color: c.sub },
  }),
  fig: css(bigNumber, { marginTop: 6, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 4, fontSize: 24, [mq.md]: { fontSize: 32 } }),
  unit: css({ fontSize: 13, fontWeight: 400, letterSpacing: 0, color: c.sub }),
  chart: css({ padding: '0 16px 16px' }),
}
