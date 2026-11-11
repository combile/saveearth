import { css } from '@emotion/react'
import { useRef, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Icon } from '../components/Icon'
import { CAMPUS_TOTAL_KW } from '../data/mock'
import { CountUp, EASE, gsap, reducedMotion, useGSAP } from '../motion'
import { theme } from '../theme'

const c = theme.color
const onDark = (a: number) => `rgba(255, 255, 255, ${a})`

// 사진: 한밭대학교 유성캠퍼스 (대외협력홍보팀, CC BY-SA 4.0, Wikimedia Commons)
const BG_SRC = '/images/hanbat-campus.jpg'

const s = {
  // 전체 화면 캠퍼스 사진 + 어두운 덮개. 그 위에 상단 바 / 가운데 폼 / 하단 바를 쌓는다
  root: css({
    position: 'relative',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    minHeight: '100vh',
    overflow: 'hidden',
    color: '#fff',
    background: c.night,
  }),
  bg: css({ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', objectPosition: 'center 70%' }),
  shade: css({ position: 'absolute', inset: 0, background: 'radial-gradient(45% 40% at 50% 52%, rgba(8, 12, 10, 0.45), transparent), linear-gradient(to bottom, rgba(8, 12, 10, 0.55), rgba(8, 12, 10, 0.72))' }),
  bar: css({ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '24px 20px', [theme.mq.md]: { padding: '28px 40px' } }),

  brand: css({ display: 'flex', alignItems: 'center', gap: 10, lineHeight: 1.25, color: c.lime }),
  brandName: css({ fontSize: 17, fontWeight: 700, color: '#fff' }),
  brandSub: css({ fontSize: 12, color: onDark(0.7) }),
  back: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: onDark(0.8),
    transition: `color 0.25s ${theme.ease}`,
    '& > span': { transition: `transform 0.25s ${theme.ease}` },
    '&:hover': { color: '#fff' },
    '&:hover > span': { transform: 'translateX(-3px)' },
  }),

  center: css({ position: 'relative', display: 'grid', placeItems: 'center', padding: '24px 20px' }),
  inner: css({ width: '100%', maxWidth: 340, textAlign: 'center' }),
  title: css({ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }),
  desc: css({ marginTop: 6, fontSize: 13, color: onDark(0.75) }),
  form: css({ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }),
  // 반투명 흰 입력 필드
  input: css({
    width: '100%',
    borderRadius: theme.radius.sm,
    border: '1px solid transparent',
    background: onDark(0.9),
    padding: '13px 16px',
    textAlign: 'center',
    fontSize: 14,
    color: c.ink,
    outline: 'none',
    transition: `background 0.25s ${theme.ease}, box-shadow 0.25s ${theme.ease}`,
    '&::placeholder': { color: c.sub },
    '&:hover': { background: '#fff' },
    '&:focus': { background: '#fff', boxShadow: `0 0 0 3px ${onDark(0.35)}` },
  }),
  // 테두리만 있는 버튼, hover 시 라임으로 채워진다
  submit: css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    marginTop: 12,
    minWidth: 200,
    padding: '12px 28px',
    borderRadius: theme.radius.md,
    border: `1.5px solid ${onDark(0.9)}`,
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    transition: `background 0.3s ${theme.ease}, border-color 0.3s ${theme.ease}, color 0.3s ${theme.ease}`,
    '& > span': { transition: `transform 0.25s ${theme.ease}` },
    '&:hover': { background: c.lime, borderColor: c.lime, color: c.night },
    '&:hover > span': { transform: 'translateX(4px)' },
    '&:focus-visible': { outlineColor: '#fff' },
  }),
  demo: css({ marginTop: 18, fontSize: 12, color: onDark(0.65), '& > b': { color: onDark(0.9) } }),

  live: css({ fontSize: 13, color: onDark(0.75), '& > b': { marginLeft: 6, fontSize: 15, fontVariantNumeric: 'tabular-nums', color: c.lime } }),
  credit: css({ fontSize: 11, color: onDark(0.55), '& a': { textDecoration: 'underline' } }),
}

/** 관리자 로그인 (사이트 자체는 로그인 없이 공개) */
export default function LoginPage() {
  const { admin, login } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin/data'
  const root = useRef<HTMLDivElement>(null)

  // 배경이 천천히 당겨지며 자리 잡고, 위에서부터 요소가 순차 등장
  useGSAP(
    () => {
      if (!root.current || reducedMotion()) return
      gsap
        .timeline({ defaults: { ease: EASE } })
        .from('[data-bg]', { scale: 1.08, duration: 1.8 })
        .from('[data-fade]', { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.07, clearProps: 'transform' }, 0.15)
    },
    { scope: root },
  )

  if (admin) return <Navigate to={from} replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: 백엔드 인증 연동. 지금은 입력값과 상관없이 로그인
    login()
    navigate(from, { replace: true })
  }

  return (
    <div ref={root} css={s.root}>
      <img src={BG_SRC} alt="" css={s.bg} data-bg />
      <div css={s.shade} />

      <header css={s.bar}>
        <div css={s.brand} data-fade>
          <Icon name="potted_plant" size={36} />
          <div>
            <p css={s.brandName}>한밭대학교</p>
            <p css={s.brandSub}>탄소중립 캠퍼스</p>
          </div>
        </div>
        <Link to="/" css={s.back} data-fade>
          <Icon name="arrow_back" size={16} /> 대시보드로 돌아가기
        </Link>
      </header>

      <main css={s.center}>
        <div css={s.inner}>
          <h1 css={s.title} data-fade>
            관리자 로그인
          </h1>
          <p css={s.desc} data-fade>
            시설관리팀 계정으로 로그인해 주세요.
          </p>

          <form onSubmit={onSubmit} css={s.form}>
            <input aria-label="아이디" placeholder="아이디" autoComplete="username" css={s.input} data-fade />
            <input aria-label="비밀번호" type="password" placeholder="비밀번호" autoComplete="current-password" css={s.input} data-fade />
            <button type="submit" css={s.submit} data-fade>
              로그인
              <Icon name="arrow_forward" size={18} />
            </button>
          </form>

          <p css={s.demo} data-fade>
            <b>데모 모드</b> · 아무 값이나 입력해도 로그인돼요.
          </p>
        </div>
      </main>

      <footer css={s.bar}>
        <p css={s.live} data-fade>
          지금 캠퍼스 전력 사용량
          <b>
            <CountUp value={CAMPUS_TOTAL_KW} /> kW
          </b>
        </p>
        <p css={s.credit} data-fade>
          사진: 한밭대학교 대외협력홍보팀 ·{' '}
          <a href="https://commons.wikimedia.org/wiki/File:한밭대학교_유성캠퍼스.jpg" target="_blank" rel="noreferrer">
            CC BY-SA 4.0
          </a>
        </p>
      </footer>
    </div>
  )
}
