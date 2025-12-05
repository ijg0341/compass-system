import { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import FiltersBar from '@/src/components/as-receipt/FiltersBar';
import ReceiptTable from '@/src/components/as-receipt/ReceiptTable';
import DetailDrawer from '@/src/components/as-receipt/DetailDrawer';
import BulkActionBar from '@/src/components/as-receipt/BulkActionBar';
import type { ASReceiptFilters, ASReceiptData } from '@/src/types/asReceipt';
import { mockASReceiptData } from '@/src/lib/mockData/asReceiptData';

export default function ASReceiptsPage() {
  const [filters, setFilters] = useState<ASReceiptFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ASReceiptData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    let result = [...mockASReceiptData];

    // 현장 필터
    if (filters.siteId) {
      const siteMap: Record<string, string> = {
        SITE_001: 'A현장',
        SITE_002: 'B현장',
        SITE_003: 'C현장',
        SITE_004: 'D현장',
      };
      const siteName = siteMap[filters.siteId];
      if (siteName) {
        result = result.filter((item) => item.siteName === siteName);
      }
    }

    // 동 필터
    if (filters.dong) {
      result = result.filter((item) =>
        item.dong.includes(filters.dong as string)
      );
    }

    // 호 필터
    if (filters.ho) {
      result = result.filter((item) => item.ho.includes(filters.ho as string));
    }

    // 공종 필터
    if (filters.trade) {
      result = result.filter((item) => item.trade === filters.trade);
    }

    // 소공종 필터
    if (filters.subTrade) {
      result = result.filter((item) => item.subTrade === filters.subTrade);
    }

    // 상태 필터
    if (filters.status && filters.status.length > 0) {
      result = result.filter((item) => filters.status?.includes(item.status));
    }

    // 우선순위 필터
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter((item) => filters.priority?.includes(item.priority));
    }

    // 검색어 필터
    if (filters.searchKeyword) {
      const keyword = filters.searchKeyword.toLowerCase();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
      );
    }

    // 날짜 필터
    if (filters.startDate) {
      result = result.filter((item) => item.requestedAt >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter((item) => item.requestedAt <= filters.endDate!);
    }

    // 내 담당만 필터 (현재는 담당자가 있는 것만)
    if (filters.assignedToMe) {
      result = result.filter((item) => item.assignee);
    }

    return result;
  }, [filters]);

  const handleFiltersChange = (newFilters: ASReceiptFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleRowClick = (receipt: ASReceiptData) => {
    setSelectedReceipt(receipt);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleBulkStatusChange = () => {
    console.log('Bulk status change for:', selectedIds);
    alert(`${selectedIds.length}건의 상태를 변경합니다. (실제 구현 필요)`);
  };

  const handleBulkAssigneeChange = () => {
    console.log('Bulk assignee change for:', selectedIds);
    alert(`${selectedIds.length}건의 담당자를 배정합니다. (실제 구현 필요)`);
  };

  const handleBulkPartnerChange = () => {
    console.log('Bulk partner change for:', selectedIds);
    alert(`${selectedIds.length}건의 협력사를 지정합니다. (실제 구현 필요)`);
  };

  return (
    <Box>
        {/* 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            A/S 접수관리
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {filteredData.length}건
          </Typography>
        </Box>

        {/* 필터 영역 */}
        <FiltersBar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* 테이블 영역 */}
        <ReceiptTable
          data={filteredData}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={handleRowClick}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />

        {/* 상세 드로어 */}
        <DetailDrawer
          open={drawerOpen}
          receipt={selectedReceipt}
          onClose={handleDrawerClose}
        />

        {/* 일괄 작업 바 */}
        <BulkActionBar
          selectedCount={selectedIds.length}
          onStatusChange={handleBulkStatusChange}
          onAssigneeChange={handleBulkAssigneeChange}
          onPartnerChange={handleBulkPartnerChange}
        />
    </Box>
  );
}
