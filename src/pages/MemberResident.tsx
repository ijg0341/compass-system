import { useState, useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FiltersBar from '@/src/components/member/FiltersBar';
import ResidentTable from '@/src/components/member/ResidentTable';
import DetailDrawer from '@/src/components/member/DetailDrawer';
import RegisterDialog from '@/src/components/member/RegisterDialog';
import type { ResidentFilters, ResidentData, MemberStatus } from '@/src/types/member';
import { mockResidentData, mockMemberStats } from '@/src/lib/mockData/memberData';

export default function ResidentManagementPage() {
  const [filters, setFilters] = useState<ResidentFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedResident, setSelectedResident] = useState<ResidentData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    let result = [...mockResidentData];

    // 검색 필터
    if (filters.searchKeyword && filters.searchType) {
      const keyword = filters.searchKeyword.toLowerCase();
      result = result.filter((item) => {
        switch (filters.searchType) {
          case 'memberId':
            return item.loginId.toLowerCase().includes(keyword);
          case 'contractorName':
            return item.contractorName.toLowerCase().includes(keyword);
          case 'residentName':
            return item.residentName.toLowerCase().includes(keyword);
          default:
            return true;
        }
      });
    }

    // 검색어만 있고 타입이 없는 경우 전체 검색
    if (filters.searchKeyword && !filters.searchType) {
      const keyword = filters.searchKeyword.toLowerCase();
      result = result.filter((item) =>
        item.loginId.toLowerCase().includes(keyword) ||
        item.contractorName.toLowerCase().includes(keyword) ||
        item.residentName.toLowerCase().includes(keyword)
      );
    }

    // 회원구분 필터
    if (filters.memberType) {
      result = result.filter((item) => item.memberType === filters.memberType);
    }

    // 동 필터
    if (filters.dong) {
      result = result.filter((item) => item.dong.includes(filters.dong as string));
    }

    // 호 필터
    if (filters.ho) {
      result = result.filter((item) => item.ho.includes(filters.ho as string));
    }

    // 회원레벨 필터
    if (filters.level) {
      result = result.filter((item) => item.level === filters.level);
    }

    // 접근차단여부 필터
    if (filters.isBlocked !== undefined) {
      result = result.filter((item) => {
        if (filters.isBlocked) {
          return item.status === 'BLOCKED';
        } else {
          return item.status === 'ACTIVE';
        }
      });
    }

    // 상태 필터
    if (filters.status && filters.status.length > 0) {
      result = result.filter((item) => filters.status?.includes(item.status));
    }

    return result;
  }, [filters]);

  const handleFiltersChange = (newFilters: ResidentFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleRowClick = (resident: ResidentData) => {
    setSelectedResident(resident);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleStatusChange = (id: string, status: MemberStatus) => {
    console.log('Status change:', id, status);
    // 실제 구현 시 API 호출
  };

  const handleRegisterSubmit = (data: Partial<ResidentData>) => {
    console.log('Register:', data);
    setDialogOpen(false);
    // 실제 구현 시 API 호출
  };

  return (
    <Box>
        {/* 헤더 + 등록 버튼 */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              입주자 관리
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              총 {mockMemberStats.totalMembers.toLocaleString()}건 · 차단 {mockMemberStats.blockedMembers.toLocaleString()}건 · 탈퇴 {mockMemberStats.withdrawnMembers.toLocaleString()}건
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            신규 등록
          </Button>
        </Box>

        {/* 필터 */}
        <FiltersBar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* 테이블 */}
        <ResidentTable
          data={filteredData}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={handleRowClick}
          onStatusChange={handleStatusChange}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />

        {/* 상세 Drawer */}
        <DetailDrawer
          open={drawerOpen}
          resident={selectedResident}
          onClose={handleDrawerClose}
        />

        {/* 등록 Dialog */}
        <RegisterDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleRegisterSubmit}
        />
    </Box>
  );
}
