import { css } from '@emotion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth'
import CampusMap from '../components/CampusMap'
import { CHART, GroupedBars, SimpleBars } from '../components/charts'
import { Icon } from '../components/Icon'
import { Badge, Button, Card, CardHeader, Delta, KpiCard, MoreLink, PageHeader, Segmented, SelectBox } from '../components/ui'
import { BUILDINGS, CLASSROOMS, DASHBOARD_KPIS, HOURLY, INEFFICIENT, CAMPUS_CARBON, SEASONAL, getBuilding } from '../data/mock'
import { CountUp } from '../motion'
import { bigNumber, eyebrow, theme } from '../theme'

const c = theme.color

const KPI_ICONS = {
  now: { icon: <Icon name="bolt" />, tone: 'teal' },
  today: { icon: <Icon name="eco" />, tone: 'lime' },
  month: { icon: <Icon name="insights" />, tone: 'purple' },
  carbon: { icon: <Icon name="cloud" />, tone: 'green' },
} as const

const TABS = ['건물별', '시간대별', '계절별'] as const

const STATUS_LABEL = { danger: '비효율', warn: '주의', good: '양호' } as const
const RANK_COLOR = [c.danger, c.warn, c.olive]
const SAVE_RANK_COLOR = [c.brand900, c.brand700, c.brand300]

