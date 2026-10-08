import { css } from '@emotion/react'
import { useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { CountUp, gsap, reducedMotion, useGSAP } from '../motion'
import { bigNumber, eyebrow, theme } from '../theme'
import { Icon } from './Icon'

const { color: c, radius: r, ease } = theme

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section data-reveal css={s.card} className={className}>
      {children}
    </section>
  )
}

export function CardHeader({ title, sub, info, right }: { title: string; sub?: string; info?: boolean; right?: ReactNode }) {
  return (
    <div css={s.cardHeader}>
      <h2 css={s.cardTitle}>{title}</h2>
      {sub && <span css={s.cardSub}>{sub}</span>}
      {info && <Icon name="info" size={16} css={{ color: c.mute }} />}
      <div css={s.cardRight}>{right}</div>
    </div>
  )
}

export function MoreLink({ to = '#', label = '더보기', down }: { to?: string; label?: string; down?: boolean }) {
  return (
    <Link to={to} css={s.more} data-down={down || undefined}>
      {label}
      <Icon name={down ? 'expand_more' : 'arrow_forward'} size={14} />
    </Link>
  )
}

export function Delta({ value, compare }: { value: number; compare?: string }) {
  const down = value < 0
  return (
    <span css={s.delta}>
      {compare && <span css={{ color: c.sub }}>{compare}</span>}
      <span css={[s.deltaValue, { color: down ? c.good : c.danger }]}>
        <Icon name={down ? 'arrow_drop_down' : 'arrow_drop_up'} size={18} />
        {Math.abs(value)}%
      </span>
    </span>
  )
}


/** 작은 아이콘+라벨 줄 아래에 값을 두는 요약 카드. tone 은 예전 색 원형 배경용이라 지금은 쓰지 않는다 */
export function KpiCard({ icon, label, value, unit, foot }: { icon: ReactNode; tone?: 'green' | 'lime' | 'purple' | 'teal'; label: string; value: string; unit: string; foot: ReactNode }) {
  return (
    <Card css={s.kpi}>
      <p css={s.kpiLabel}>
        {icon}
        {label}
      </p>
      <div css={{ minWidth: 0 }}>
        <p css={[bigNumber, s.kpiValue]}>
          <CountUp value={value} />
          <span css={s.kpiUnit}>{unit}</span>
        </p>
        <div css={s.kpiFoot}>{foot}</div>
      </div>
    </Card>
  )
}

/** 버튼형 세그먼트 탭 (건물별/시간대별/계절별, kWh/kW 등) */
export function Segmented<T extends string>({ options, value, onChange, size = 'md' }: { options: readonly T[]; value: T; onChange: (v: T) => void; size?: 'sm' | 'md' }) {
  return (
    <div css={s.segmented}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} aria-pressed={o === value} css={[s.segment, size === 'sm' ? s.segmentSm : s.segmentMd]}>
          {o}
        </button>
      ))}
    </div>
  )
}

/** 밑줄형 탭 */
export function UnderlineTabs({ items }: { items: { label: string; active: boolean; onClick?: () => void; to?: string }[] }) {
  return (
    <div css={s.tabs}>
      {items.map((t) =>
        t.to ? (
          <Link key={t.label} to={t.to} css={s.tab} data-active={t.active}>
            {t.label}
          </Link>
        ) : (
          <button key={t.label} onClick={t.onClick} css={s.tab} data-active={t.active}>
            {t.label}
          </button>
        ),
      )}
    </div>
  )
}

