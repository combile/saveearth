import { css } from '@emotion/react'
import CampusMap from '../components/CampusMap'
import { Badge, Card, CardHeader, PageHeader } from '../components/ui'
import { INEFFICIENT, getBuilding } from '../data/mock'
import { eyebrow, theme } from '../theme'

const STATUS = { danger: '매우 높음', warn: '주의', good: '보통' } as const

const LEGEND = [
  { label: '양호 (≤100%)', color: theme.color.good },
  { label: '주의 (100~120%)', color: theme.color.warn },
  { label: '비효율 (≥120%)', color: theme.color.danger },
]

const s = {
  grid: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 6fr)' } }),
  tableWrap: css({ margin: '0 20px 20px', overflow: 'hidden', borderRadius: theme.radius.md, border: `1px solid ${theme.color.lineSoft}` }),
  table: css({
    fontSize: 14,
    '& th': [eyebrow, { padding: '12px 16px', fontWeight: 500, background: theme.color.bg }],
    '& td': { padding: '14px 16px', textAlign: 'center', borderTop: `1px solid ${theme.color.lineSoft}` },
    '& tbody tr': { transition: 'background-color 0.2s' },
    '& tbody tr:hover': { background: theme.color.bg },
  }),
  rank: css({ fontWeight: 600, fontFamily: theme.font.mono }),
  ratio: css({ fontVariantNumeric: 'tabular-nums' }),
  map: css({ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px 20px' }),
  guide: css({ padding: '0 24px 24px' }),
  guideText: css({ marginBottom: 16, fontSize: 14, color: theme.color.sub }),
  chips: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12, [theme.mq.sm]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' } }),
  // 색은 점에만 쓰는 중립 범례 칩
  chip: css({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: theme.radius.sm, background: theme.color.lineSoft, fontSize: 13, fontWeight: 500, color: theme.color.sub }),
  dot: css({ width: 6, height: 6, borderRadius: theme.radius.pill }),
}

export default function InefficientPage() {
  return (
    <>
      <PageHeader title="비효율 구역 분석" subtitle="전력 사용 효율이 낮은 구역과 낭비 가능성이 높은 구역을 확인하세요." />

      <div css={s.grid}>
        <Card>
          <CardHeader title="비효율 구역 TOP 5" />
          <div css={s.tableWrap}>
            <table css={s.table}>
              <thead>
                <tr>
                  <th>순위</th>
                  <th css={{ textAlign: 'left' }}>구역</th>
                  <th css={{ color: theme.color.danger }}>비효율 지수</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {INEFFICIENT.map((z) => (
                  <tr key={z.rank}>
                    <td css={s.rank}>{z.rank}</td>
                    <td css={{ textAlign: 'left' }}>{z.place}</td>
                    <td css={s.ratio}>{z.ratio}%</td>
                    <td>
                      <Badge tone={z.status}>{STATUS[z.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="비효율 구역 지도" />
          <div css={s.map}>
            <CampusMap pins={INEFFICIENT.map((z) => ({ building: getBuilding(z.buildingId)!, tone: z.status }))} />
          </div>
        </Card>
      </div>

      <Card css={{ marginTop: 20 }}>
        <CardHeader title="비효율 지수 안내" />
        <div css={s.guide}>
          <p css={s.guideText}>비효율 지수는 유사 시간대, 유사 면적 대비 전력 사용량의 비율을 의미합니다.</p>
          <div css={s.chips}>
            {LEGEND.map((l) => (
              <span key={l.label} css={s.chip}>
                <i css={s.dot} style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}
