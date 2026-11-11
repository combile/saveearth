/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 캠퍼스 현황판, 네 지표와 구역별 예측 지도를 한 판에 · states: full (mock) */
/* critique: 인사말 아래 카드 넷이 먼저 보이던 화면. 지표를 지도 옆 한 열로 묶어 현황판을 맨 위에 두고, 순위·추천은 표로 바꾼다 */
import { css } from '@emotion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import CampusMap from '../components/CampusMap'
import { CHART, GroupedBars, SimpleBars } from '../components/charts'
import { Badge, Button, Card, CardHeader, Delta, MoreLink, PageHeader, Segmented, SelectBox } from '../components/ui'
import { BUILDINGS, CLASSROOMS, DASHBOARD_KPIS, HOURLY, INEFFICIENT, CAMPUS_CARBON, SEASONAL, getBuilding } from '../data/mock'
import { CountUp } from '../motion'
import { bigNumber, theme } from '../theme'

const c = theme.color

const TABS = ['건물별', '시간대별', '계절별'] as const

const STATUS_LABEL = { danger: '비효율', warn: '주의', good: '양호' } as const

/** 순위 번호 (01, 02 …) */
const rankNo = (n: number) => String(n).padStart(2, '0')

export default function DashboardPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('건물별')
  const { admin } = useAuth()
  const [lead, ...rest] = DASHBOARD_KPIS

  return (
    <>
      <PageHeader title="안녕하세요, 한밭대학교!" subtitle="지속 가능한 캠퍼스를 위한 오늘의 전력 현황입니다." />

      {/* 현황판: 왼쪽 지표 열 + 오른쪽 구역별 예측 지도 */}
      <Card css={s.board}>
        <dl css={s.figures}>
          <div css={s.leadFigure}>
            <dt>{lead.label}</dt>
            <dd css={[bigNumber, s.leadValue]}>
              {lead.value}
              <span css={s.unit}>{lead.unit}</span>
            </dd>
            <dd css={s.foot}>
              <Delta value={lead.delta} compare={lead.compare} />
            </dd>
          </div>
          {rest.map((k) => (
            <div key={k.key}>
              <dt>{k.label}</dt>
              <dd css={[bigNumber, s.value]}>
                {k.value}
                <span css={s.unit}>{k.unit}</span>
              </dd>
              <dd css={s.foot}>
                <Delta value={k.delta} compare={k.compare} />
              </dd>
            </div>
          ))}
        </dl>

        <div css={s.mapCol}>
          <CardHeader title="구역별 실시간 전력 예측 소비량" info right={<SelectBox value="실시간" options={['실시간', '1시간 후', '3시간 후']} />} />
          <div css={s.map}>
            <CampusMap callouts={BUILDINGS} legend linkTo={(b) => `/forecast/${b.id}`} />
          </div>
          <MoreLink to="/forecast" />
        </div>
      </Card>

      <div css={s.row}>
        <Card>
          <CardHeader title="건물별 전력 소비량" info right={<SelectBox value="오늘" options={['오늘', '이번 주', '이번 달']} />} />
          <div css={s.tabs}>
            <Segmented options={TABS} value={tab} onChange={setTab} />
          </div>
          <div css={s.chart}>
            {tab === '건물별' && <SimpleBars data={BUILDINGS.slice(0, 6)} x="code" y="kw" unit="kWh" />}
            {tab === '시간대별' && <SimpleBars data={HOURLY.filter((_, i) => i % 4 === 0)} x="hour" y="kwh" unit="kWh" />}
            {tab === '계절별' && (
              <GroupedBars
                data={SEASONAL.map((d) => ({ ...d, season: d.season.split(' ')[0] }))}
                x="season"
                series={[
                  { key: 'cur', name: '2026년', color: CHART.dark },
                  { key: 'prev', name: '2025년', color: CHART.light },
                ]}
              />
            )}
          </div>
          <MoreLink to={tab === '건물별' ? '/power/building' : tab === '시간대별' ? '/power/hourly' : '/power/seasonal'} />
        </Card>

        {admin ? <InefficientCard /> : <CampusCarbonCard />}
      </div>

      <Card css={s.full}>
        <CardHeader title="전력 소비량 및 이동 동선 기반 강의실 추천" info right={<Button variant="outline">조건 설정</Button>} />
        <div css={s.scroll}>
          <table css={s.table}>
            <thead>
              <tr>
                <th>순위</th>
                <th>강의실</th>
                <th>도보</th>
                <th>전력 효율</th>
                <th data-num>예상 전력 사용량</th>
                <th data-num>
                  <span css={s.srOnly}>선택</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {CLASSROOMS.map((r, i) => (
                <tr key={r.id}>
                  <td css={s.rank}>{rankNo(i + 1)}</td>
                  <td css={s.name}>{r.room}</td>
                  <td>
                    <Badge tone="blue">도보 {r.walk}분</Badge>
                  </td>
                  <td>
                    <Badge tone="green">전력 효율 {r.efficiency}</Badge>
                  </td>
                  <td data-num css={s.name}>{r.expectKwh} kWh</td>
                  <td data-num>
                    <Link to="/classroom" css={s.pick}>
                      선택
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <MoreLink to="/classroom" />
      </Card>
    </>
  )
}

function InefficientCard() {
  const top = INEFFICIENT.slice(0, 3)
  return (
    <Card>
      <CardHeader title="비효율 및 낭비 구역" info />
      <div css={s.mapThumb}>
        <CampusMap css={s.mapZoom} pins={top.map((z) => ({ building: getBuilding(z.buildingId)!, tone: z.status }))} />
      </div>
      <table css={s.table}>
        <thead>
          <tr>
            <th>순위</th>
            <th>구역</th>
            <th data-num>평균 대비</th>
            <th data-num>상태</th>
          </tr>
        </thead>
        <tbody>
          {top.map((z) => (
            <tr key={z.rank}>
              <td css={s.rank}>{rankNo(z.rank)}</td>
              <td css={s.name}>{z.place}</td>
              <td data-num>{z.ratio}% 소비</td>
              <td data-num>
                <Badge tone={z.status}>{STATUS_LABEL[z.status]}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <MoreLink to="/inefficient" />
    </Card>
  )
}

/** 공개 대시보드: 비효율 구역(관리자용) 대신 캠퍼스 탄소 절감 요약 */
function CampusCarbonCard() {
  const cc = CAMPUS_CARBON
  return (
    <Card>
      <CardHeader title="캠퍼스 탄소 절감 현황" info />
      <div css={s.saved}>
        <p css={s.savedLabel}>이번 달 절감량</p>
        <p css={[bigNumber, s.leadValue]}>
          <CountUp value={cc.monthSavedT} />
          <span css={s.unit}>tCO₂</span>
        </p>
        <p css={s.foot}>나무 {cc.trees.toLocaleString()}그루 심은 효과</p>
      </div>
      <table css={s.table}>
        <thead>
          <tr>
            <th>순위</th>
            <th>건물</th>
            <th data-num>이번 달 절감</th>
            <th data-num>전년 대비</th>
          </tr>
        </thead>
        <tbody>
          {cc.buildingRank.slice(0, 3).map((b, i) => (
            <tr key={b.code}>
              <td css={s.rank}>{rankNo(i + 1)}</td>
              <td css={s.name}>
                {b.code} {b.name}
              </td>
              <td data-num>{b.saved} kgCO₂ 절감</td>
              <td data-num>
                <span css={s.deltaCell}>
                  <Delta value={b.yoy} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <MoreLink to="/carbon" />
    </Card>
  )
}

const s = {
  // 현황판: 좁은 화면에선 지표 → 지도 순으로 쌓인다
  board: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    [theme.mq.xl]: { gridTemplateColumns: '300px minmax(0, 1fr)' },
  }),
  figures: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    padding: '4px 20px',
    borderBottom: `1px solid ${c.lineSoft}`,
    '& dt': { fontSize: 12, color: c.sub },
    '& > div': { padding: '14px 0', borderTop: `1px solid ${c.lineSoft}` },
    '& > div:first-of-type': { borderTop: 0 },
    [theme.mq.md]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', '& > div': { borderTop: 0 } },
    [theme.mq.xl]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      alignContent: 'start',
      padding: '8px 24px',
      borderBottom: 0,
      borderRight: `1px solid ${c.lineSoft}`,
      '& > div': { borderTop: `1px solid ${c.lineSoft}` },
    },
  }),
  leadFigure: css({ gridColumn: '1 / -1', [theme.mq.md]: { gridColumn: 'auto' } }),
  leadValue: css({ marginTop: 6, fontSize: 40 }),
  value: css({ marginTop: 4, fontSize: 22 }),
  unit: css({ marginLeft: 4, fontSize: 13, fontWeight: 400, letterSpacing: 0, color: c.mute }),
  foot: css({ marginTop: 6, fontSize: 12, color: c.sub, '& > span': { fontSize: 13 } }),

  mapCol: css({ display: 'flex', minWidth: 0, flexDirection: 'column' }),
  map: css({ display: 'flex', flex: 1, alignItems: 'center', padding: '0 20px 12px' }),

  row: css({ marginTop: 20, display: 'grid', gap: 20, gridTemplateColumns: 'minmax(0, 1fr)', [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)' } }),
  full: css({ marginTop: 20 }),
  tabs: css({ padding: '0 20px' }),
  chart: css({ padding: '12px 16px 8px' }),

  // 지도는 카드 안 그림으로 둔다 (테두리·배경 상자 없음)
  mapThumb: css({ overflow: 'hidden', margin: '0 20px', borderRadius: theme.radius.md }),
  mapZoom: css({ transform: 'scale(1.6)', transformOrigin: '45% 40%' }),

  saved: css({ padding: '0 20px 8px' }),
  savedLabel: css({ fontSize: 12, color: c.sub }),

  scroll: css({ overflowX: 'auto' }),
  table: css({
    marginBottom: 12,
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 20px', textAlign: 'left', fontWeight: 500, fontSize: 12, color: c.mute, whiteSpace: 'nowrap', borderBottom: `1px solid ${c.line}` },
    '& td': { padding: '10px 20px', borderBottom: `1px solid ${c.lineSoft}`, whiteSpace: 'nowrap' },
    '& tr:last-of-type td': { borderBottom: 0 },
    '& [data-num]': { textAlign: 'right' },
  }),
  rank: css({ width: 48, color: c.mute }),
  name: css({ fontWeight: 600 }),
  deltaCell: css({ display: 'inline-flex', '& > span': { fontSize: 13 } }),
  srOnly: css({ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }),

  // 행마다 있는 선택은 보조 동작: 라임 대신 회색 버튼 모양 링크
  pick: css({
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: theme.control,
    padding: '0 14px',
    borderRadius: theme.radius.sm,
    background: c.lineSoft,
    fontSize: 13,
    fontWeight: 600,
    color: c.ink,
    transition: `background 0.2s ${theme.ease}`,
    '&:hover': { background: c.line },
  }),
}