export function SelectBox({ label, value, options, onChange, icon, className }: { label?: string; value: string; options?: string[]; onChange?: (v: string) => void; icon?: ReactNode; className?: string }) {
  return (
    <label css={s.selectRoot} className={className}>
      {label && <span css={{ flexShrink: 0, color: c.sub }}>{label}</span>}
      <span css={s.selectWrap}>
        <select value={value} onChange={(e) => onChange?.(e.target.value)} css={s.select}>
          {(options ?? [value]).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span css={s.selectIcon}>{icon ?? <Icon name="expand_more" size={18} />}</span>
      </span>
    </label>
  )
}

const BADGE_TONES = { danger: c.danger, warn: c.warn, good: c.good, blue: '#5b63d3', green: c.brand700 }

/** 색 점 + 회색 알약. 색은 점에만 써서 표·목록 안에서 튀지 않게 한다 */
export function Badge({ tone, children }: { tone: keyof typeof BADGE_TONES; children: ReactNode }) {
  return (
    <span css={s.badge}>
      <i css={s.badgeDot} style={{ background: BADGE_TONES[tone] }} />
      {children}
    </span>
  )
}

export function Button({ variant = 'primary', className, children, onClick }: { variant?: 'primary' | 'outline'; className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} css={[s.button, variant === 'primary' ? s.buttonPrimary : s.buttonOutline]} className={className}>
      {children}
    </button>
  )
}

/** 페이지 상단: 제목 + 날씨/알림/프로필 */
export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: { to: string; trail: string[] } }) {
  return (
    <header data-reveal css={s.header}>
      <div css={{ minWidth: 0, flex: 1 }}>
        {back && (
          <Link to={back.to} css={s.back}>
            <Icon name="chevron_left" size={16} />
            {back.trail.join('  >  ')}
          </Link>
        )}
        <h1 css={s.title}>{title}</h1>
        {subtitle && <p css={s.subtitle}>{subtitle}</p>}
      </div>
      <div css={s.headerRight}>
        <div css={s.weather}>
          <Icon name="sunny" size={22} fill css={{ color: c.warn }} />
          <div css={{ lineHeight: 1.25 }}>
            <p css={{ fontWeight: 600 }}>
              23°C <span css={{ fontSize: 14, fontWeight: 400, color: c.sub }}>맑음</span>
            </p>
            <p css={{ fontSize: 12, color: c.sub }}>
              미세먼지 <span css={{ color: c.good }}>좋음</span>
            </p>
          </div>
        </div>
        <button css={s.bell} aria-label="알림">
          <Icon name="notifications" size={22} />
        </button>
        <ProfileMenu />
      </div>
    </header>
  )
}

