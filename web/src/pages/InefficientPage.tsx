/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 순위표, 지수를 막대로 함께 읽는 비효율 구역 TOP 5 · states: full (목업) */
/* critique: 표·지도·안내가 같은 무게로 흩어져 있었다. 순위표가 화면을 이끌고, 안내는 표 아래 기준선으로, 지도는 옆에서 위치만 짚는다 */
import { css } from '@emotion/react'
import CampusMap from '../components/CampusMap'
import { Badge, Card, CardHeader, PageHeader } from '../components/ui'
import { INEFFICIENT, getBuilding } from '../data/mock'
import { theme } from '../theme'

const c = theme.color
const STATUS = { danger: '매우 높음', warn: '주의', good: '보통' } as const
const TONE = { danger: c.danger, warn: c.warn, good: c.good } as const

const LEGEND = [
  { label: '양호 (≤100%)', tone: 'good' },
  { label: '주의 (100~120%)', tone: 'warn' },
  { label: '비효율 (≥120%)', tone: 'danger' },
] as const

// 막대 길이는 표 안의 최댓값 기준. 100% 지점에 기준선을 긋는다
const MAX = Math.max(...INEFFICIENT.map((z) => z.ratio))
const pct = (v: number) => `${(v / MAX) * 100}%`

const s = {
  grid: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, alignItems: 'start', [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)' } }),
  scroll: css({ overflowX: 'auto' }),
  table: css({
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: c.mute, whiteSpace: 'nowrap', borderBottom: `1px solid ${c.line}` },
    '& td': { padding: '12px', borderBottom: `1px solid ${c.lineSoft}`, whiteSpace: 'nowrap' },
    '& th:first-of-type, & td:first-of-type': { paddingLeft: 20 },
    '& th:last-of-type, & td:last-of-type': { paddingRight: 20 },
    '& tbody tr': { transition: `background-color 0.2s ${theme.ease}` },
    '& tbody tr:hover': { background: c.bg },
  }),
  rank: css({ width: 48, fontWeight: 600, color: c.sub }),
  place: css({ fontWeight: 600 }),
  right: css({ '&&': { textAlign: 'right' } }),
  barCell: css({ width: '40%', minWidth: 140 }),
  track: css({ position: 'relative', height: 6, borderRadius: theme.radius.pill, background: c.lineSoft }),
  fill: css({ position: 'absolute', inset: '0 auto 0 0', borderRadius: theme.radius.pill }),
  base: css({ position: 'absolute', top: -4, bottom: -4, width: 1, background: c.sub }),
  ratio: css({ width: 72, fontWeight: 600 }),
  foot: css({ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 20px 20px', fontSize: 13, color: c.sub }),
  footTitle: css({ fontWeight: 600, color: c.ink }),
  legend: css({ display: 'flex', flexWrap: 'wrap', gap: 8 }),
  map: css({ padding: '0 20px 20px' }),
}

export default function InefficientPage() {
  return (
    <>
      <PageHeader title="비효율 구역 분석" subtitle="전력 사용 효율이 낮은 구역과 낭비 가능성이 높은 구역을 확인하세요." />

      <div css={s.grid}>
        <Card>
          <CardHeader title="비효율 구역 TOP 5" />
          <div css={s.scroll}>
            <table css={s.table}>
              <thead>
                <tr>
                  <th>순위</th>
                  <th>구역</th>
                  <th css={s.right}>비효율 지수</th>
                  <th aria-hidden="true" />
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {INEFFICIENT.map((z) => (
                  <tr key={z.rank}>
                    <td css={s.rank}>{z.rank}</td>
                    <td css={s.place}>{z.place}</td>
                    <td css={[s.right, s.ratio]}>{z.ratio}%</td>
                    <td css={s.barCell} aria-hidden="true">
                      <div css={s.track}>
                        <span css={s.fill} style={{ width: pct(z.ratio), background: TONE[z.status] }} />
                        <span css={s.base} style={{ left: pct(100) }} />
                      </div>
                    </td>
                    <td>
                      <Badge tone={z.status}>{STATUS[z.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div css={s.foot}>
            <h3 css={s.footTitle}>비효율 지수 안내</h3>
            <p>비효율 지수는 유사 시간대, 유사 면적 대비 전력 사용량의 비율을 의미합니다.</p>
            <div css={s.legend}>
              {LEGEND.map((l) => (
                <Badge key={l.label} tone={l.tone}>
                  {l.label}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="비효율 구역 지도" />
          <div css={s.map}>
            <CampusMap pins={INEFFICIENT.map((z) => ({ building: getBuilding(z.buildingId)!, tone: z.status }))} />
          </div>
        </Card>
      </div>
    </>
  )
}
