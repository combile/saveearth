import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import { Icon } from '../components/Icon'
import { CARBON_SAVING } from '../data/mock'
import { CountUp, EASE, gsap, reducedMotion, useGSAP, useReveal } from '../motion'
import { bigNumber, eyebrow, theme } from '../theme'

const POWER_CHILDREN = [
  { to: '/power/building', label: '건물별' },
  { to: '/power/hourly', label: '시간대별' },
  { to: '/power/seasonal', label: '계절별' },
]

const NAV = [
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

  // 아코디언: 접혀도 DOM 에 남기고 height/opacity 만 애니메이션 (접힌 동안은 inert)
  useGSAP(
    () => {
      gsap.to(powerPanel.current, { height: powerOpen ? 'auto' : 0, autoAlpha: powerOpen ? 1 : 0, duration: reducedMotion() ? 0 : 0.4, ease: EASE })
    },
    { dependencies: [powerOpen] },
  )

  useGSAP(() => {
    if (reducedMotion()) return
    gsap.from(bar.current, { width: 0, duration: 1.2, ease: EASE, delay: 0.3 })
  })

  return (
    <div css={s.root}>
      <aside css={s.aside}>
        <Link to="/" css={s.logo}>
          <Icon name="potted_plant" size={40} css={{ color: theme.color.lime }} />
          <div css={{ lineHeight: 1.25 }}>
            <p css={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>한밭대학교</p>
            <p css={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>탄소중립 캠퍼스</p>
          </div>
        </Link>

        <nav css={s.nav}>
          <NavItem to="/" end label="대시보드" icon="home" />

          <div css={[s.group, inPower && { background: 'rgba(255,255,255,0.05)' }]}>
            <button onClick={() => setPowerOpen((o) => !o)} aria-expanded={powerOpen} data-active={inPower && !powerOpen} css={[s.item, { width: '100%' }]}>
              <Icon name="bar_chart" fill={inPower} />
              <span css={{ flex: 1, textAlign: 'left' }}>전력 소비 시각화</span>
              <Icon name="expand_more" size={18} css={[s.chevron, !powerOpen && { transform: 'rotate(-90deg)' }]} />
            </button>
            <div ref={powerPanel} inert={!powerOpen} css={{ overflow: 'hidden' }}>
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
          <p css={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
            <Icon name="eco" fill css={{ color: theme.color.lime }} />
            오늘의 탄소 절감 기여도
          </p>
          <p css={[bigNumber, { marginTop: 12, textAlign: 'center', fontSize: 34 }]}>
            <CountUp value={CARBON_SAVING.today} />
            <span css={{ marginLeft: 4, fontSize: 14, fontWeight: 400, letterSpacing: 0, color: 'rgba(255,255,255,0.8)' }}>kgCO₂</span>
          </p>
          <p css={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
            나무{' '}
            <b css={{ fontSize: 16, color: '#fff' }}>
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
  root: css({ display: 'flex', minHeight: '100vh' }),
  aside: css({
    position: 'sticky',
    top: 0,
    display: 'flex',
    height: '100vh',
    width: 240,
    flexShrink: 0,
    flexDirection: 'column',
    background: theme.color.night,
    padding: '24px 12px',
    color: '#fff',
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
    color: 'rgba(255,255,255,0.6)',
    transition: `background 0.3s ${theme.ease}, color 0.3s ${theme.ease}`,
    '& > .material-symbols-rounded': { transition: `font-variation-settings 0.25s ${theme.ease}, color 0.3s ${theme.ease}, transform 0.3s ${theme.ease}` },
    '&:hover': { background: 'rgba(255,255,255,0.05)', color: '#fff' },
    '&:hover > .material-symbols-rounded:first-of-type': { transform: 'translateX(2px)' },
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
    color: 'rgba(255,255,255,0.55)',
    transition: `background 0.3s ${theme.ease}, color 0.3s ${theme.ease}, padding 0.3s ${theme.ease}`,
    '&:hover': { color: '#fff', paddingLeft: 42 },
    '&[aria-current="page"]': { background: theme.color.lime, fontWeight: 600, color: theme.color.night },
  }),
  section: css({ margin: '20px 0 4px', padding: '0 12px', color: 'rgba(255,255,255,0.35)' }),

  saving: css({
    marginTop: 16,
    borderRadius: theme.radius.lg,
    background: theme.color.nightSoft,
    padding: 16,
    '@media (max-height: 860px)': { display: 'none' },
  }),
  track: css({ marginTop: 8, height: 3, overflow: 'hidden', borderRadius: theme.radius.pill, background: 'rgba(255,255,255,0.12)' }),
  bar: css({ height: '100%', borderRadius: theme.radius.pill, background: theme.color.lime }),

  main: css({ minWidth: 0, flex: 1, padding: '24px 28px' }),
}
