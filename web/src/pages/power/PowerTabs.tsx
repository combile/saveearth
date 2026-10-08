import type { ReactNode } from 'react'
import { PageHeader, UnderlineTabs } from '../../components/ui'

const TABS = [
  { label: '건물별', to: '/power/building' },
  { label: '시간대별', to: '/power/hourly' },
  { label: '계절별', to: '/power/seasonal' },
] as const

type Tab = (typeof TABS)[number]['label']

/** 전력 소비 시각화 3개 화면 공통 헤더 + 탭 */
export default function PowerTabs({ active, children }: { active: Tab; children: ReactNode }) {
  return (
    <>
      <PageHeader title={`전력 소비 시각화 - ${active}`} subtitle={`${active} 전력 소비량을 확인하고 비교할 수 있습니다.`} />
      <div className="mb-5">
        <UnderlineTabs items={TABS.map((t) => ({ label: t.label, to: t.to, active: t.label === active }))} />
      </div>
      {children}
    </>
  )
}