function ProfileMenu() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!open || reducedMotion()) return
      gsap.from(menu.current, { autoAlpha: 0, y: -8, scale: 0.97, transformOrigin: 'top right', duration: 0.22, ease: 'power2.out' })
      gsap.from(menu.current!.children, { autoAlpha: 0, y: -4, duration: 0.2, stagger: 0.04, delay: 0.05 })
    },
    { dependencies: [open] },
  )

  if (!admin) {
    return (
      <Link to="/admin/login" css={s.login}>
        <Icon name="verified_user" size={18} /> 관리자 로그인
      </Link>
    )
  }

  return (
    <div css={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} css={s.profile}>
        <div css={s.avatar}>
          <Icon name="person" size={22} fill />
        </div>
        <div css={{ fontSize: 14, lineHeight: 1.25 }}>
          <p css={{ fontWeight: 600 }}>
            {admin.name}님<span css={s.adminTag}>관리자</span>
          </p>
          <p css={{ fontSize: 12, color: c.sub }}>{admin.dept}</p>
        </div>
        <Icon name="expand_more" size={18} css={[s.chevron, open && { transform: 'rotate(180deg)' }]} />
      </button>
      {open && (
        <>
          <div css={s.backdrop} onClick={() => setOpen(false)} />
          <div ref={menu} css={s.menu}>
            <Link to="/settings" onClick={() => setOpen(false)} css={s.menuItem}>
              <Icon name="settings" size={18} css={{ color: c.sub }} /> 계정 설정
            </Link>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              css={[s.menuItem, s.menuDanger]}
            >
              <Icon name="logout" size={18} /> 로그아웃
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/** 라벨-값 행 목록 (요약 정보 등) */
export function StatRows({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl css={s.rows}>
      {rows.map((r) => (
        <div key={r.label} css={s.row}>
          <dt css={{ color: c.sub }}>{r.label}</dt>
          <dd css={{ fontWeight: 600 }}>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

const s = {
  // 연회색 배경 위의 테두리 없는 흰 카드
  card: css({ display: 'flex', flexDirection: 'column', borderRadius: r.lg, border: '1px solid transparent', background: c.surface }),
  cardHeader: css({ display: 'flex', alignItems: 'center', gap: 6, padding: '18px 20px 12px' }),
  cardTitle: css({ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }),
  cardSub: css({ fontSize: 12, color: c.mute }),
  cardRight: css({ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }),

  // 카드 아래 가운데에 놓이는 작은 회색 알약 버튼
  more: css({
    margin: 'auto auto 16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    borderRadius: r.sm,
    background: c.lineSoft,
    padding: '7px 12px',
    fontSize: 12,
    fontWeight: 500,
    color: c.sub,
    transition: `background 0.25s ${ease}, color 0.25s ${ease}`,
    '& .material-symbols-rounded': { transition: `transform 0.35s ${ease}` },
    '&:hover': { background: c.line, color: c.ink },
    '&:hover .material-symbols-rounded': { transform: 'translateX(2px)' },
    '&[data-down]:hover .material-symbols-rounded': { transform: 'translateY(2px)' },
  }),

  delta: css({ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }),
  deltaValue: css({ display: 'flex', alignItems: 'center', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }),

  kpi: css({ gap: 10, padding: '16px 18px' }),
  kpiLabel: css({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: c.sub,
    // 넘겨받은 아이콘 크기와 무관하게 라벨 줄에 맞춘다
    '& .material-symbols-rounded': { fontSize: '16px !important', color: c.mute },
  }),
  kpiValue: css({ fontSize: 22 }),
  kpiUnit: css({ marginLeft: 4, fontSize: 12, fontWeight: 400, letterSpacing: 0, color: c.mute }),
  kpiFoot: css({ marginTop: 4, fontSize: 12, color: c.sub }),

  // 회색 트랙 위에 흰 알약이 놓이는 세그먼트
  segmented: css({ display: 'inline-flex', gap: 2, borderRadius: r.md, background: c.lineSoft, padding: 3 }),
  segment: css({
    borderRadius: r.sm,
    color: c.mute,
    transition: `background 0.25s ${ease}, color 0.25s ${ease}`,
    '&:hover': { color: c.ink },
    '&[aria-pressed="true"]': { background: c.surface, color: c.ink, fontWeight: 600 },
  }),
  segmentSm: css({ padding: '5px 12px', fontSize: 12 }),
  segmentMd: css({ padding: '7px 22px', fontSize: 13 }),

  tabs: css({ display: 'flex', gap: 8, borderBottom: `1px solid ${c.line}` }),
  tab: css({
    position: 'relative',
    marginBottom: -1,
    padding: '10px 18px',
    fontSize: 13,
    color: c.mute,
    transition: `color 0.25s ${ease}`,
    // 밑줄이 왼쪽에서 자라난다
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 'auto 0 0 0',
      height: 2,
      background: c.ink,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: `transform 0.4s ${ease}`,
    },
    '&:hover': { color: c.ink },
    '&:hover::after': { transform: 'scaleX(0.35)' },
    '&[data-active="true"]': { color: c.ink, fontWeight: 600 },
    '&[data-active="true"]::after': { transform: 'scaleX(1)' },
  }),

  selectRoot: css({ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }),
  selectWrap: css({ position: 'relative', display: 'flex', flex: 1, alignItems: 'center' }),
  select: css({
    width: '100%',
    minWidth: 144,
    appearance: 'none',
    borderRadius: r.sm,
    // 카드 안팎 어디서든 보이도록 흰 바탕 + 헤어라인
    border: `1px solid ${c.line}`,
    background: c.surface,
    padding: '7px 34px 7px 12px',
    color: c.ink,
    outline: 'none',
    transition: `border-color 0.25s ${ease}`,
    '&:hover': { borderColor: c.mute },
    '&:focus': { borderColor: c.ink },
  }),
  // 필드 높이의 정중앙에 고정
  selectIcon: css({ pointerEvents: 'none', position: 'absolute', right: 10, top: '50%', display: 'grid', transform: 'translateY(-50%)', color: c.mute }),

  badge: css({ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: r.pill, background: c.lineSoft, padding: '3px 9px 3px 8px', fontSize: 11, fontWeight: 500, color: c.sub, whiteSpace: 'nowrap' }),
  badgeDot: css({ width: 6, height: 6, flexShrink: 0, borderRadius: r.pill }),

  button: css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: r.sm,
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: 600,
    transition: `transform 0.3s ${ease}, background 0.25s ${ease}, border-color 0.25s ${ease}, color 0.25s ${ease}`,
    '&:hover': { transform: 'translateY(-1px)' },
    '&:active': { transform: 'scale(0.97)' },
  }),
  buttonPrimary: css({ background: c.lime, color: c.night, '&:hover': { background: '#b5e335' } }),
  buttonOutline: css({ background: c.lineSoft, color: c.ink, '&:hover': { background: c.line } }),

  header: css({ marginBottom: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 16 }),
  back: css([
    eyebrow,
    {
      marginBottom: 8,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: c.sub,
      transition: `color 0.25s ${ease}`,
      '& .material-symbols-rounded': { transition: `transform 0.35s ${ease}` },
      '&:hover': { color: c.brand700 },
      '&:hover .material-symbols-rounded': { transform: 'translateX(-3px)' },
    },
  ]),
  title: css({ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 }),
  subtitle: css({ marginTop: 2, fontSize: 13, color: c.sub }),
  headerRight: css({ display: 'flex', alignItems: 'center', gap: 16 }),
  weather: css({ display: 'flex', alignItems: 'center', gap: 12, borderRadius: r.md, background: c.surface, padding: '8px 14px', fontSize: 13 }),
  bell: css({
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    color: c.ink,
    '&:hover .material-symbols-rounded': { fontVariationSettings: "'FILL' 1 !important" },
  }),

  login: css({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: r.sm,
    background: c.surface,
    padding: '8px 14px',
    fontSize: 13,
    color: c.sub,
    transition: `color 0.25s ${ease}`,
    '&:hover': { color: c.ink },
    '&:hover .material-symbols-rounded': { fontVariationSettings: "'FILL' 1 !important" },
  }),
  profile: css({ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }),
  avatar: css({ display: 'grid', width: 40, height: 40, placeItems: 'center', borderRadius: r.pill, background: c.lineSoft, color: c.mute }),
  adminTag: css({ marginLeft: 6, borderRadius: 4, background: c.lime, padding: '2px 6px', fontSize: 10, fontWeight: 600, color: c.night }),
  chevron: css({ color: c.mute, transition: `transform 0.3s ${ease}` }),
  backdrop: css({ position: 'fixed', inset: 0, zIndex: 10 }),
  menu: css({
    position: 'absolute',
    right: 0,
    zIndex: 20,
    marginTop: 8,
    width: 176,
    overflow: 'hidden',
    borderRadius: r.md,
    border: `1px solid ${c.line}`,
    background: c.surface,
    padding: '4px 0',
    fontSize: 14,
  }),
  menuItem: css({ display: 'flex', width: '100%', alignItems: 'center', gap: 8, padding: '10px 16px', transition: `background 0.2s ${ease}`, '&:hover': { background: c.lineSoft } }),
  menuDanger: css({ color: c.danger, '&:hover': { background: c.dangerSoft } }),

  rows: css({ padding: '0 24px 16px', '& > div + div': { borderTop: `1px solid ${c.lineSoft}` } }),
  row: css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', fontSize: 13 }),
}
