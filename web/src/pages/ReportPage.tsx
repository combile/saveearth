import { css } from '@emotion/react'
import { useState } from 'react'
import { CHART, GroupedBars, Legend } from '../components/charts'
import { Icon } from '../components/Icon'
import { Button, Card, CardHeader, Delta, MoreLink, PageHeader, SelectBox, UnderlineTabs } from '../components/ui'
import { DAILY, REPORTS } from '../data/mock'
import { CountUp } from '../motion'
import { bigNumber, eyebrow, theme } from '../theme'

const TABS = ['요약 리포트', '전력 사용 리포트', '탄소 배출 리포트', '사용자 참여 리포트']
const SERIES = [
  { key: 'kwh', name: '이번 달', color: CHART.dark },
  { key: 'prev', name: '전월', color: CHART.light },
]

const c = theme.color

const s = {
  toolbar: css({ marginTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }),
  period: css({ display: 'flex', flexDirection: 'column', gap: 6 }),
  download: css({ padding: '10px 20px' }),
  kpis: css({
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 20,
    [theme.mq.md]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.mq.xxl]: { gridTemplateColumns: 'repeat(4, 1fr)' },
  }),
  kpi: css({ padding: '20px 24px' }),
  kpiLabel: css({ fontSize: 14, color: c.sub }),
  kpiValue: css(bigNumber, { marginTop: 8, fontSize: 32 }),
  kpiUnit: css({ marginLeft: 6, fontSize: 14, fontWeight: 400, letterSpacing: 0, color: c.sub }),
  kpiFoot: css({ marginTop: 6, fontSize: 14, color: c.sub }),
  good: css({ fontWeight: 500, color: c.good }),
  main: css({
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 20,
    [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 400px' },
  }),
  chart: css({ padding: '0 16px 16px' }),
  list: css({
    margin: '0 20px',
    border: `1px solid ${c.lineSoft}`,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    '& > li + li': { borderTop: `1px solid ${c.lineSoft}` },
  }),
  row: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
    fontSize: 14,
    transition: `background-color 0.25s ${theme.ease}`,
    '&:hover': { backgroundColor: c.bg },
  }),
  rowTitle: css({ fontWeight: 500 }),
  rowDate: css(eyebrow, { flexShrink: 0 }),
}

export default function ReportPage() {
  const [tab, setTab] = useState(TABS[0])

  return (
    <>
      <PageHeader title="리포트" subtitle="전력 사용 현황과 성과를 리포트로 확인하고 다운로드할 수 있습니다." />
      <UnderlineTabs items={TABS.map((t) => ({ label: t, active: t === tab, onClick: () => setTab(t) }))} />

      <div css={s.toolbar} data-reveal>
        <div css={s.period}>
          <span css={eyebrow}>기간 선택</span>
          <SelectBox value="2026.04.01 - 2026.04.30" icon={<Icon name="calendar_month" size={16} />} />
        </div>
        <Button css={s.download}>
          <Icon name="download" size={16} /> 다운로드
        </Button>
      </div>

      <div css={s.kpis}>
        {[
          { label: '총 전력 사용량', value: '56,782', unit: 'kWh', foot: <Delta value={-2.1} compare="전월 대비" /> },
          { label: '총 탄소 배출량', value: '853', unit: 'tCO₂', foot: <Delta value={-4.8} compare="전월 대비" /> },
          { label: '최대 전력', value: '1,842', unit: 'kW', foot: '2026.04.15 14:00' },
          { label: '전력 예비율', value: '21.3', unit: '%', foot: <span css={s.good}>양호</span> },
        ].map((k) => (
          <Card key={k.label} css={s.kpi}>
            <p css={s.kpiLabel}>{k.label}</p>
            <p css={s.kpiValue}>
              <CountUp value={k.value} />
              <span css={s.kpiUnit}>{k.unit}</span>
            </p>
            <div css={s.kpiFoot}>{k.foot}</div>
          </Card>
        ))}
      </div>

      <div css={s.main}>
        <Card>
          <CardHeader title="일일 전력 사용량 추이" sub="(kWh)" right={<Legend items={SERIES} />} />
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
