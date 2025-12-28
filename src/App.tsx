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
import ASManagePage from '@/src/pages/ASManagePage'
import SmartnetList from '@/src/pages/SmartnetList'
import SmartnetMoveCreate from '@/src/pages/SmartnetMoveCreate'
import UserManagement from '@/src/pages/UserManagement'
import ResidenceMove from '@/src/pages/ResidenceMove'
import ResidenceVisit from '@/src/pages/ResidenceVisit'
import PrevisitManage from '@/src/pages/PrevisitManage'
import PrevisitReservation from '@/src/pages/PrevisitReservation'
import PrevisitRegister from '@/src/pages/PrevisitRegister'
import BaseCodeManagePage from '@/src/pages/BaseCodeManagePage'
import VoteMeetingList from '@/src/pages/VoteMeetingList'
import VoteMeetingDetail from '@/src/pages/VoteMeetingDetail'
import VoteMeetingCreate from '@/src/pages/VoteMeetingCreate'
import HouseholdList from '@/src/pages/HouseholdList'
import HouseholdFloorPlan from '@/src/pages/HouseholdFloorPlan'
import CommunityNotice from '@/src/pages/CommunityNotice'
import CommunityNoticeDetail from '@/src/pages/CommunityNoticeDetail'
import CommunityNoticeForm from '@/src/pages/CommunityNoticeForm'
import CommunityDocument from '@/src/pages/CommunityDocument'
import CommunityDocumentDetail from '@/src/pages/CommunityDocumentDetail'
import CommunityDocumentForm from '@/src/pages/CommunityDocumentForm'

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
          <Route path="/residence/visit" element={
            <ProtectedRoute>
              <AdminLayout>
                <ResidenceVisit />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/residence/move" element={
            <ProtectedRoute>
              <AdminLayout>
                <ResidenceMove />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/residence/as" element={
            <ProtectedRoute>
              <AdminLayout>
                <ASManagePage />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 세대현황 */}
          <Route path="/units/list" element={
            <ProtectedRoute>
              <AdminLayout>
                <HouseholdList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/units/floor-plan" element={
            <ProtectedRoute>
              <AdminLayout>
                <HouseholdFloorPlan />
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

          {/* 사용자 관리 */}
          <Route path="/user" element={
            <ProtectedRoute>
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 기초코드관리 */}
          <Route path="/base-code/dongho" element={
            <ProtectedRoute>
              <AdminLayout>
                <BaseCodeManagePage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/base-code/defect-type" element={
            <ProtectedRoute>
              <AdminLayout>
                <BaseCodeManagePage />
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
                <SmartnetMoveCreate />
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

          {/* 커뮤니티 - 공지사항 */}
          <Route path="/community/notice" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommunityNotice />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/community/notice/create" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommunityNoticeForm />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/community/notice/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommunityNoticeDetail />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/community/notice/:id/edit" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommunityNoticeForm />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 커뮤니티 - 자료실 */}
          <Route path="/community/document" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommunityDocument />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/community/document/create" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommunityDocumentForm />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/community/document/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommunityDocumentDetail />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/community/document/:id/edit" element={
            <ProtectedRoute>
              <AdminLayout>
                <CommunityDocumentForm />
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
