import { css } from '@emotion/react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Icon } from '../components/Icon'
import { CAMPUS_TOTAL_KW } from '../data/mock'
import { bigNumber, theme } from '../theme'

const c = theme.color
const onDark = theme.onDark

// 사진: 한밭대학교 유성캠퍼스 (대외협력홍보팀, CC BY-SA 4.0, Wikimedia Commons)
const BG_SRC = '/images/hanbat-campus.jpg'

// 모바일은 손가락 크기(44px), 데스크톱은 앱 컨트롤 높이(36px). 입력칸과 버튼이 같은 높이를 쓴다
const control = css({ height: 44, fontSize: 16, [theme.mq.md]: { height: theme.control, fontSize: 14 } })

const s = {
  // 왼쪽 밤색 패널(로그인) + 오른쪽 캠퍼스 사진. 모바일에선 사진 띠가 위, 패널이 아래
  root: css({
    display: 'grid',
    gridTemplateAreas: '"photo" "panel"',
    gridTemplateRows: 'minmax(220px, 34vh) 1fr',
    minHeight: '100vh',
    background: c.night,
    color: c.nightInk,
    [theme.mq.md]: { gridTemplateAreas: '"panel photo"', gridTemplateColumns: 'minmax(380px, 440px) 1fr', gridTemplateRows: '1fr' },
  }),

  photo: css({ gridArea: 'photo', position: 'relative', overflow: 'hidden' }),
  bg: css({ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', objectPosition: 'center 70%' }),
  // 사진 하단에만 덮개를 깔아 출처 글자를 읽히게 한다
  credit: css({
    position: 'absolute',
    insetInline: 0,
    bottom: 0,
    padding: '32px 20px 14px',
    textAlign: 'right',
    fontSize: 12,
    color: onDark(0.8),
    background: `linear-gradient(to bottom, transparent, ${theme.scrim(0.6)})`,
    '& a': { textDecoration: 'underline', textUnderlineOffset: 2 },
    '& a:hover': { color: c.nightInk },
    [theme.mq.md]: { padding: '40px 32px 20px' },
  }),

  panel: css({
    gridArea: 'panel',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    gap: 32,
    padding: '24px 20px',
    borderTop: `1px solid ${c.nightLine}`,
    [theme.mq.md]: { padding: '32px 40px', borderTop: 0, borderRight: `1px solid ${c.nightLine}` },
  }),

  top: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }),
  brand: css({ display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.25, color: c.lime }),
  brandName: css({ fontSize: 16, fontWeight: 700, color: c.nightInk }),
  brandSub: css({ fontSize: 12, color: c.nightSub }),
  back: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    fontSize: 13,
    color: onDark(0.75),
    transition: `color 0.2s ${theme.ease}`,
    '&:hover': { color: c.nightInk },
    '&:focus-visible': { outline: `2px solid ${c.nightInk}`, outlineOffset: 2, borderRadius: theme.radius.sm },
  }),

  main: css({ alignSelf: 'center', width: '100%', maxWidth: 340 }),
  title: css({ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 }),
  desc: css({ marginTop: 6, fontSize: 14, color: onDark(0.7) }),

  form: css({ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }),
  field: css({ display: 'flex', flexDirection: 'column', gap: 6 }),
  label: css({ fontSize: 13, fontWeight: 500, color: onDark(0.85) }),
  input: css({
    width: '100%',
    padding: '0 12px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${onDark(0.2)}`,
    background: onDark(0.06),
    color: c.nightInk,
    transition: `background 0.2s ${theme.ease}, border-color 0.2s ${theme.ease}`,
    '&:hover': { borderColor: onDark(0.35) },
    '&:focus': { outline: 'none' },
    '&:focus-visible': { outline: `2px solid ${c.nightInk}`, outlineOffset: -1, background: onDark(0.1) },
  }),
  // 화면의 유일한 주 버튼: 라임 채움 + 밤색 글자
  submit: css({
    marginTop: 8,
    width: '100%',
    borderRadius: theme.radius.sm,
    background: c.lime,
    color: c.night,
    fontWeight: 600,
    transition: `background 0.2s ${theme.ease}`,
    '&:hover': { background: c.limeHover },
    '&:focus-visible': { outline: `2px solid ${c.nightInk}`, outlineOffset: 2 },
  }),
  demo: css({
    marginTop: 20,
    paddingTop: 16,
    borderTop: `1px solid ${c.nightLine}`,
    fontSize: 13,
    color: c.nightSub,
    '& > b': { display: 'block', fontWeight: 600, color: onDark(0.9) },
  }),

  // 실시간 수치는 라임(라이브 상태)으로
  live: css({ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13, color: onDark(0.7) }),
  liveValue: css(bigNumber, { fontSize: 22, color: c.lime, '& > small': { marginLeft: 4, fontSize: 13, fontWeight: 500, color: onDark(0.7) } }),
}

/** 관리자 로그인 (사이트 자체는 로그인 없이 공개) */
export default function LoginPage() {
  const { admin, login } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin/data'

  if (admin) return <Navigate to={from} replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: 백엔드 인증 연동. 지금은 입력값과 상관없이 로그인
    login()
    navigate(from, { replace: true })
  }

  return (
    <div css={s.root}>
      <div css={s.photo}>
        <img src={BG_SRC} alt="한밭대학교 유성캠퍼스" width={2400} height={1350} css={s.bg} />
        <p css={s.credit}>
          사진: 한밭대학교 대외협력홍보팀 ·{' '}
          <a href="https://commons.wikimedia.org/wiki/File:한밭대학교_유성캠퍼스.jpg" target="_blank" rel="noreferrer">
            CC BY-SA 4.0
          </a>
        </p>
      </div>

      <div css={s.panel}>
        <header css={s.top}>
          <div css={s.brand}>
            <Icon name="potted_plant" size={32} />
            <div>
              <p css={s.brandName}>한밭대학교</p>
              <p css={s.brandSub}>탄소중립 캠퍼스</p>
            </div>
          </div>
          <Link to="/" css={s.back}>
            <Icon name="arrow_back" size={16} />
            대시보드로 돌아가기
          </Link>
        </header>

        <main css={s.main}>
          <h1 css={s.title}>관리자 로그인</h1>
          <p css={s.desc}>시설관리팀 계정으로 로그인해 주세요.</p>

          <form onSubmit={onSubmit} css={s.form}>
            <div css={s.field}>
              <label htmlFor="login-username" css={s.label}>
                아이디
              </label>
              <input id="login-username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} css={[control, s.input]} />
            </div>
            <div css={s.field}>
              <label htmlFor="login-password" css={s.label}>
                비밀번호
              </label>
              <input id="login-password" name="password" type="password" autoComplete="current-password" css={[control, s.input]} />
            </div>
            <button type="submit" css={[control, s.submit]}>
              로그인
            </button>
          </form>

          <p css={s.demo}>
            <b>데모 모드</b>
            아무 값이나 입력해도 로그인돼요.
          </p>
        </main>

        <footer css={s.live}>
          지금 캠퍼스 전력 사용량
          <b css={s.liveValue}>
            {CAMPUS_TOTAL_KW.toLocaleString('en-US')}
            <small>kW</small>
          </b>
        </footer>
      </div>
    </div>
  )
}
