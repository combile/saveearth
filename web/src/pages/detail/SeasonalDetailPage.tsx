import { css } from '@emotion/react'
import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Icon } from '../../components/Icon'
import { Card, CardHeader, PageHeader, SelectBox } from '../../components/ui'
import { BUILDINGS, SEASONAL } from '../../data/mock'
import { theme } from '../../theme'
import { ps } from '../power/PowerTabs'

const COLORS = ['#5fae86', '#2f8a5b', '#8cc7a6', '#b9dcc8']

const { color, radius, mq } = theme

const s = {
  body: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', alignItems: 'center', gap: 32, padding: '0 24px 24px', [mq.lg]: { gridTemplateColumns: '360px 1fr' } }),
  donut: css({ position: 'relative', height: 320 }),
  center: css({ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', pointerEvents: 'none' }),
  total: css(ps.num, { marginTop: 4, fontSize: 20 }),
  legend: css({ '& > * + *': { borderTop: `1px solid ${color.lineSoft}` } }),
  row: css({ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', fontSize: 14, fontVariantNumeric: 'tabular-nums' }),
  dot: css({ width: 12, height: 12, borderRadius: radius.pill }),
  name: css({ flex: 1, color: color.sub }),
  value: css({ fontWeight: 600 }),
  share: css({ width: 64, textAlign: 'right', color: color.mute }),
}

export default function SeasonalDetailPage() {
  const options = BUILDINGS.map((b) => `${b.code} ${b.name}`)
  const [building, setBuilding] = useState(options[0])
  const b = BUILDINGS[options.indexOf(building)]
  const scale = b.monthKwh / 12542 / 1.83
  const data = SEASONAL.map((x) => ({ name: x.season, value: Math.round(x.cur * scale) }))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <>
      <PageHeader title="계절별 상세 분석" back={{ to: '/power/seasonal', trail: ['전력 소비 시각화', '계절별'] }} />

      <div css={ps.fields} data-reveal>
        <div css={ps.field}>
          <span css={ps.label}>연도 선택</span>
          <SelectBox value="2026년" options={['2026년', '2025년']} />
        </div>
        <div css={ps.field}>
          <span css={ps.label}>건물</span>
          <SelectBox value={building} options={options} onChange={setBuilding} />
        </div>
      </div>

      <Card>
        <CardHeader title="계절별 전력 사용량" sub="(kWh)" />
        <div css={s.body}>
          <div css={s.donut}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie isAnimationActive={false} data={data} dataKey="value" innerRadius="58%" outerRadius="95%" paddingAngle={2} stroke="none">
                  {data.map((d, i) => (
                    <Cell key={d.name} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()} kWh`} />
              </PieChart>
            </ResponsiveContainer>
            <div css={s.center}>
              <div>
                <p css={ps.label}>연간 총 사용량</p>
                <p css={s.total}>{total.toLocaleString()} kWh</p>
              </div>
            </div>
          </div>
          <ul css={s.legend}>
            {data.map((d, i) => (
              <li key={d.name} css={s.row}>
                <span css={s.dot} style={{ background: COLORS[i] }} />
                <span css={s.name}>{d.name}</span>
                <span css={s.value}>{d.value.toLocaleString()} kWh</span>
                <span css={s.share}>({((d.value / total) * 100).toFixed(1)}%)</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card css={[ps.insight, { background: color.lineSoft }]}>
        <span css={ps.insightIcon}>
          <Icon name="eco" size={24} />
        </span>
        <div>
          <p css={ps.insightTitle}>인사이트</p>
          <p css={ps.insightText}>여름철 냉방 사용 증가로 인해 전력 사용량이 가장 높습니다.</p>
        </div>
      </Card>
    </>
  )
}
