import { createContext, useContext, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { DEMO_ADMIN, type User } from './data/mock'

// 사이트는 공개. 관리자만 로그인하며, 백엔드 인증 연동 전까지는 목업으로 동작한다.
const STORAGE_KEY = 'earth-guard:admin'

interface AuthValue {
  admin: User | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

function readLoggedIn(): boolean {
  // 개발 모드 전용: ?as=admin 으로 바로 관리자 로그인 (화면 확인용)
  if (import.meta.env.DEV && new URLSearchParams(location.search).get('as') === 'admin') {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* noop */
    }
    return true
  }
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(readLoggedIn)

  const login = () => {
    setLoggedIn(true)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* 저장 실패해도 세션 동안은 유지 */
    }
  }
  const logout = () => {
    setLoggedIn(false)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
  }

  return <AuthContext.Provider value={{ admin: loggedIn ? DEMO_ADMIN : null, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/** 관리자 전용 화면 보호 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin } = useAuth()
  const location = useLocation()
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return children
}
