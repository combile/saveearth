import { Building2, ChartColumnBig, ChevronDown, Database, FileText, House, Leaf, ScanSearch, Settings, ShieldAlert, Sprout } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import { cx } from '../components/ui'
import { CARBON_SAVING } from '../data/mock'

const POWER_CHILDREN = [
  { to: '/power/building', label: '건물별' },
  { to: '/power/hourly', label: '시간대별' },
  { to: '/power/seasonal', label: '계절별' },
]

const NAV = [
  { to: '/forecast', label: '실시간 전력 예측', icon: ScanSearch },
  { to: '/classroom', label: '강의실 추천', icon: Building2 },
  { to: '/carbon', label: '탄소 절감 현황', icon: Leaf },
]

const ADMIN_NAV = [
  { to: '/inefficient', label: '비효율 구역 분석', icon: ShieldAlert },
  { to: '/report', label: '리포트', icon: FileText },
  { to: '/admin/data', label: '데이터 관리', icon: Database },
  { to: '/settings', label: '설정', icon: Settings },
]

const item = (active: boolean) =>
  cx(
    'flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] transition-colors',
    active ? 'bg-white/15 font-semibold text-white' : 'text-white/80 hover:bg-white/5 hover:text-white',
  )

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const { admin } = useAuth()
  const inPower = pathname.startsWith('/power')
  const [powerOpen, setPowerOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col bg-gradient-to-b from-brand-900 to-[#03332d] px-4 py-7 text-white">
        <Link to="/" className="mb-9 flex items-center gap-3 px-3">
          <Sprout className="size-10 text-[#9bd36a]" strokeWidth={1.6} />
          <div className="leading-tight">
            <p className="text-lg font-bold">한밭대학교</p>
            <p className="text-sm text-white/75">탄소중립 캠퍼스</p>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          <NavLink to="/" end className={({ isActive }) => item(isActive)}>
            <House className="size-5" />
            대시보드
          </NavLink>

          <div className={cx('rounded-xl', inPower && 'bg-white/5')}>
            <button onClick={() => setPowerOpen((o) => !o)} className={cx(item(inPower && !powerOpen), 'w-full')}>
              <ChartColumnBig className="size-5" />
              <span className="flex-1 text-left">전력 소비 시각화</span>
              <ChevronDown className={cx('size-4 transition-transform', !powerOpen && '-rotate-90')} />
            </button>
            {powerOpen && (
              <div className="flex flex-col gap-0.5 px-2 pb-2">
                {POWER_CHILDREN.map((c) => (
                  <NavLink
                    key={c.to}
                    to={c.to}
                    className={({ isActive }) =>
                      cx('rounded-lg py-2.5 pl-10 text-sm transition-colors', isActive ? 'bg-white/15 font-semibold text-white' : 'text-white/70 hover:text-white')
                    }
                  >
                    {c.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => item(isActive)}>
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}

          {admin && (
            <>
              <p className="mt-5 mb-1 px-4 text-xs font-semibold tracking-wide text-white/45">관리자</p>
              {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => item(isActive)}>
                  <Icon className="size-5" />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="mt-4 rounded-2xl border border-white/15 bg-white/[0.03] p-5 [@media(max-height:860px)]:hidden">
          <p className="flex items-center gap-2 text-sm text-white/90">
            <Leaf className="size-5 text-[#9bd36a]" />
            오늘의 탄소 절감 기여도
          </p>
          <p className="mt-3 text-center text-3xl font-bold">
            {CARBON_SAVING.today}
            <span className="ml-1 text-sm font-normal text-white/80">kgCO₂</span>
          </p>
          <p className="mt-3 text-sm text-white/85">
            나무 <b className="text-base text-white">{CARBON_SAVING.trees}</b> 그루 심은 효과
          </p>
          <div className="mt-2 h-2 rounded-full bg-white/15">
            <div className="h-full rounded-full bg-[#8cc63f]" style={{ width: `${CARBON_SAVING.progress}%` }} />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-10 py-8">
        <div className="mx-auto max-w-[1600px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
