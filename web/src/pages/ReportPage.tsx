/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 기간 리포트 한 장, 요약 수치와 일별 추이를 한 문서로 · states: full (목업) */
/* critique: 아이콘 KPI 카드 넷과 차트·목록이 따로 놀았다. 고른 탭과 기간의 리포트를 한 장의 문서로 묶고, 지난 리포트는 옆 목록으로 둔다 */
/* Hallmark · dropped KPI icons bolt, cloud, insights, battery_charging_full · 수치 옆 아이콘 타일 금지(stat), 라벨은 그대로 */
import { css } from '@emotion/react'
import { useState } from 'react'
import { CHART, GroupedBars, Legend } from '../components/charts'
import { Icon } from '../components/Icon'
import { Button, Card, CardHeader, Delta, MoreLink, PageHeader, SelectBox, UnderlineTabs } from '../components/ui'
import { DAILY, REPORTS } from '../data/mock'
import { bigNumber, theme } from '../theme'

const TABS = ['요약 리포트', '전력 사용 리포트', '탄소 배출 리포트', '사용자 참여 리포트']
const SERIES = [
  { key: 'kwh', name: '이번 달', color: CHART.dark },
  { key: 'prev', name: '전월', color: CHART.light },
]
const PERIOD = '2026.04.01 - 2026.04.30'

const c = theme.color

const s = {
  toolbar: css({ margin: '20px 0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }),
  main: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: 20,
    alignItems: 'start',
    [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 340px' },
  }),
  stats: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    borderTop: `1px solid ${c.lineSoft}`,
    borderBottom: `1px solid ${c.lineSoft}`,
    '& > div': { padding: '16px 20px', minWidth: 0 },
    '& > div:nth-of-type(even)': { borderLeft: `1px solid ${c.lineSoft}` },
    '& > div:nth-of-type(n+3)': { borderTop: `1px solid ${c.lineSoft}` },
    [theme.mq.lg]: {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      '& > div + div': { borderLeft: `1px solid ${c.lineSoft}` },
      '& > div:nth-of-type(n+3)': { borderTop: 0 },
    },
    '& dt': { fontSize: 12, color: c.sub },
  }),
  value: css(bigNumber, { marginTop: 6, fontSize: 22 }),
  unit: css({ marginLeft: 4, fontSize: 12, fontWeight: 400, letterSpacing: 0, color: c.mute }),
  foot: css({ marginTop: 4, fontSize: 12, color: c.sub, fontVariantNumeric: 'tabular-nums', '& > span': { fontSize: 12 } }),
  good: css({ fontWeight: 500, color: c.good }),
  section: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: '18px 20px 4px' }),
  sectionTitle: css({ fontSize: 13, fontWeight: 600 }),
  sectionSub: css({ fontSize: 12, color: c.mute }),
  legend: css({ marginLeft: 'auto' }),
  chart: css({ padding: '0 16px 16px' }),
  list: css({ padding: '0 20px', marginBottom: 12, '& > li + li': { borderTop: `1px solid ${c.lineSoft}` } }),
  row: css({ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, padding: '12px 0', fontSize: 13 }),
  rowTitle: css({ fontWeight: 500 }),
  rowDate: css({ flexShrink: 0, fontSize: 12, color: c.mute, fontVariantNumeric: 'tabular-nums' }),
}

export default function ReportPage() {
  const [tab, setTab] = useState(TABS[0])

  const stats = [
    { label: '총 전력 사용량', value: '56,782', unit: 'kWh', foot: <Delta value={-2.1} compare="전월 대비" /> },
    { label: '총 탄소 배출량', value: '853', unit: 'tCO₂', foot: <Delta value={-4.8} compare="전월 대비" /> },
    { label: '최대 전력', value: '1,842', unit: 'kW', foot: '2026.04.15 14:00' },
    { label: '전력 예비율', value: '21.3', unit: '%', foot: <span css={s.good}>양호</span> },
  ]

  return (
    <>
      <PageHeader title="리포트" subtitle="전력 사용 현황과 성과를 리포트로 확인하고 다운로드할 수 있습니다." />
      <UnderlineTabs items={TABS.map((t) => ({ label: t, active: t === tab, onClick: () => setTab(t) }))} />

      <div css={s.toolbar}>
        <SelectBox label="기간 선택" value={PERIOD} icon={<Icon name="calendar_month" size={16} />} />
        <Button>
          <Icon name="download" size={16} /> 다운로드
        </Button>
      </div>

      <div css={s.main}>
        <Card>
          <CardHeader title={tab} sub={PERIOD} />
          <dl css={s.stats}>
            {stats.map((k) => (
              <div key={k.label}>
                <dt>{k.label}</dt>
                <dd css={s.value}>
                  {k.value}
                  <span css={s.unit}>{k.unit}</span>
                </dd>
                <dd css={s.foot}>{k.foot}</dd>
              </div>
            ))}
          </dl>
          <div css={s.section}>
            <h3 css={s.sectionTitle}>일일 전력 사용량 추이</h3>
            <span css={s.sectionSub}>(kWh)</span>
            <div css={s.legend}>
              <Legend items={SERIES} />
            </div>
          </div>
          <div css={s.chart}>
            <GroupedBars data={DAILY} x="date" series={SERIES} height={300} />
          </div>
        </Card>

        <Card>
          <CardHeader title="리포트 목록" />
          <ul css={s.list}>
            {REPORTS.map((r) => (
              <li key={r.title} css={s.row}>
                <span css={s.rowTitle}>{r.title}</span>
                <span css={s.rowDate}>{r.date}</span>
              </li>
            ))}
          </ul>
          <MoreLink />
        </Card>
      </div>
    </>
  )
}
