import { useState } from 'react'
import { AreaTrend, CHART, GroupedBars, Legend } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { Card, CardHeader, MoreLink, Segmented, SelectBox, StatRows } from '../../components/ui'
import { HOURLY, HOURLY_COMPARE } from '../../data/mock'
import { theme } from '../../theme'
import PowerTabs, { ps } from './PowerTabs'

const total = HOURLY.reduce((s, h) => s + h.kwh, 0)
const peak = HOURLY.reduce((a, b) => (b.kwh > a.kwh ? b : a))
const low = HOURLY.reduce((a, b) => (b.kwh < a.kwh ? b : a))

const COMPARE_SERIES = [
  { key: 'mon', name: '월요일', color: CHART.dark },
  { key: 'wed', name: '수요일', color: CHART.mid },
  { key: 'fri', name: '금요일', color: CHART.light },
]

const at = { fontWeight: 400, color: theme.color.mute }

export default function PowerHourlyPage() {
  const [unit, setUnit] = useState<'kWh' | 'kW'>('kWh')

  return (
    <PowerTabs active="시간대별">
      <div css={ps.filterBar} data-reveal>
        <SelectBox label="기간 선택" value="일자 선택" options={['일자 선택', '주간 선택']} />
        <SelectBox value="2026.04.28 (화)" icon={<Icon name="calendar_month" size={16} />} />
        <SelectBox label="비교 건물" value="전체 건물" options={['전체 건물', 'N4 산업정보관', 'S1 도서관']} />
        <div css={ps.pushRight}>
          <Segmented options={['kWh', 'kW'] as const} value={unit} onChange={setUnit} size="sm" />
        </div>
      </div>

      <div css={ps.split(360)}>
        <Card>
          <CardHeader title="시간대별 전력 소비량" sub={`(${unit})`} />
          <div css={ps.chart}>
            <AreaTrend data={HOURLY} x="hour" y="kwh" height={320} unit={unit} />
          </div>
          <MoreLink to="/power/hourly/detail" />
        </Card>
        <Card>
          <CardHeader title="요약 정보" />
          <StatRows
            rows={[
              { label: '일일 총 사용량', value: `${total.toLocaleString()} kWh` },
              { label: '평균 사용량', value: `${Math.round(total / 24).toLocaleString()} kWh` },
              { label: '최대 사용량', value: <>{peak.kwh.toLocaleString()} kWh <span css={at}>({peak.hour})</span></> },
              { label: '최소 사용량', value: <>{low.kwh.toLocaleString()} kWh <span css={at}>({low.hour})</span></> },
            ]}
          />
        </Card>
      </div>

      <div css={ps.split(360)}>
        <Card>
          <CardHeader title="시간대별 비교" right={<Legend items={COMPARE_SERIES} />} />
          <div css={ps.chart}>
            <GroupedBars data={HOURLY_COMPARE} x="label" series={COMPARE_SERIES} height={220} />
          </div>
        </Card>
        <Card>
          <CardHeader title="피크 시간 분석" />
          <StatRows
            rows={[
              { label: '피크 시간', value: `${peak.hour} ~ ${String(parseInt(peak.hour) + 1).padStart(2, '0')}:00` },
              { label: '피크 사용량', value: `${peak.kwh.toLocaleString()} kWh` },
              { label: '평균 대비', value: `${Math.round((peak.kwh / (total / 24)) * 100)}%` },
            ]}
          />
        </Card>
      </div>
    </PowerTabs>
  )
}
