import { ArrowLeft, ShieldCheck, Sprout } from 'lucide-react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { CAMPUS_TOTAL_KW } from '../data/mock'

/** 관리자 로그인 (사이트 자체는 로그인 없이 공개) */
export default function LoginPage() {
  const { admin, login } = useAuth()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin/data'

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
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-900 to-[#04463b] p-14 text-white lg:flex">
        <div className="flex items-center gap-3">
          <Sprout className="size-11 text-[#9bd36a]" strokeWidth={1.6} />
          <div className="leading-tight">
            <p className="text-xl font-bold">한밭대학교</p>
            <p className="text-white/75">탄소중립 캠퍼스</p>
          </div>
        </div>

        <div>
          <h1 className="text-[40px] leading-tight font-bold">
            캠퍼스 전력 데이터를
            <br />
            관리하고 운영합니다.
          </h1>
          <p className="mt-4 max-w-md text-white/75">센서 수집 현황, 비효율 구역, 리포트를 관리하는 시설관리팀 전용 페이지입니다.</p>
          <img src="/images/campus-map.webp" alt="" className="mt-10 w-full max-w-xl drop-shadow-2xl" />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-white/70">지금 캠퍼스 실시간 전력 사용량</p>
            <p className="text-3xl font-bold">
              {CAMPUS_TOTAL_KW.toLocaleString()} <span className="text-base font-normal text-white/70">kW</span>
            </p>
          </div>
          <p className="text-xs text-white/50">다학제간캡스톤디자인 · 지구를 지켜라</p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700">
            <ArrowLeft className="size-4" /> 대시보드로 돌아가기
          </Link>
          <span className="grid size-12 place-items-center rounded-xl bg-brand-100 text-brand-700">
            <ShieldCheck className="size-6" />
          </span>
          <h2 className="mt-4 text-2xl font-bold">관리자 로그인</h2>
          <p className="mt-1 text-sm text-gray-500">시설관리팀 계정으로 로그인해 주세요.</p>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-gray-700">아이디</span>
              <input placeholder="관리자 아이디" className="rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-600" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-gray-700">비밀번호</span>
              <input type="password" placeholder="비밀번호" className="rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-brand-600" />
            </label>
            <button type="submit" className="mt-2 rounded-lg bg-brand-900 py-3.5 font-semibold text-white hover:bg-brand-800">
              로그인
            </button>
          </form>

          <p className="mt-8 rounded-xl border border-dashed border-gray-300 p-4 text-xs text-gray-500">
            <b className="text-gray-700">데모 모드</b> · 인증 서버 연동 전이라 아무 값이나 입력해도 로그인돼요.
          </p>
        </div>
      </section>
    </div>
  )
}
