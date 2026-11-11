import { css } from '@emotion/react'
import type { ReactNode } from 'react'
import { PageHeader, UnderlineTabs } from '../../components/ui'
import { bigNumber, eyebrow, theme } from '../../theme'

const TABS = [
  { label: '건물별', to: '/power/building' },
  { label: '시간대별', to: '/power/hourly' },
  { label: '계절별', to: '/power/seasonal' },
] as const

type Tab = (typeof TABS)[number]['label']

const { color, radius, mq } = theme

/** 전력 소비 화면(power/*, detail/*) 공용 스타일 */
export const ps = {
  /** 상단 필터 바 */
  filterBar: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 24px', padding: '14px 24px', border: `1px solid ${color.line}`, borderRadius: radius.lg, background: color.surface }),
  pushRight: css({ marginLeft: 'auto' }),
  /** 라벨이 위에 붙는 필터 묶음 (상세 화면) */
  fields: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 24, marginBottom: 20 }),
  field: css({ display: 'flex', flexDirection: 'column', gap: 6 }),
  /** 본문 + 사이드 2단 그리드. xl 미만에서는 1단 */
  split: (side: number, sideFirst = false) =>
    css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, marginTop: 20, [mq.xl]: { gridTemplateColumns: sideFirst ? `${side}px minmax(0, 1fr)` : `minmax(0, 1fr) ${side}px` } }),
  stack: css({ display: 'flex', flexDirection: 'column', gap: 20 }),
  gap: css({ marginTop: 20 }),
  grow: css({ flex: 1 }),
  chart: css({ padding: '0 16px 16px' }),
  /** 헤어라인으로 나뉜 목록 박스 */
  list: css({ margin: '0 20px', borderTop: `1px solid ${color.line}`, '& > * + *': { borderTop: `1px solid ${color.lineSoft}` } }),
  cardFoot: css({ marginTop: 'auto', padding: 20 }),
  full: css({ width: '100%' }),
  label: css(eyebrow, { color: color.sub }),
  caption: css({ fontSize: 12, color: color.sub }),
  num: css(bigNumber, { fontSize: 28 }),
  unit: css({ marginLeft: 4, fontSize: 14, fontWeight: 400, letterSpacing: 0, color: color.sub }),
  /** 카드 안의 보더 타일 (예측값, 시간대 요약) */
  tile: css({ padding: '16px 0', borderTop: `1px solid ${color.line}` }),
  /** 아이콘 + 문구 한 줄 인사이트 카드 */
  insight: css({ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 20, padding: '16px 20px' }),
  insightIcon: css({ flexShrink: 0, marginTop: 1, color: color.good, '& .material-symbols-rounded': { fontSize: '18px !important' } }),
  insightTitle: css({ fontSize: 13, fontWeight: 600 }),
  insightText: css({ marginTop: 2, fontSize: 12, color: color.sub }),
  /** 건물 정보 카드 (썸네일 + 항목 목록) */
  info: css({ padding: 20 }),
  thumb: css({ width: '100%', height: 176 }),
  infoList: css({ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20, fontSize: 14, '& dd': { marginTop: 4, fontWeight: 600 } }),
}

/** 전력 소비 시각화 3개 화면 공통 헤더 + 탭 */
export default function PowerTabs({ active, children }: { active: Tab; children: ReactNode }) {
  return (
    <>
      <PageHeader title={`전력 소비 시각화 - ${active}`} subtitle={`${active} 전력 소비량을 확인하고 비교할 수 있습니다.`} />
      <div css={{ marginBottom: 20 }}>
        <UnderlineTabs items={TABS.map((t) => ({ label: t.label, to: t.to, active: t.label === active }))} />
      </div>
      {children}
    </>
  )
}
