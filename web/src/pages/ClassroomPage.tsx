/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 조건 줄 아래 순위 표, 고른 행은 라임 띠로 표시 · states: full (목업) */
/* critique: 테두리 박스 목록을 순위 표로 바꾸고 조건 입력을 같은 카드 머리에 붙인다. 라임 버튼은 최종 선택하기 하나만 */
/* Hallmark · dropped Badge (도보·전력 효율) · 색 점이 장식이라 표 열로 옮김, 글자는 그대로 */
import { css } from '@emotion/react'
import { useState } from 'react'
import { BuildingThumb } from '../components/CampusMap'
import { Icon } from '../components/Icon'
import { Button, Card, CardHeader, MoreLink, PageHeader, SelectBox, StatRows } from '../components/ui'
import { CLASSROOMS, getBuilding } from '../data/mock'
import { theme } from '../theme'

const c = theme.color

const s = {
  grid: css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, [theme.mq.xl]: { gridTemplateColumns: 'minmax(0, 1fr) 380px' } }),
  filter: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: 16,
    padding: '20px 20px 18px',
    borderBottom: `1px solid ${c.lineSoft}`,
  }),
  field: css({ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: c.sub }),
  table: css({
    marginBottom: 12,
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    '& th': { padding: '8px 12px', textAlign: 'left', fontWeight: 500, fontSize: 12, color: c.sub, whiteSpace: 'nowrap', borderBottom: `1px solid ${c.line}` },
    '& td': { padding: '12px', borderBottom: `1px solid ${c.lineSoft}`, whiteSpace: 'nowrap' },
    '& th:first-of-type, & td:first-of-type': { paddingLeft: 20 },
    '& th:last-of-type, & td:last-of-type': { paddingRight: 20, textAlign: 'right' },
    '& tr:last-of-type td': { borderBottom: 0 },
    '& [data-num]': { textAlign: 'right' },
    // 좁은 화면: 행마다 강의실·버튼을 위에, 나머지는 라벨 붙은 줄로 접는다
    '@media (max-width: 767px)': {
      '& thead': { display: 'none' },
      '& tr': { display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) auto', alignItems: 'center', columnGap: 12, padding: '12px 20px', borderBottom: `1px solid ${c.lineSoft}` },
      '& td, & th:first-of-type, & td:first-of-type, & td:last-of-type': { padding: 0, border: 0 },
      '& td[data-label]': { gridColumn: '2 / -1', display: 'flex', justifyContent: 'space-between', paddingTop: 4, color: c.sub },
      '& td[data-label]::before': { content: 'attr(data-label)' },
      '& td:last-of-type': { gridColumn: 3, gridRow: 1 },
    },
  }),
  row: css({ transition: 'background-color 0.2s', '&:hover': { background: c.bg } }),
  rowActive: css({ background: c.lineSoft, '&:hover': { background: c.lineSoft }, '& td:first-of-type': { boxShadow: `inset 3px 0 0 ${c.lime}` } }),
  rank: css({ fontSize: 16, fontWeight: 700, color: c.mute }),
  rankActive: css({ color: c.ink }),
  room: css({ fontSize: 14, fontWeight: 600 }),
  detailRoom: css({ padding: '0 20px 12px', fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' }),
  thumb: css({ margin: '0 20px', height: 192 }),
  thumbCaption: css({ padding: '6px 20px 4px', fontSize: 12, color: c.sub }),
  action: css({ marginTop: 'auto', padding: '4px 20px 20px' }),
}

export default function ClassroomPage() {
  const [selectedId, setSelectedId] = useState(CLASSROOMS[0].id)
  const selected = CLASSROOMS.find((c) => c.id === selectedId)!
  const building = getBuilding(selected.buildingId)!

  return (
    <>
      <PageHeader title="강의실 추천" subtitle="전력 소비량과 이동 동선을 고려한 최적의 강의실을 추천합니다." />

      <div css={s.grid}>
        <Card>
          <div css={s.filter}>
            <label css={s.field}>
              강의 일시
              <SelectBox value="2026.04.29 (수) 10:00 - 12:00" icon={<Icon name="calendar_month" size={16} />} css={{ minWidth: 300 }} />
            </label>
            <label css={s.field}>
              예상 인원
              <SelectBox value="60 명" options={['30 명', '60 명', '90 명', '120 명']} />
            </label>
            {/* 추천 요청 로직은 아직 없다 (목업) */}
            <Button variant="outline">추천 받기</Button>
          </div>

          <CardHeader title="추천 결과" />
          <table css={s.table}>
            <thead>
              <tr>
                <th>순위</th>
                <th>강의실</th>
                <th data-num>도보</th>
                <th>전력 효율</th>
                <th data-num>예상 전력 사용량</th>
                <th>
                  <span css={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>선택</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {CLASSROOMS.map((c, i) => {
                const active = c.id === selectedId
                return (
                  <tr key={c.id} css={[s.row, active && s.rowActive]}>
                    <td css={[s.rank, active && s.rankActive]}>{i + 1}</td>
                    <td css={s.room}>{c.room}</td>
                    <td data-num data-label="도보">{c.walk}분</td>
                    <td data-label="전력 효율">{c.efficiency}</td>
                    <td data-num data-label="예상 전력 사용량">{c.expectKwh} kWh</td>
                    <td>
                      <Button variant="outline" onClick={() => setSelectedId(c.id)}>
                        {active ? '선택됨' : '선택'}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <MoreLink />
        </Card>

        <Card>
          <CardHeader title="선택한 강의실 정보" />
          <p css={s.detailRoom}>{selected.room}</p>
          <BuildingThumb building={building} css={s.thumb} />
          <p css={s.thumbCaption}>
            {building.name} ({building.code}) 위치
          </p>
          <StatRows
            rows={[
              { label: '수용 인원', value: `${selected.capacity} 명` },
              { label: '층수', value: `${selected.floor}층` },
              { label: '시설', value: selected.facilities },
              { label: '예상 전력 사용량', value: `${selected.expectKwh} kWh` },
            ]}
          />
          <div css={s.action}>
            {/* 확정 로직은 아직 없다 (목업) */}
            <Button css={{ width: '100%' }}>선택하기</Button>
          </div>
        </Card>
      </div>
    </>
  )
}
