import { Routes, Route, Navigate } from 'react-router-dom'
import ThemeProvider from '@/src/components/common/ThemeProvider'
import QueryProvider from '@/src/components/common/QueryProvider'
import LenisScroll from '@/src/components/common/LenisScroll'
import AdminLayout from '@/src/components/layout/AdminLayout'

// Pages
import Dashboard from '@/src/pages/Dashboard'
import ASManageList from '@/src/pages/ASManageList'
import SmartnetList from '@/src/pages/SmartnetList'
import SmartnetCreate from '@/src/pages/SmartnetCreate'
import MemberResident from '@/src/pages/MemberResident'
import ResidenceMove from '@/src/pages/ResidenceMove'
import ResidenceVisit from '@/src/pages/ResidenceVisit'
import PrevisitManage from '@/src/pages/PrevisitManage'
import PrevisitReservation from '@/src/pages/PrevisitReservation'
import PrevisitRegister from '@/src/pages/PrevisitRegister'
import DonghoManage from '@/src/pages/DonghoManage'

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LenisScroll />
        <Routes>
          {/* Root redirect to main */}
          <Route path="/" element={<Navigate to="/main" replace />} />

          {/* 메인 */}
          <Route path="/main" element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } />

          {/* 사전방문 */}
          <Route path="/pre-visit/register" element={
            <AdminLayout>
              <PrevisitRegister />
            </AdminLayout>
          } />
          <Route path="/pre-visit/reservation" element={
            <AdminLayout>
              <PrevisitReservation />
            </AdminLayout>
          } />
          <Route path="/pre-visit/old" element={
            <AdminLayout>
              <ResidenceVisit />
            </AdminLayout>
          } />

          {/* 입주관리 */}
          <Route path="/residence/move" element={
            <AdminLayout>
              <ResidenceMove />
            </AdminLayout>
          } />

          {/* 통계 > A/S */}
          <Route path="/statistics/as" element={
            <AdminLayout>
              <ASManageList />
            </AdminLayout>
          } />

          {/* 사용자 관리 > 입주자 관리 */}
          <Route path="/user/resident" element={
            <AdminLayout>
              <MemberResident />
            </AdminLayout>
          } />

          {/* 기초코드관리 */}
          <Route path="/base-code/dongho" element={
            <AdminLayout>
              <DonghoManage />
            </AdminLayout>
          } />

          {/* 스마트넷 */}
          <Route path="/smartnet/pre-visit" element={
            <AdminLayout>
              <PrevisitManage />
            </AdminLayout>
          } />
          <Route path="/smartnet/pre-visit/list" element={
            <AdminLayout>
              <SmartnetList />
            </AdminLayout>
          } />
          <Route path="/smartnet/move" element={
            <AdminLayout>
              <SmartnetCreate />
            </AdminLayout>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
