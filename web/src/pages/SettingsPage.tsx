/* Hallmark · v2.0.0 · redesign: full · shape: app screen · theme: brand (theme.ts night + lime, Pretendard) · signature: 계정 설정 폼, 라벨 열과 입력 열이 한 축에 맞는 정보·비밀번호 · states: full, 미구현 탭 안내 */
/* critique: 가운데 정렬 버튼과 테두리만 바뀌는 포커스가 폼을 흐렸다. 라벨 열 하나로 정보와 입력을 맞추고, 변경하기를 이 화면의 유일한 주 동작으로 둔다 */
import { css } from '@emotion/react'
import { useState } from 'react'
import { Button, Card, CardHeader, PageHeader, UnderlineTabs } from '../components/ui'
import { useAuth } from '../auth'
import { theme } from '../theme'

const TABS = ['계정 설정', '알림 설정', '데이터 설정', '시스템 설정']
const PASSWORDS = [
  { label: '현재 비밀번호', name: 'currentPassword', autoComplete: 'current-password' },
  { label: '새 비밀번호', name: 'newPassword', autoComplete: 'new-password' },
  { label: '새 비밀번호 확인', name: 'confirmPassword', autoComplete: 'new-password' },
]

const c = theme.color
// 라벨 열 너비. 정보 표와 입력 폼이 같은 축을 쓴다
const LABEL = '128px'

const s = {
  stack: css({ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }),
  info: css({
    display: 'grid',
    gridTemplateColumns: `${LABEL} minmax(0, 1fr)`,
    padding: '0 20px 8px',
    fontSize: 13,
    '& > dt, & > dd': { padding: '11px 0', borderTop: `1px solid ${c.lineSoft}` },
    '& > dt': { color: c.sub },
    '& > dd': { fontWeight: 500, overflowWrap: 'anywhere' },
  }),
  form: css({ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 20px 20px', borderTop: `1px solid ${c.lineSoft}` }),
  field: css({
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: 6,
    paddingTop: 8,
    fontSize: 13,
    '& > span': { color: c.sub },
    [theme.mq.sm]: { gridTemplateColumns: `${LABEL} minmax(0, 1fr)`, alignItems: 'center', gap: 0 },
  }),
  input: css({
    minHeight: theme.control,
    maxWidth: 360,
    width: '100%',
    border: `1px solid ${c.line}`,
    borderRadius: theme.radius.sm,
    padding: '0 12px',
    backgroundColor: c.surface,
    outline: 'none',
    transition: `border-color 0.2s ${theme.ease}`,
    '&:hover': { borderColor: c.mute },
    '&:focus-visible': { outline: `2px solid ${c.brand600}`, outlineOffset: -1 },
  }),
  actions: css({ paddingTop: 8, [theme.mq.sm]: { paddingLeft: LABEL } }),
  empty: css({ marginTop: 20, maxWidth: 720, padding: 40, textAlign: 'center', fontSize: 13, color: c.mute }),
}

export default function SettingsPage() {
  const USER = useAuth().admin!
  const [tab, setTab] = useState(TABS[0])

  return (
    <>
      <PageHeader title="설정" subtitle="시스템 설정과 사용자 환경을 관리할 수 있습니다." />
      <UnderlineTabs items={TABS.map((t) => ({ label: t, active: t === tab, onClick: () => setTab(t) }))} />

      {tab === '계정 설정' ? (
        <div css={s.stack}>
          <Card>
            <CardHeader title="기본 정보" right={<Button variant="outline">수정</Button>} />
            <dl css={s.info}>
              <dt>아이디</dt>
              <dd>{USER.id}</dd>
              <dt>이름</dt>
              <dd>{USER.name}</dd>
              <dt>소속</dt>
              <dd>{USER.dept}</dd>
              <dt>이메일</dt>
              <dd>{USER.email}</dd>
              <dt>전화번호</dt>
              <dd>{USER.phone}</dd>
            </dl>
          </Card>

          <Card>
            <CardHeader title="비밀번호 변경" />
            <form css={s.form} onSubmit={(e) => e.preventDefault()}>
              {PASSWORDS.map((p) => (
                <label key={p.label} css={s.field}>
                  <span>{p.label}</span>
                  <input type="password" name={p.name} autoComplete={p.autoComplete} css={s.input} />
                </label>
              ))}
              <div css={s.actions}>
                <Button>변경하기</Button>
              </div>
            </form>
          </Card>
        </div>
      ) : (
        <Card css={s.empty}>{tab} 화면은 피그마에 아직 없어요.</Card>
      )}
    </>
  )
}
