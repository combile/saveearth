import { ArrowRight, Bell, ChevronDown, ChevronLeft, Info, LogOut, Settings, ShieldCheck, Sun, Triangle, User } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cx('flex flex-col rounded-2xl border border-gray-200/70 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]', className)}>{children}</section>
}

export function CardHeader({ title, sub, info, right }: { title: string; sub?: string; info?: boolean; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-6 pt-5 pb-4">
      <h2 className="text-[17px] font-bold">{title}</h2>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
      {info && <Info className="size-4 text-gray-400" />}
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  )
}

export function MoreLink({ to = '#', label = '더보기', down }: { to?: string; label?: string; down?: boolean }) {
  return (
    <Link to={to} className="mt-auto flex items-center justify-center gap-1.5 border-t border-gray-100 py-3.5 text-sm text-gray-600 hover:text-brand-700">
      {label}
      {down ? <ChevronDown className="size-4" /> : <ArrowRight className="size-4" />}
    </Link>
  )
}

export function Delta({ value, compare }: { value: number; compare?: string }) {
  const down = value < 0
  return (
    <span className="flex items-center gap-1.5 text-sm">
      {compare && <span className="text-gray-500">{compare}</span>}
      <span className={cx('flex items-center gap-1 font-medium', down ? 'text-good' : 'text-red-500')}>
        <Triangle className={cx('size-2.5 fill-current', down && 'rotate-180')} />
        {Math.abs(value)}%
      </span>
    </span>
  )
}

const KPI_TONES = {
  green: 'bg-brand-100 text-brand-700',
  lime: 'bg-[#eef6e4] text-[#5c9a2c]',
  purple: 'bg-[#f0edfb] text-[#7a63d1]',
  teal: 'bg-[#e6f4f1] text-brand-600',
}

export function KpiCard({ icon, tone = 'green', label, value, unit, foot }: { icon: ReactNode; tone?: keyof typeof KPI_TONES; label: string; value: string; unit: string; foot: ReactNode }) {
  return (
    <Card className="flex-row items-center gap-5 px-6 py-5">
      <div className={cx('grid size-14 shrink-0 place-items-center rounded-full [&>svg]:size-6', KPI_TONES[tone])}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="mt-0.5 text-[26px] leading-tight font-bold tracking-tight">
          {value}
          <span className="ml-1 text-sm font-normal text-gray-500">{unit}</span>
        </p>
        <div className="mt-1 text-sm text-gray-500">{foot}</div>
      </div>
    </Card>
  )
}

/** 버튼형 세그먼트 탭 (건물별/시간대별/계절별, kWh/kW 등) */
export function Segmented<T extends string>({ options, value, onChange, size = 'md' }: { options: readonly T[]; value: T; onChange: (v: T) => void; size?: 'sm' | 'md' }) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-gray-200">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cx(
            'border-l border-gray-200 first:border-l-0',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-6 py-2 text-sm',
            o === value ? 'bg-brand-900 font-semibold text-white' : 'bg-white text-gray-500 hover:bg-gray-50',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** 밑줄형 탭 */
export function UnderlineTabs({ items }: { items: { label: string; active: boolean; onClick?: () => void; to?: string }[] }) {
  return (
    <div className="flex gap-2 border-b border-gray-200">
      {items.map((t) => {
        const cls = cx('-mb-px border-b-2 px-6 py-3 text-[15px]', t.active ? 'border-brand-700 font-bold text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800')
        return t.to ? (
          <Link key={t.label} to={t.to} className={cls}>
            {t.label}
          </Link>
        ) : (
          <button key={t.label} onClick={t.onClick} className={cls}>
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

export function SelectBox({ label, value, options, onChange, icon, className }: { label?: string; value: string; options?: string[]; onChange?: (v: string) => void; icon?: ReactNode; className?: string }) {
  return (
    <label className={cx('flex items-center gap-3 text-sm', className)}>
      {label && <span className="shrink-0 text-gray-500">{label}</span>}
      <span className="relative flex flex-1 items-center">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full min-w-36 appearance-none rounded-lg border border-gray-200 bg-white py-2 pr-9 pl-3 text-gray-800 outline-none focus:border-brand-600"
        >
          {(options ?? [value]).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 text-gray-400">{icon ?? <ChevronDown className="size-4" />}</span>
      </span>
    </label>
  )
}

export function Badge({ tone, children }: { tone: 'danger' | 'warn' | 'good' | 'blue' | 'green'; children: ReactNode }) {
  const tones = {
    danger: 'bg-red-50 text-red-500 border-red-100',
    warn: 'bg-amber-50 text-amber-600 border-amber-100',
    good: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-indigo-50 text-indigo-500 border-indigo-100',
    green: 'bg-brand-100 text-brand-700 border-emerald-100',
  }
  return <span className={cx('inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap', tones[tone])}>{children}</span>
}

export function Button({ variant = 'primary', className, children, onClick }: { variant?: 'primary' | 'outline'; className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
        variant === 'primary' ? 'bg-brand-900 text-white hover:bg-brand-800' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
        className,
      )}
    >
      {children}
    </button>
  )
}

/** 페이지 상단: 제목 + 날씨/알림/프로필 */
export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: { to: string; trail: string[] } }) {
  return (
    <header className="mb-6 flex flex-wrap items-start gap-4">
      <div className="min-w-0 flex-1">
        {back && (
          <Link to={back.to} className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-700">
            <ChevronLeft className="size-3.5" />
            {back.trail.join('  >  ')}
          </Link>
        )}
        <h1 className="text-[28px] font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200/70 bg-white px-5 py-2.5">
          <Sun className="size-7 text-amber-400" strokeWidth={1.5} />
          <div className="leading-tight">
            <p className="font-semibold">
              23°C <span className="text-sm font-normal text-gray-500">맑음</span>
            </p>
            <p className="text-xs text-gray-500">
              미세먼지 <span className="text-good">좋음</span>
            </p>
          </div>
        </div>
        <button className="relative text-gray-700" aria-label="알림">
          <Bell className="size-5" />
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
  if (!admin) {
    return (
      <Link to="/admin/login" className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-600 hover:border-brand-600 hover:text-brand-700">
        <ShieldCheck className="size-4" /> 관리자 로그인
      </Link>
    )
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2.5 text-left">
        <div className="grid size-10 place-items-center rounded-full bg-gray-100 text-gray-400">
          <User className="size-5" />
        </div>
        <div className="text-sm leading-tight">
          <p className="font-semibold">
            {admin.name}님
            <span className="ml-1.5 rounded bg-brand-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">관리자</span>
          </p>
          <p className="text-xs text-gray-500">{admin.dept}</p>
        </div>
        <ChevronDown className={cx('size-4 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-sm shadow-lg">
            <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50">
              <Settings className="size-4 text-gray-500" /> 계정 설정
            </Link>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50"
            >
              <LogOut className="size-4" /> 로그아웃
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
    <dl className="divide-y divide-gray-100 px-6 pb-4">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between py-3 text-sm">
          <dt className="text-gray-500">{r.label}</dt>
          <dd className="font-semibold">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