const s = {
  kpis: css({ display: 'grid', gap: 20, gridTemplateColumns: '1fr', [theme.mq.md]: { gridTemplateColumns: 'repeat(2, 1fr)' }, [theme.mq.xxl]: { gridTemplateColumns: 'repeat(4, 1fr)' } }),
  row: css({ marginTop: 20, display: 'grid', gap: 20, gridTemplateColumns: '1fr', [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)' } }),
  tabs: css({ padding: '0 24px' }),
  chart: css({ padding: '12px 16px 8px' }),
  map: css({ display: 'flex', flex: 1, alignItems: 'center', padding: '0 24px 12px' }),

  // 강의실 추천 행
  rooms: css({ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px 16px' }),
  room: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radius.md,
    border: `1px solid ${c.line}`,
    padding: '14px 20px',
    transition: `border-color 0.3s ${theme.ease}, background-color 0.3s ${theme.ease}`,
    '&:hover': { borderColor: c.lime, background: c.lime },
  }),
  roomName: css({ width: 112, fontWeight: 600 }),
  roomExpect: css({ marginLeft: 'auto', fontSize: 14, color: c.sub, '& b': { fontSize: 16, fontWeight: 600, color: c.ink, fontVariantNumeric: 'tabular-nums' } }),
  // ui Button 기본 패딩보다 우선하도록 && 로 올림
  roomBtn: css({ '&&': { padding: '6px 12px' } }),

  // 순위 목록 (비효율 구역 / 절감 건물 공용)
  split: css({ display: 'grid', flex: 1, gap: 16, padding: '0 24px 16px', gridTemplateColumns: '1fr' }),
  ranks: css({ '& > li + li': { borderTop: `1px solid ${c.lineSoft}` } }),
  rank: css({ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0' }),
  rankNo: css(eyebrow, { width: 24, flexShrink: 0, fontSize: 13, fontWeight: 700 }),
  rankBody: css({ minWidth: 0, flex: 1 }),
  rankTitle: css({ fontWeight: 600 }),
  rankSub: css({ fontSize: 12, color: c.sub }),

  mapThumb: css({ overflow: 'hidden', borderRadius: theme.radius.md, border: `1px solid ${c.line}`, background: c.bg }),
  mapZoom: css({ transform: 'scale(1.6)', transformOrigin: '45% 40%' }),

  saved: css({ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: theme.radius.md, background: c.lineSoft, padding: 20 }),
  savedIcon: css({ color: c.mute }),
  savedLabel: css(eyebrow, { marginTop: 10 }),
  savedValue: css(bigNumber, { marginTop: 4, fontSize: 32 }),
  savedUnit: css({ marginLeft: 4, fontSize: 14, fontWeight: 400, letterSpacing: 0, color: c.sub }),
  savedNote: css({ marginTop: 6, fontSize: 12, color: c.sub }),
}

/** 순위 번호 (01, 02 …) */
const rankNo = (n: number) => String(n).padStart(2, '0')

export default function DashboardPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('건물별')
  const { admin } = useAuth()

  return (
    <>
      <PageHeader title="안녕하세요, 한밭대학교!" subtitle="지속 가능한 캠퍼스를 위한 오늘의 전력 현황입니다." />

      <div css={s.kpis}>
        {DASHBOARD_KPIS.map((k) => (
          <KpiCard key={k.key} {...KPI_ICONS[k.key]} label={k.label} value={k.value} unit={k.unit} foot={<Delta value={k.delta} compare={k.compare} />} />
        ))}
      </div>

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

        <Card>
          <CardHeader title="구역별 실시간 전력 예측 소비량" info right={<SelectBox value="실시간" options={['실시간', '1시간 후', '3시간 후']} />} />
          <div css={s.map}>
            <CampusMap callouts={BUILDINGS} legend linkTo={(b) => `/forecast/${b.id}`} />
          </div>
          <MoreLink to="/forecast" />
        </Card>
      </div>

      <div css={s.row}>
        {admin ? <InefficientCard /> : <CampusCarbonCard />}

        <Card>
          <CardHeader title="전력 소비량 및 이동 동선 기반 강의실 추천" info right={<Button variant="outline">조건 설정</Button>} />
          <ul css={s.rooms}>
            {CLASSROOMS.map((r, i) => (
              <li key={r.id} css={s.room}>
                <span css={s.rankNo}>{rankNo(i + 1)}</span>
                <span css={s.roomName}>{r.room}</span>
                <Badge tone="blue">도보 {r.walk}분</Badge>
                <Badge tone="green">전력 효율 {r.efficiency}</Badge>
                <span css={s.roomExpect}>
                  예상 전력 사용량 <b>{r.expectKwh} kWh</b>
                </span>
                <Link to="/classroom">
                  <Button css={s.roomBtn}>선택</Button>
                </Link>
              </li>
            ))}
          </ul>
          <MoreLink to="/classroom" />
        </Card>
      </div>
    </>
  )
}

function InefficientCard() {
  return (
    <Card>
      <CardHeader title="비효율 및 낭비 구역" info />
      <div css={[s.split, { [theme.mq.sm]: { gridTemplateColumns: 'repeat(2, 1fr)' } }]}>
        <ul css={s.ranks}>
          {INEFFICIENT.slice(0, 3).map((z, i) => (
            <li key={z.rank} css={s.rank}>
              <span css={s.rankNo} style={{ color: RANK_COLOR[i] }}>
                {rankNo(z.rank)}
              </span>
              <div css={s.rankBody}>
                <p css={s.rankTitle}>{z.place}</p>
                <p css={s.rankSub}>평균 대비 {z.ratio}% 소비</p>
              </div>
              <Badge tone={z.status}>{STATUS_LABEL[z.status]}</Badge>
            </li>
          ))}
        </ul>
        <div css={s.mapThumb}>
          <CampusMap css={s.mapZoom} pins={INEFFICIENT.slice(0, 3).map((z) => ({ building: getBuilding(z.buildingId)!, tone: z.status }))} />
        </div>
      </div>
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
      <div css={[s.split, { [theme.mq.sm]: { gridTemplateColumns: '200px 1fr' } }]}>
        <div css={s.saved}>
          <Icon name="eco" size={18} css={s.savedIcon} />
          <p css={s.savedLabel}>이번 달 절감량</p>
          <p css={s.savedValue}>
            <CountUp value={cc.monthSavedT} />
            <span css={s.savedUnit}>tCO₂</span>
          </p>
          <p css={s.savedNote}>나무 {cc.trees.toLocaleString()}그루 심은 효과</p>
        </div>
        <ul css={s.ranks}>
          {cc.buildingRank.slice(0, 3).map((b, i) => (
            <li key={b.code} css={s.rank}>
              <span css={s.rankNo} style={{ color: SAVE_RANK_COLOR[i] }}>
                {rankNo(i + 1)}
              </span>
              <div css={s.rankBody}>
                <p css={s.rankTitle}>
                  {b.code} {b.name}
                </p>
                <p css={s.rankSub}>이번 달 {b.saved} kgCO₂ 절감</p>
              </div>
              <Delta value={b.yoy} />
            </li>
          ))}
        </ul>
      </div>
      <MoreLink to="/carbon" />
    </Card>
  )
}
