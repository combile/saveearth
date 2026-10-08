import { css } from '@emotion/react'
import { useState } from 'react'
import { Button, Card, CardHeader, PageHeader, UnderlineTabs } from '../components/ui'
import { useAuth } from '../auth'
import { theme } from '../theme'

const TABS = ['계정 설정', '알림 설정', '데이터 설정', '시스템 설정']

const c = theme.color

const s = {
  stack: css({ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 768 }),
  info: css({
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    padding: '0 24px 12px',
    fontSize: 14,
    '& > dt, & > dd': { padding: '12px 0', borderTop: `1px solid ${c.lineSoft}` },
    '& > dt': { color: c.sub },
    '& > dd': { fontWeight: 500 },
  }),
  form: css({ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 24px 24px' }),
  field: css({ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', fontSize: 14, '& > span': { color: c.sub } }),
  input: css({
    border: `1px solid ${c.line}`,
    borderRadius: theme.radius.sm,
    padding: '8px 12px',
    backgroundColor: c.surface,
    outline: 'none',
    transition: `border-color 0.25s ${theme.ease}, box-shadow 0.25s ${theme.ease}`,
    '&:hover': { borderColor: c.mute },
    '&:focus': { borderColor: c.brand600, boxShadow: `0 0 0 3px ${c.brand100}` },
  }),
  submit: css({ marginTop: 8, alignSelf: 'center', paddingLeft: 32, paddingRight: 32 }),
  empty: css({ marginTop: 20, maxWidth: 768, padding: 40, textAlign: 'center', fontSize: 14, color: c.mute }),
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
              {['현재 비밀번호', '새 비밀번호', '새 비밀번호 확인'].map((l) => (
                <label key={l} css={s.field}>
                  <span>{l}</span>
                  <input type="password" css={s.input} />
                </label>
              ))}
              <Button variant="outline" css={s.submit}>
                변경하기
              </Button>
            </form>
          </Card>
        </div>
      ) : (
        <Card css={s.empty}>{tab} 화면은 피그마에 아직 없어요.</Card>
      )}
    </>
  )
}
