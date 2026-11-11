/* Hallmark · redesign: full · shape: app screen · signature: 계절 비교 원장 (올해·작년·증감을 계절마다 한 줄, 연간 합계로 닫음) · states: full (목업) */
/* critique: 화살표 아이콘을 붙인 초록 퍼센트 목록을 숫자 표로 바꾼다. 증가를 초록으로 칠하던 신호도 걷는다 */
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
const signed = (v: string) => (Number(v) > 0 ? `+${v}` : v)

const ROWS = [
  ...SEASONAL.map((x) => ({ label: x.season.split(' ')[0], cur: x.cur, prev: x.prev, v: pct(x.cur, x.prev) })),
  { label: '연간 총 사용량', cur: sumCur, prev: sumPrev, v: pct(sumCur, sumPrev) },
]

const { color } = theme

const s = {
  table: css({
    marginBottom: 12,
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 10px', fontSize: 12, fontWeight: 500, color: color.mute, textAlign: 'right', whiteSpace: 'nowrap', borderBottom: `1px solid ${color.line}` },
    '& td': { padding: '12px 10px', textAlign: 'right', whiteSpace: 'nowrap', borderBottom: `1px solid ${color.lineSoft}` },
    '& th:first-of-type, & td:first-of-type': { paddingLeft: 20, textAlign: 'left' },
    '& th:last-of-type, & td:last-of-type': { paddingRight: 20 },
    '& td:first-of-type': { color: color.sub },
    '& td:last-of-type': { fontWeight: 600 },
    // 연간 합계 행: 위에 진한 헤어라인, 굵게
    '& tbody tr:last-of-type td': { borderBottom: 0, borderTop: `1px solid ${color.line}`, fontWeight: 600, color: color.ink },
  }),
}

export default function PowerSeasonalPage() {
  return (
    <PowerTabs active="계절별">
      <div css={ps.filterBar} data-reveal>
        <SelectBox label="연도 선택" value="2026년" options={['2026년', '2025년', '2024년']} />
        <SelectBox label="비교 기준" value="전년도(2025년)" options={['전년도(2025년)', '2년 전(2024년)']} />
      </div>

      <div css={ps.split(360)}>
        <Card>
          <CardHeader title="계절별 전력 소비량" sub="(kWh)" right={<Legend items={SERIES} />} />
          <div css={ps.chart}>
            <GroupedBars data={SEASONAL} x="season" series={SERIES} height={340} labels />
          </div>
          <MoreLink to="/power/seasonal/detail" />
        </Card>
        <Card>
          <CardHeader title="계절별 비교" sub="(kWh)" />
          <table css={s.table}>
            <thead>
              <tr>
                <th>계절</th>
                <th>{SERIES[0].name}</th>
                <th>{SERIES[1].name}</th>
                <th>증감</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  <td>{r.cur.toLocaleString()}</td>
                  <td>{r.prev.toLocaleString()}</td>
                  <td>{signed(r.v)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
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
