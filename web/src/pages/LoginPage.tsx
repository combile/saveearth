import { css } from '@emotion/react'
import { useRef, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Icon } from '../components/Icon'
import { CAMPUS_TOTAL_KW } from '../data/mock'
import { CountUp, EASE, gsap, reducedMotion, useGSAP } from '../motion'
import { bigNumber, eyebrow, theme } from '../theme'

const c = theme.color
const onDark = (a: number) => `rgba(255, 255, 255, ${a})`

const s = {
  root: css({
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    minHeight: '100vh',
    [theme.mq.lg]: { gridTemplateRows: 'none', gridTemplateColumns: '1.1fr 1fr' },
  }),

  // 좌: 딥그린 에디토리얼 패널
  panel: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 40,
    padding: '32px 24px',
    overflow: 'hidden',
    color: '#fff',
    background: `radial-gradient(120% 80% at 0% 100%, ${c.brand800}, ${c.brand900} 70%)`,
    [theme.mq.lg]: { padding: 56 },
  }),
  brand: css({ display: 'flex', alignItems: 'center', gap: 12, lineHeight: 1.25, color: c.lime }),
  brandName: css({ fontSize: 20, fontWeight: 700, color: '#fff' }),
  brandSub: css({ color: onDark(0.75) }),
  headline: css({
    fontSize: 'clamp(32px, 4.4vw, 64px)',
    fontWeight: 700,
    lineHeight: 1.14,
    letterSpacing: '-0.03em',
    wordBreak: 'keep-all',
  }),
  // 줄 단위 마스크: 안쪽 span 이 아래에서 올라온다
  line: css({ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', '& > span': { display: 'block' } }),
  lead: css({ marginTop: 20, maxWidth: 448, color: onDark(0.75), wordBreak: 'keep-all' }),
  map: css({ display: 'none', marginTop: 40, width: '100%', maxWidth: 576, [theme.mq.lg]: { display: 'block' } }),
  foot: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 20,
    borderTop: `1px solid ${onDark(0.16)}`,
  }),
  liveLabel: css(eyebrow, { color: onDark(0.6) }),
  live: css(bigNumber, { marginTop: 6, fontSize: 36 }),
  liveUnit: css({ fontSize: 16, fontWeight: 400, letterSpacing: 0, color: onDark(0.7) }),
  credit: css(eyebrow, { color: onDark(0.45) }),

  // 우: 로그인 폼
  side: css({ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', backgroundColor: c.bg }),
  inner: css({ width: '100%', maxWidth: 384 }),
  back: css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 40,
    fontSize: 14,
    color: c.sub,
    transition: `color 0.25s ${theme.ease}`,
    '& > span': { transition: `transform 0.25s ${theme.ease}` },
    '&:hover': { color: c.brand700 },
    '&:hover > span': { transform: 'translateX(-3px)' },
  }),
  badge: css({ display: 'grid', placeItems: 'center', width: 48, height: 48, borderRadius: theme.radius.md, backgroundColor: c.brand100, color: c.brand700 }),
  title: css({ marginTop: 16, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }),
  desc: css({ marginTop: 4, fontSize: 14, color: c.sub }),
  form: css({ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }),
  field: css({ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, '& > span': { fontWeight: 500 } }),
  input: css({
    border: `1px solid ${c.line}`,
    borderRadius: theme.radius.sm,
    padding: '12px 16px',
    backgroundColor: c.surface,
    outline: 'none',
    transition: `border-color 0.25s ${theme.ease}, box-shadow 0.25s ${theme.ease}`,
    '&::placeholder': { color: c.mute },
    '&:hover': { borderColor: c.mute },
    '&:focus': { borderColor: c.brand600, boxShadow: `0 0 0 3px ${c.brand100}` },
  }),
  submit: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    padding: '14px 0',
    borderRadius: theme.radius.sm,
    backgroundColor: c.brand900,
    fontWeight: 600,
    color: '#fff',
    transition: `background-color 0.25s ${theme.ease}`,
    '& > span': { transition: `transform 0.25s ${theme.ease}` },
    '&:hover': { backgroundColor: c.brand800 },
    '&:hover > span': { transform: 'translateX(4px)' },
    '&:active': { backgroundColor: c.brand700 },
  }),
  demo: css({
    marginTop: 32,
    padding: 16,
    border: `1px dashed ${c.line}`,
    borderRadius: theme.radius.md,
    fontSize: 12,
    color: c.sub,
    '& > b': { color: c.ink },
  }),
}

