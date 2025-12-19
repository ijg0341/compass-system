import { Routes, Route, Navigate } from 'react-router-dom'
import ThemeProvider from '@/src/components/common/ThemeProvider'
import QueryProvider from '@/src/components/common/QueryProvider'
import LenisScroll from '@/src/components/common/LenisScroll'
import ProtectedRoute from '@/src/components/common/ProtectedRoute'
import AdminLayout from '@/src/components/layout/AdminLayout'

// Pages
import Login from '@/src/pages/Login'
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
import VoteMeetingList from '@/src/pages/VoteMeetingList'
import VoteMeetingDetail from '@/src/pages/VoteMeetingDetail'
import VoteMeetingCreate from '@/src/pages/VoteMeetingCreate'

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LenisScroll />
        <Routes>
          {/* 로그인 */}
          <Route path="/login" element={<Login />} />

          {/* Root redirect to main */}
          <Route path="/" element={<Navigate to="/main" replace />} />

          {/* 메인 */}
          <Route path="/main" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 사전방문 */}
          <Route path="/pre-visit/register" element={
            <ProtectedRoute>
              <AdminLayout>
                <PrevisitRegister />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/pre-visit/reservation" element={
            <ProtectedRoute>
              <AdminLayout>
                <PrevisitReservation />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/pre-visit/old" element={
            <ProtectedRoute>
              <AdminLayout>
                <ResidenceVisit />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 입주관리 */}
          <Route path="/residence/move" element={
            <ProtectedRoute>
              <AdminLayout>
                <ResidenceMove />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 통계 > A/S */}
          <Route path="/statistics/as" element={
            <ProtectedRoute>
              <AdminLayout>
                <ASManageList />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 사용자 관리 > 입주자 관리 */}
          <Route path="/user/resident" element={
            <ProtectedRoute>
              <AdminLayout>
                <MemberResident />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 기초코드관리 */}
          <Route path="/base-code/dongho" element={
            <ProtectedRoute>
              <AdminLayout>
                <DonghoManage />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 스마트넷 */}
          <Route path="/smartnet/pre-visit" element={
            <ProtectedRoute>
              <AdminLayout>
                <PrevisitManage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/smartnet/pre-visit/list" element={
            <ProtectedRoute>
              <AdminLayout>
                <SmartnetList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/smartnet/move" element={
            <ProtectedRoute>
              <AdminLayout>
                <SmartnetCreate />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/smartnet/vote" element={
            <ProtectedRoute>
              <AdminLayout>
                <VoteMeetingCreate />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 전자투표 */}
          <Route path="/vote/meetings" element={
            <ProtectedRoute>
              <AdminLayout>
                <VoteMeetingList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/vote/meetings/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <VoteMeetingDetail />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
