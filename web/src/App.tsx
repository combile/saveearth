import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, RequireAdmin } from './auth'
import DashboardLayout from './layouts/DashboardLayout'
import DataManagementPage from './pages/admin/DataManagementPage'
import CarbonPage from './pages/CarbonPage'
import ClassroomPage from './pages/ClassroomPage'
import DashboardPage from './pages/DashboardPage'
import BuildingDetailPage from './pages/detail/BuildingDetailPage'
import ForecastDetailPage from './pages/detail/ForecastDetailPage'
import HourlyDetailPage from './pages/detail/HourlyDetailPage'
import SeasonalDetailPage from './pages/detail/SeasonalDetailPage'
import ForecastPage from './pages/ForecastPage'
import InefficientPage from './pages/InefficientPage'
import LivePage from './pages/LivePage'
import LoginPage from './pages/LoginPage'
import PowerBuildingPage from './pages/power/PowerBuildingPage'
import PowerHourlyPage from './pages/power/PowerHourlyPage'
import PowerSeasonalPage from './pages/power/PowerSeasonalPage'
import ReportPage from './pages/ReportPage'
import SettingsPage from './pages/SettingsPage'

const adminOnly = (page: ReactNode) => <RequireAdmin>{page}</RequireAdmin>

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="admin/login" element={<LoginPage />} />
        <Route path="login" element={<Navigate to="/admin/login" replace />} />
        <Route element={<DashboardLayout />}>
          {/* 공개 */}
          <Route index element={<DashboardPage />} />
          <Route path="power" element={<Navigate to="/power/building" replace />} />
          <Route path="power/building" element={<PowerBuildingPage />} />
          <Route path="power/building/:id" element={<BuildingDetailPage />} />
          <Route path="power/hourly" element={<PowerHourlyPage />} />
          <Route path="power/hourly/detail" element={<HourlyDetailPage />} />
          <Route path="power/seasonal" element={<PowerSeasonalPage />} />
          <Route path="power/seasonal/detail" element={<SeasonalDetailPage />} />
          <Route path="live" element={<LivePage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="forecast/:id" element={<ForecastDetailPage />} />
          <Route path="classroom" element={<ClassroomPage />} />
          <Route path="carbon" element={<CarbonPage />} />

          {/* 관리자 전용 */}
          <Route path="inefficient" element={adminOnly(<InefficientPage />)} />
          <Route path="report" element={adminOnly(<ReportPage />)} />
          <Route path="admin/data" element={adminOnly(<DataManagementPage />)} />
          <Route path="settings" element={adminOnly(<SettingsPage />)} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