/** 관리자 로그인 (사이트 자체는 로그인 없이 공개) */
export default function LoginPage() {
  const { admin, login } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin/data'
  const root = useRef<HTMLDivElement>(null)

  // 헤드라인 줄 단위 등장 → 패널 보조 요소 → 폼 요소 순차 등장
  useGSAP(
    () => {
      if (!root.current || reducedMotion()) return
      gsap
        .timeline({ defaults: { ease: EASE } })
        .from('[data-line]', { yPercent: 110, duration: 1, stagger: 0.12 })
        .from('[data-fade]', { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.08 }, '-=0.7')
        .from('[data-form]', { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.07, clearProps: 'transform' }, '-=0.8')
    },
    { scope: root },
  )

  if (admin) return <Navigate to={from} replace />

  const enter = () => {
    login()
    navigate(from, { replace: true })
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // TODO: 백엔드 인증 연동. 지금은 입력값과 상관없이 로그인
    enter()
  }

  return (
    <div ref={root} css={s.root}>
      <section css={s.panel}>
        <div css={s.brand} data-fade>
          <Icon name="potted_plant" size={44} />
          <div>
            <p css={s.brandName}>한밭대학교</p>
            <p css={s.brandSub}>탄소중립 캠퍼스</p>
          </div>
        </div>

        <div>
          <h1 css={s.headline}>
            <span css={s.line}>
              <span data-line>캠퍼스 전력 데이터를</span>
            </span>{' '}
            <span css={s.line}>
              <span data-line>관리하고 운영합니다.</span>
            </span>
          </h1>
          <p css={s.lead} data-fade>
            센서 수집 현황, 비효율 구역, 리포트를 관리하는 시설관리팀 전용 페이지입니다.
          </p>
          <img src="/images/campus-map.webp" alt="" css={s.map} data-fade />
        </div>

        <div css={s.foot} data-fade>
          <div>
            <p css={s.liveLabel}>지금 캠퍼스 실시간 전력 사용량</p>
            <p css={s.live}>
              <CountUp value={CAMPUS_TOTAL_KW} /> <span css={s.liveUnit}>kW</span>
            </p>
          </div>
          <p css={s.credit}>다학제간캡스톤디자인 · 지구를 지켜라</p>
        </div>
      </section>

      <section css={s.side}>
        <div css={s.inner}>
          <Link to="/" css={s.back} data-form>
            <Icon name="arrow_back" size={16} /> 대시보드로 돌아가기
          </Link>
          <span css={s.badge} data-form>
            <Icon name="verified_user" size={24} />
          </span>
          <h2 css={s.title} data-form>
            관리자 로그인
          </h2>
          <p css={s.desc} data-form>
            시설관리팀 계정으로 로그인해 주세요.
          </p>

          <form onSubmit={onSubmit} css={s.form}>
            <label css={s.field} data-form>
              <span>아이디</span>
              <input placeholder="관리자 아이디" css={s.input} />
            </label>
            <label css={s.field} data-form>
              <span>비밀번호</span>
              <input type="password" placeholder="비밀번호" css={s.input} />
            </label>
            <button type="submit" css={s.submit} data-form>
              로그인
              <Icon name="arrow_forward" size={18} />
            </button>
          </form>

          <p css={s.demo} data-form>
            <b>데모 모드</b> · 인증 서버 연동 전이라 아무 값이나 입력해도 로그인돼요.
          </p>
        </div>
      </section>
    </div>
  )
}
