import { css } from '@emotion/react'
import { CHART, GroupedBars, Legend } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { Card, CardHeader, MoreLink, SelectBox } from '../../components/ui'
import { SEASONAL } from '../../data/mock'
import { theme } from '../../theme'
import PowerTabs, { ps } from './PowerTabs'

const SERIES = [
  { key: 'cur', name: '2026년', color: CHART.mid },
  { key: 'prev', name: '2025년', color: CHART.light },
]

const pct = (a: number, b: number) => (((a - b) / b) * 100).toFixed(1)
const sumCur = SEASONAL.reduce((s, x) => s + x.cur, 0)
const sumPrev = SEASONAL.reduce((s, x) => s + x.prev, 0)

const { color } = theme

const s = {
  rows: css({ padding: '0 24px 16px', '& > * + *': { borderTop: `1px solid ${color.lineSoft}` } }),
  row: css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', fontSize: 14 }),
  rowLabel: css({ color: color.sub }),
  rowValue: css({ display: 'flex', alignItems: 'center', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: color.good }),
}

export default function PowerSeasonalPage() {
  return (
    <PowerTabs active="계절별">
      <div css={ps.filterBar} data-reveal>
        <SelectBox label="연도 선택" value="2026년" options={['2026년', '2025년', '2024년']} />
        <SelectBox label="비교 기준" value="전년도(2025년)" options={['전년도(2025년)', '2년 전(2024년)']} />
      </div>

      <div css={ps.split(300)}>
        <Card>
          <CardHeader title="계절별 전력 소비량" sub="(kWh)" right={<Legend items={SERIES} />} />
          <div css={ps.chart}>
            <GroupedBars data={SEASONAL} x="season" series={SERIES} height={340} labels />
          </div>
          <MoreLink to="/power/seasonal/detail" />
        </Card>
        <Card>
          <CardHeader title="계절별 비교" />
          <dl css={s.rows}>
            {[...SEASONAL.map((x) => ({ label: x.season.split(' ')[0], v: pct(x.cur, x.prev) })), { label: '연간 총 사용량', v: pct(sumCur, sumPrev) }].map((r) => (
              <div key={r.label} css={s.row}>
                <dt css={s.rowLabel}>{r.label}</dt>
                <dd css={s.rowValue}>
                  <Icon name="arrow_drop_up" size={20} />
                  {r.v}%
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <Card css={ps.insight}>
        <span css={ps.insightIcon}>
          <Icon name="eco" size={24} />
        </span>
        <div>
          <p css={ps.insightTitle}>계절별 인사이트</p>
          <p css={ps.insightText}>여름철(6~8월) 전력 사용량이 가장 높으며, 전년 대비 {pct(SEASONAL[1].cur, SEASONAL[1].prev)}% 증가했습니다.</p>
        </div>
      </Card>
    </PowerTabs>
  )
}
