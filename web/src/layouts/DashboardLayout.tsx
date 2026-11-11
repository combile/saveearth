import { css } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import { Icon } from '../components/Icon'
import { CARBON_SAVING } from '../data/mock'
import { CountUp, useReveal } from '../motion'
import { bigNumber, eyebrow, theme } from '../theme'

const POWER_CHILDREN = [
  { to: '/power/building', label: '건물별' },
  { to: '/power/hourly', label: '시간대별' },
  { to: '/power/seasonal', label: '계절별' },
]

const NAV = [
  { to: '/live', label: '실시간 전력 모니터', icon: 'sensors' },
  { to: '/forecast', label: '실시간 전력 예측', icon: 'query_stats' },
  { to: '/classroom', label: '강의실 추천', icon: 'apartment' },
  { to: '/carbon', label: '탄소 절감 현황', icon: 'eco' },
]

const ADMIN_NAV = [
  { to: '/inefficient', label: '비효율 구역 분석', icon: 'gpp_maybe' },
  { to: '/report', label: '리포트', icon: 'description' },
  { to: '/admin/data', label: '데이터 관리', icon: 'database' },
  { to: '/settings', label: '설정', icon: 'settings' },
]

function NavItem({ to, label, icon, end }: { to: string; label: string; icon: string; end?: boolean }) {
  return (
    <NavLink to={to} end={end} css={s.item}>
      {({ isActive }) => (
        <>
          <Icon name={icon} fill={isActive} />
          {label}
        </>
      )}
    </NavLink>
  )
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const { admin } = useAuth()
  const inPower = pathname.startsWith('/power')
  const [powerOpen, setPowerOpen] = useState(true)
  const content = useReveal<HTMLDivElement>([pathname])
  const powerPanel = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  // 1024px 미만: 사이드바가 왼쪽에서 밀려 나오는 서랍이 된다
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div css={s.root}>
      <header css={s.topbar}>
        <Link to="/" css={s.topLogo} aria-label="대시보드로">
          <Icon name="potted_plant" size={28} css={{ color: theme.color.lime }} />
          탄소중립 캠퍼스
        </Link>
        <button type="button" css={s.menuBtn} onClick={() => setMenuOpen(true)} aria-label="메뉴 열기" aria-expanded={menuOpen} aria-controls="side-nav">
          <Icon name="menu" size={24} />
        </button>
      </header>
      {menuOpen && <div css={s.backdrop} onClick={() => setMenuOpen(false)} />}

      <aside id="side-nav" css={s.aside} data-open={menuOpen || undefined}>
        <button type="button" css={[s.menuBtn, s.closeBtn]} onClick={() => setMenuOpen(false)} aria-label="메뉴 닫기">
          <Icon name="close" size={22} />
        </button>
        <Link to="/" css={s.logo}>
          <Icon name="potted_plant" size={40} css={{ color: theme.color.lime }} />
          <div css={{ lineHeight: 1.25 }}>
            <p css={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>한밭대학교</p>
            <p css={{ fontSize: 14, color: theme.onDark(0.75) }}>탄소중립 캠퍼스</p>
          </div>
        </Link>

        <nav css={s.nav}>
          <NavItem to="/" end label="대시보드" icon="home" />

          <div css={[s.group, inPower && { background: theme.onDark(0.05) }]}>
            <button onClick={() => setPowerOpen((o) => !o)} aria-expanded={powerOpen} data-active={inPower && !powerOpen} css={[s.item, { width: '100%' }]}>
              <Icon name="bar_chart" fill={inPower} />
              <span css={{ flex: 1, textAlign: 'left' }}>전력 소비 시각화</span>
              <Icon name="expand_more" size={18} css={[s.chevron, !powerOpen && { transform: 'rotate(-90deg)' }]} />
            </button>
            <div ref={powerPanel} hidden={!powerOpen}>
              <div css={s.children}>
                {POWER_CHILDREN.map((c) => (
                  <NavLink key={c.to} to={c.to} css={s.child}>
                    {c.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {NAV.map((n) => (
            <NavItem key={n.to} {...n} />
          ))}

          {admin && (
            <>
              <p css={[eyebrow, s.section]}>관리자</p>
              {ADMIN_NAV.map((n) => (
                <NavItem key={n.to} {...n} />
              ))}
            </>
          )}
        </nav>

        <div css={s.saving}>
          <p css={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: theme.onDark(0.9) }}>
            <Icon name="eco" fill css={{ color: theme.color.lime }} />
            오늘의 탄소 절감 기여도
          </p>
          <p css={[bigNumber, { marginTop: 12, textAlign: 'center', fontSize: 34 }]}>
            <CountUp value={CARBON_SAVING.today} />
            <span css={{ marginLeft: 4, fontSize: 14, fontWeight: 400, letterSpacing: 0, color: theme.onDark(0.8) }}>kgCO₂</span>
          </p>
          <p css={{ marginTop: 12, fontSize: 14, color: theme.onDark(0.85) }}>
            나무{' '}
            <b css={{ fontSize: 16, color: theme.color.nightInk }}>
              <CountUp value={CARBON_SAVING.trees} />
            </b>{' '}
            그루 심은 효과
          </p>
          <div css={s.track}>
            <div ref={bar} css={s.bar} style={{ width: `${CARBON_SAVING.progress}%` }} />
          </div>
        </div>
      </aside>

      <main css={s.main}>
        <div ref={content} css={{ margin: '0 auto', maxWidth: 1600 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

const active = '&[aria-current="page"], &[data-active="true"]'

const s = {
  root: css({ display: 'flex', flexDirection: 'column', minHeight: '100vh', [theme.mq.lg]: { flexDirection: 'row' } }),

  // 모바일 상단 바 (lg 이상에서는 숨김)
  topbar: css({
    position: 'sticky',
    top: 0,
    zIndex: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    padding: '0 8px 0 16px',
    background: theme.color.night,
    color: theme.color.nightInk,
    '& :focus-visible': { outlineColor: theme.color.lime },
    [theme.mq.lg]: { display: 'none' },
  }),
  topLogo: css({ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700 }),
  menuBtn: css({
    display: 'grid',
    placeItems: 'center',
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    color: theme.color.nightInk,
    transition: `background 0.2s ${theme.ease}`,
    '&:hover': { background: theme.color.nightHover },
  }),
  closeBtn: css({ position: 'absolute', top: 12, right: 8, [theme.mq.lg]: { display: 'none' } }),
  backdrop: css({ position: 'fixed', inset: 0, zIndex: 45, background: theme.scrim(0.5), [theme.mq.lg]: { display: 'none' } }),

  aside: css({
    // 모바일: 화면 밖에 있다가 data-open 이면 밀려 들어오는 서랍
    position: 'fixed',
    inset: '0 auto 0 0',
    zIndex: 50,
    display: 'flex',
    height: '100dvh',
    width: 'min(280px, 85vw)',
    flexShrink: 0,
    flexDirection: 'column',
    background: theme.color.night,
    padding: '24px 12px',
    color: theme.color.nightInk,
    transform: 'translateX(-100%)',
    visibility: 'hidden',
    transition: `transform 0.25s ${theme.ease}, visibility 0s 0.25s`,
    '&[data-open]': { transform: 'none', visibility: 'visible', transition: `transform 0.25s ${theme.ease}` },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&[data-open]': { transition: 'none' } },
    [theme.mq.lg]: { position: 'sticky', top: 0, zIndex: 'auto', height: '100vh', width: 240, transform: 'none', visibility: 'visible', transition: 'none' },
    // 다크 면에서는 기본 초록 링이 안 보여 라임으로
    '& :focus-visible': { outlineColor: theme.color.lime },
  }),
  logo: css({ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px' }),
  nav: css({ display: 'flex', flex: 1, flexDirection: 'column', gap: 2, overflowY: 'auto' }),

  item: css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: theme.radius.sm,
    padding: '9px 12px',
    fontSize: 13,
    color: theme.onDark(0.6),
    transition: `background 0.3s ${theme.ease}, color 0.3s ${theme.ease}`,
    '& > .material-symbols-rounded': { transition: `font-variation-settings 0.25s ${theme.ease}, color 0.3s ${theme.ease}, transform 0.3s ${theme.ease}` },
    '&:hover': { background: theme.onDark(0.05), color: theme.color.nightInk },
    // 활성: 라임 알약 + 어두운 글자
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      width: 3,
      height: 18,
      marginTop: -9,
      borderRadius: theme.radius.pill,
      display: 'none',
      background: theme.color.lime,
      transform: 'scaleY(0)',
      transition: `transform 0.35s ${theme.ease}`,
    },
    [active]: { background: theme.color.lime, fontWeight: 600, color: theme.color.night, '&:hover': { background: theme.color.lime, color: theme.color.night } },
    [`&[aria-current="page"]::before, &[data-active="true"]::before`]: { transform: 'scaleY(1)' },
    [`&[aria-current="page"] > .material-symbols-rounded:first-of-type, &[data-active="true"] > .material-symbols-rounded:first-of-type`]: { color: theme.color.night },
  }),
  chevron: css({ transition: `transform 0.3s ${theme.ease}` }),
  group: css({ borderRadius: theme.radius.md, transition: `background 0.3s ${theme.ease}` }),
  children: css({ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px 8px' }),
  child: css({
    borderRadius: theme.radius.sm,
    padding: '8px 0 8px 38px',
    fontSize: 13,
    color: theme.onDark(0.55),
    transition: `background 0.3s ${theme.ease}, color 0.3s ${theme.ease}`,
    '&:hover': { color: theme.color.nightInk },
    '&[aria-current="page"]': { background: theme.color.lime, fontWeight: 600, color: theme.color.night },
  }),
  section: css({ margin: '20px 0 4px', padding: '0 12px', color: theme.onDark(0.35) }),

  saving: css({
    marginTop: 16,
    borderRadius: theme.radius.lg,
    background: theme.color.nightSoft,
    padding: 16,
    '@media (max-height: 860px)': { display: 'none' },
  }),
  track: css({ marginTop: 8, height: 3, overflow: 'hidden', borderRadius: theme.radius.pill, background: theme.onDark(0.12) }),
  bar: css({ height: '100%', borderRadius: theme.radius.pill, background: theme.color.lime }),

  main: css({ minWidth: 0, flex: 1, padding: '20px 16px 32px', [theme.mq.md]: { padding: '24px 28px' } }),
}
