import { Routes, Route, Navigate } from 'react-router-dom'
import ThemeProvider from '@/src/components/common/ThemeProvider'
import QueryProvider from '@/src/components/common/QueryProvider'
import LenisScroll from '@/src/components/common/LenisScroll'
import ProtectedRoute from '@/src/components/common/ProtectedRoute'
import AdminLayout from '@/src/components/layout/AdminLayout'

// Pages
import Login from '@/src/pages/Login'
import ProjectLogin from '@/src/pages/ProjectLogin'
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

// Admin Pages (관리자 전용)
import PopupNoticeList from '@/src/pages/admin/PopupNoticeList'
import PopupNoticeDetail from '@/src/pages/admin/PopupNoticeDetail'
import PopupNoticeForm from '@/src/pages/admin/PopupNoticeForm'
import CompanyManage from '@/src/pages/admin/CompanyManage'
import ProjectManage from '@/src/pages/admin/ProjectManage'
import AdminUserManage from '@/src/pages/admin/AdminUserManage'

// Statistics Pages (통계)
import {
  StatsPrevisit,
  StatsAS,
  StatsOccupancy,
  StatsDashboard,
} from '@/src/pages/statistics'

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LenisScroll />
        <Routes>
          {/* 로그인 */}
          <Route path="/login" element={<ProjectLogin />} />
          <Route path="/login/admin" element={<Login />} />

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

          {/* 통계 > 사전방문 */}
          <Route path="/statistics/previsit" element={
            <ProtectedRoute>
              <AdminLayout>
                <StatsPrevisit />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 통계 > A/S */}
          <Route path="/statistics/as" element={
            <ProtectedRoute>
              <AdminLayout>
                <StatsAS />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 통계 > 입주관리 */}
          <Route path="/statistics/occupancy" element={
            <ProtectedRoute>
              <AdminLayout>
                <StatsOccupancy />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 통계 > 현장관리 */}
          <Route path="/statistics/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <StatsDashboard />
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

          {/* 관리자 전용 - 팝업공지 */}
          <Route path="/admin/popup-notice" element={
            <ProtectedRoute>
              <AdminLayout>
                <PopupNoticeList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/popup-notice/create" element={
            <ProtectedRoute>
              <AdminLayout>
                <PopupNoticeForm />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/popup-notice/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <PopupNoticeDetail />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/popup-notice/:id/edit" element={
            <ProtectedRoute>
              <AdminLayout>
                <PopupNoticeForm />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 관리자 전용 - 건설사 관리 */}
          <Route path="/admin/company" element={
            <ProtectedRoute>
              <AdminLayout>
                <CompanyManage />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 관리자 전용 - 현장 관리 */}
          <Route path="/admin/project" element={
            <ProtectedRoute>
              <AdminLayout>
                <ProjectManage />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* 관리자 전용 - 관리자 관리 (A1 only) */}
          <Route path="/admin/manager" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUserManage />
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
