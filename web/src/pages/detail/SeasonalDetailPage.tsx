/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 계절 도넛과 그 값을 읽는 표, 인사이트를 같은 판의 끝줄에 · states: full (mock) */
/* critique: 범례가 점 목록이었고 인사이트는 색칠한 카드로 따로 떠 있었다. 범례를 표로, 인사이트를 같은 카드의 끝줄로 옮긴다 */
import { css } from '@emotion/react'
import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Icon } from '../../components/Icon'
import { Card, CardHeader, PageHeader, SelectBox } from '../../components/ui'
import { BUILDINGS, SEASONAL } from '../../data/mock'
import { bigNumber, theme } from '../../theme'

const COLORS = theme.season

const { color, radius, mq } = theme

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

      <div css={s.toolbar}>
        <SelectBox label="연도 선택" value="2026년" options={['2026년', '2025년']} />
        <SelectBox label="건물" value={building} options={options} onChange={setBuilding} />
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
                <p css={s.label}>연간 총 사용량</p>
                <p css={s.total}>
                  {total.toLocaleString()}
                  <span css={s.unit}>kWh</span>
                </p>
              </div>
            </div>
          </div>

          <table css={s.table}>
            <thead>
              <tr>
                <th>계절</th>
                <th>사용량 (kWh)</th>
                <th>비중</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.name}>
                  <td>
                    <span css={s.key} style={{ background: COLORS[i] }} />
                    {d.name}
                  </td>
                  <td>{d.value.toLocaleString()}</td>
                  <td>{((d.value / total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div css={s.insight}>
          <Icon name="eco" size={18} css={{ color: color.good }} />
          <p>
            <strong css={s.insightTitle}>인사이트</strong>
            여름철 냉방 사용 증가로 인해 전력 사용량이 가장 높습니다.
          </p>
        </div>
      </Card>
    </>
  )
}

const s = {
  toolbar: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 24px', marginBottom: 20 }),
  body: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', alignItems: 'center', gap: 32, padding: '0 24px 24px', [mq.lg]: { gridTemplateColumns: '320px minmax(0, 1fr)' } }),
  donut: css({ position: 'relative', height: 300 }),
  center: css({ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', pointerEvents: 'none' }),
  label: css({ fontSize: 12, color: color.sub }),
  total: css(bigNumber, { marginTop: 4, fontSize: 22 }),
  unit: css({ marginLeft: 4, fontSize: 12, fontWeight: 400, letterSpacing: 0, color: color.sub }),
  table: css({
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 0', textAlign: 'left', fontWeight: 500, fontSize: 12, color: color.mute, whiteSpace: 'nowrap', borderBottom: `1px solid ${color.line}` },
    '& td': { padding: '14px 0', borderBottom: `1px solid ${color.lineSoft}` },
    '& tr:last-of-type td': { borderBottom: 0 },
    '& th:not(:first-of-type), & td:not(:first-of-type)': { paddingLeft: 16, textAlign: 'right' },
    '& td:nth-of-type(2)': { fontWeight: 600 },
    '& td:last-of-type': { color: color.sub },
  }),
  key: css({ display: 'inline-block', width: 10, height: 10, marginRight: 10, borderRadius: radius.sm / 2, verticalAlign: 'baseline' }),
  insight: css({ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 24px 16px', borderTop: `1px solid ${color.lineSoft}`, fontSize: 13, color: color.sub }),
  insightTitle: css({ marginRight: 8, fontWeight: 600, color: color.ink }),
}
