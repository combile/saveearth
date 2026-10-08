import { css } from '@emotion/react'
import { Navigate, useParams } from 'react-router-dom'
import { BuildingThumb } from '../../components/CampusMap'
import { AreaTrend } from '../../components/charts'
import { Card, CardHeader, PageHeader } from '../../components/ui'
import { REALTIME_TREND, getBuilding, levelOf } from '../../data/mock'
import { CountUp } from '../../motion'
import { theme } from '../../theme'
import { ps } from '../power/PowerTabs'

const s = {
  tiles: css({ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, padding: '0 24px 24px', textAlign: 'center' }),
  value: css(ps.num, { marginTop: 6, fontSize: 24 }),
}

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

      <div css={[ps.split(300, true), { marginTop: 0 }]}>
        <Card css={ps.info}>
          <BuildingThumb building={b} css={ps.thumb} />
          <dl css={ps.infoList}>
            {[
              ['건물명', `${b.code} ${b.name}`],
              ['연면적', `${b.area.toLocaleString()} ㎡`],
              ['현재 사용량', `${b.kw.toLocaleString()} kW`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt css={ps.label}>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div>
              <dt css={ps.label}>전력 예비율</dt>
              <dd style={{ color: reserve.c }}>{reserve.v}</dd>
            </div>
          </dl>
        </Card>

        <div css={ps.stack}>
          <Card>
            <CardHeader title="예측 사용량" sub="(kW)" />
            <div css={s.tiles}>
              {[
                ['1시간 후', 1.074],
                ['3시간 후', 1.24],
                ['6시간 후', 1.373],
              ].map(([label, f]) => (
                <div key={label} css={ps.tile}>
                  <p css={ps.label}>{label}</p>
                  <p css={s.value}>
                    <CountUp value={Math.round(b.kw * (f as number))} /> <span css={ps.unit}>kW</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <Card css={ps.grow}>
            <CardHeader title="실시간 사용량 추이" sub="(kW)" />
            <div css={ps.chart}>
              <AreaTrend data={trend} x="time" y="kw" color={theme.color.danger} unit="kW" height={300} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
