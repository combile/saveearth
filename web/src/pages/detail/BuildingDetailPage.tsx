/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 건물 장부, 위치·제원 옆에 이달 수치와 일별 추이를 한 판에 · states: full (mock) */
/* critique: 정보 카드, 아이콘 KPI 카드 셋, 차트 카드가 흩어져 있었다. 아이콘 타일을 걷고 한 장의 장부로 모은다 */
/* Hallmark · dropped KpiCard, Icon · 통계에 아이콘 타일을 두지 않는다. 값·라벨·단위는 그대로 dl 로 옮김 */
import { css } from '@emotion/react'
import { Navigate, useParams } from 'react-router-dom'
import { BuildingThumb } from '../../components/CampusMap'
import { AreaTrend } from '../../components/charts'
import { Card, CardHeader, Delta, PageHeader, StatRows } from '../../components/ui'
import { BUILDINGS, DAILY, getBuilding } from '../../data/mock'
import { bigNumber, theme } from '../../theme'

const { color: c, mq } = theme

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

      <Card css={s.sheet}>
        <aside css={s.side}>
          <BuildingThumb building={b} css={s.thumb} />
          <StatRows
            rows={[
              { label: '건물명', value: `${b.code} ${b.name}` },
              { label: '연면적', value: `${b.area.toLocaleString()} ㎡` },
              { label: '준공연도', value: `${b.builtYear}년` },
              { label: '주요 용도', value: b.usage },
              { label: '실시간 사용량', value: `${b.kw.toLocaleString()} kW` },
            ]}
          />
        </aside>

        <div css={s.main}>
          <dl css={s.figs}>
            <div>
              <dt>이번 달 사용량</dt>
              <dd css={[s.fig, s.lead]}>
                {b.monthKwh.toLocaleString()}
                <span css={s.unit}>kWh</span>
              </dd>
              <dd css={s.foot}>
                <Delta value={b.delta} compare="전월 대비" />
              </dd>
            </div>
            <div>
              <dt>평균 일일 사용량</dt>
              <dd css={s.fig}>
                {Math.round(b.monthKwh / 30).toLocaleString()}
                <span css={s.unit}>kWh</span>
              </dd>
            </div>
            <div>
              <dt>전력 사용 순위</dt>
              <dd css={s.fig}>
                {rank}
                <span css={s.unit}>위 / {BUILDINGS.length}개 건물</span>
              </dd>
            </div>
          </dl>

          <CardHeader title="일별 전력 사용량" sub="(kWh)" />
          <div css={s.chart}>
            <AreaTrend data={daily} x="date" y="kwh" height={320} />
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
    gridTemplateColumns: 'minmax(0, 1fr)',
    borderBottom: `1px solid ${c.lineSoft}`,
    '& > div': { padding: '20px 24px' },
    '& > div + div': { borderTop: `1px solid ${c.lineSoft}` },
    '& dt': { fontSize: 13, color: c.sub },
    [mq.md]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', '& > div + div': { borderTop: 0, borderLeft: `1px solid ${c.lineSoft}` } },
  }),
  fig: css(bigNumber, { marginTop: 6, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 4, fontSize: 22 }),
  lead: css({ fontSize: 32 }),
  unit: css({ fontSize: 13, fontWeight: 400, letterSpacing: 0, color: c.sub }),
  foot: css({ marginTop: 6, fontSize: 13 }),
  chart: css({ padding: '0 16px 16px' }),
}
