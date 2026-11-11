import { css } from '@emotion/react'
import { Navigate, useParams } from 'react-router-dom'
import { BuildingThumb } from '../../components/CampusMap'
import { AreaTrend } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { Card, CardHeader, Delta, KpiCard, PageHeader } from '../../components/ui'
import { BUILDINGS, DAILY, getBuilding } from '../../data/mock'
import { theme } from '../../theme'
import { ps } from '../power/PowerTabs'

const s = {
  stats: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, [theme.mq.md]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' } }),
}

export default function BuildingDetailPage() {
  const { id = '' } = useParams()
  const b = getBuilding(id)
  if (!b) return <Navigate to="/power/building" replace />

  const rank = BUILDINGS.findIndex((v) => v.id === b.id) + 1
  const scale = b.monthKwh / 12542
  const daily = DAILY.map((d) => ({ ...d, kwh: Math.round(d.kwh * scale) }))

  return (
    <>
      <PageHeader title={`건물 상세 - ${b.code} ${b.name}`} back={{ to: '/power/building', trail: ['전력 소비 시각화', '건물별'] }} />

      <div css={[ps.split(300, true), { marginTop: 0 }]}>
        <Card css={ps.info}>
          <BuildingThumb building={b} css={ps.thumb} />
          <dl css={ps.infoList}>
            {[
              ['건물명', `${b.code} ${b.name}`],
              ['연면적', `${b.area.toLocaleString()} ㎡`],
              ['준공연도', `${b.builtYear}년`],
              ['주요 용도', b.usage],
              ['실시간 사용량', `${b.kw.toLocaleString()} kW`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt css={ps.label}>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div css={ps.stack}>
          <div css={s.stats}>
            <KpiCard icon={<Icon name="bolt" />} label="이번 달 사용량" value={b.monthKwh.toLocaleString()} unit="kWh" foot={<Delta value={b.delta} compare="전월 대비" />} />
            <KpiCard icon={<Icon name="bar_chart" />} label="평균 일일 사용량" value={Math.round(b.monthKwh / 30).toLocaleString()} unit="kWh" />
            <KpiCard icon={<Icon name="leaderboard" />} label="전력 사용 순위" value={String(rank)} unit={`위 / ${BUILDINGS.length}개 건물`} />
          </div>

          <Card css={ps.grow}>
            <CardHeader title="일별 전력 사용량" sub="(kWh)" />
            <div css={ps.chart}>
              <AreaTrend data={daily} x="date" y="kwh" height={320} />
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
