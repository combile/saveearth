import { css } from '@emotion/react'
import { useState } from 'react'
import { BuildingThumb } from '../components/CampusMap'
import { Icon } from '../components/Icon'
import { Badge, Button, Card, CardHeader, MoreLink, PageHeader, SelectBox, StatRows } from '../components/ui'
import { CLASSROOMS, getBuilding } from '../data/mock'
import { bigNumber, eyebrow, theme } from '../theme'

const s = {
  filter: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: 24,
    padding: '16px 24px',
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.color.line}`,
    background: theme.color.surface,
  }),
  field: css({ display: 'flex', flexDirection: 'column', gap: 6 }),
  grid: css({ marginTop: 20, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 400px' } }),
  list: css({ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px 16px' }),
  item: css({
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    padding: '16px 20px',
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.color.line}`,
    transition: `border-color 0.25s, background-color 0.25s, transform 0.35s ${theme.ease}`,
    '&:hover': { borderColor: theme.color.lime, background: theme.color.lime },
  }),
  itemActive: css({ borderColor: theme.color.ink, background: theme.color.lineSoft, '&:hover': { borderColor: theme.color.ink, background: theme.color.lineSoft } }),
  rank: css(bigNumber, { fontSize: 28, width: 28, color: theme.color.mute }),
  rankActive: css({ color: theme.color.brand700 }),
  room: css({ fontSize: 18, fontWeight: 600 }),
  badges: css({ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8 }),
  expect: css({ marginTop: 6, fontSize: 14, color: theme.color.sub }),
  detail: css({ padding: '0 24px' }),
  detailRoom: css({ marginBottom: 12, fontSize: 18, fontWeight: 700 }),
  thumb: css({ height: 192, width: '100%' }),
  thumbCaption: css({ marginTop: 6, fontSize: 12, color: theme.color.mute }),
  action: css({ marginTop: 'auto', padding: '0 24px 24px' }),
}

export default function ClassroomPage() {
  const [selectedId, setSelectedId] = useState(CLASSROOMS[0].id)
  const selected = CLASSROOMS.find((c) => c.id === selectedId)!
  const building = getBuilding(selected.buildingId)!

  return (
    <>
      <PageHeader title="강의실 추천" subtitle="전력 소비량과 이동 동선을 고려한 최적의 강의실을 추천합니다." />

      <div css={s.filter} data-reveal>
        <div css={s.field}>
          <span css={eyebrow}>강의 일시</span>
          <SelectBox value="2026.04.29 (수) 10:00 - 12:00" icon={<Icon name="calendar_month" size={16} />} css={{ minWidth: 320 }} />
        </div>
        <div css={s.field}>
          <span css={eyebrow}>예상 인원</span>
          <SelectBox value="60 명" options={['30 명', '60 명', '90 명', '120 명']} />
        </div>
        <Button css={{ padding: '10px 24px' }}>추천 받기</Button>
      </div>

      <div css={s.grid}>
        <Card>
          <CardHeader title="추천 결과" />
          <ul css={s.list}>
            {CLASSROOMS.map((c, i) => {
              const active = c.id === selectedId
              return (
                <li key={c.id} css={[s.item, active && s.itemActive]}>
                  <span css={[s.rank, active && s.rankActive]}>{i + 1}</span>
                  <div css={{ flex: 1 }}>
                    <p css={s.room}>{c.room}</p>
                    <div css={s.badges}>
                      <Badge tone="blue">도보 {c.walk}분</Badge>
                      <Badge tone="green">전력 효율 {c.efficiency}</Badge>
                    </div>
                    <p css={s.expect}>예상 전력 사용량 {c.expectKwh} kWh</p>
                  </div>
                  <Button variant={active ? 'primary' : 'outline'} onClick={() => setSelectedId(c.id)}>
                    {active ? '선택됨' : '선택'}
                  </Button>
                </li>
              )
            })}
          </ul>
          <MoreLink />
        </Card>

        <Card>
          <CardHeader title="선택한 강의실 정보" />
          <div css={s.detail}>
            <p css={s.detailRoom}>{selected.room}</p>
            <BuildingThumb building={building} css={s.thumb} />
            <p css={s.thumbCaption}>
              {building.name} ({building.code}) 위치
            </p>
          </div>
          <StatRows
            rows={[
              { label: '수용 인원', value: `${selected.capacity} 명` },
              { label: '층수', value: `${selected.floor}층` },
              { label: '시설', value: selected.facilities },
              { label: '예상 전력 사용량', value: `${selected.expectKwh} kWh` },
            ]}
          />
          <div css={s.action}>
            <Button css={{ width: '100%', padding: '12px 16px' }}>선택하기</Button>
          </div>
        </Card>
      </div>
    </>
  )
}
