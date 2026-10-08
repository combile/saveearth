import { useState } from 'react'
import { Button, Card, CardHeader, PageHeader, UnderlineTabs } from '../components/ui'
import { useAuth } from '../auth'

const TABS = ['계정 설정', '알림 설정', '데이터 설정', '시스템 설정']

export default function SettingsPage() {
  const USER = useAuth().admin!
  const [tab, setTab] = useState(TABS[0])

  return (
    <>
      <PageHeader title="설정" subtitle="시스템 설정과 사용자 환경을 관리할 수 있습니다." />
      <UnderlineTabs items={TABS.map((t) => ({ label: t, active: t === tab, onClick: () => setTab(t) }))} />

      {tab === '계정 설정' ? (
        <div className="mt-5 flex max-w-3xl flex-col gap-5">
          <Card>
            <CardHeader title="기본 정보" right={<Button variant="outline">수정</Button>} />
            <dl className="grid grid-cols-[120px_1fr] gap-y-4 px-6 pb-6 text-sm">
              <dt className="text-gray-500">아이디</dt>
              <dd>{USER.id}</dd>
              <dt className="text-gray-500">이름</dt>
              <dd>{USER.name}</dd>
              <dt className="text-gray-500">소속</dt>
              <dd>{USER.dept}</dd>
              <dt className="text-gray-500">이메일</dt>
              <dd>{USER.email}</dd>
              <dt className="text-gray-500">전화번호</dt>
              <dd>{USER.phone}</dd>
            </dl>
          </Card>

          <Card>
            <CardHeader title="비밀번호 변경" />
            <form className="flex flex-col gap-3 px-6 pb-6" onSubmit={(e) => e.preventDefault()}>
              {['현재 비밀번호', '새 비밀번호', '새 비밀번호 확인'].map((l) => (
                <label key={l} className="grid grid-cols-[120px_1fr] items-center text-sm">
                  <span className="text-gray-500">{l}</span>
                  <input type="password" className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-brand-600" />
                </label>
              ))}
              <Button variant="outline" className="mt-2 self-center px-8">
                변경하기
              </Button>
            </form>
          </Card>
        </div>
      ) : (
        <Card className="mt-5 max-w-3xl p-10 text-center text-sm text-gray-400">{tab} 화면은 피그마에 아직 없어요.</Card>
      )}
    </>
  )
}
