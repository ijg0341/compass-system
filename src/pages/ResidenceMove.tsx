import { useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StatsCards from '@/src/components/move-reservation/StatsCards';
import FiltersBar from '@/src/components/move-reservation/FiltersBar';
import ReservationTable from '@/src/components/move-reservation/ReservationTable';
import DetailDrawer from '@/src/components/move-reservation/DetailDrawer';
import CalendarView from '@/src/components/move-reservation/CalendarView';
import type { MoveReservationFilter, AdminMoveReservation } from '@/src/types/reservation';
import {
  mockMoveReservations,
  generateMoveReservationStats,
  filterMoveReservations,
} from '@/src/lib/mockData/reservationData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function MoveReservationPage() {
  const [filters, setFilters] = useState<MoveReservationFilter>({});
  const [selectedReservation, setSelectedReservation] = useState<AdminMoveReservation | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);

  // 통계 데이터
  const stats = useMemo(() => generateMoveReservationStats(), []);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return filterMoveReservations(mockMoveReservations, filters);
  }, [filters]);

  const handleFiltersChange = (newFilters: MoveReservationFilter) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleRowClick = (reservation: AdminMoveReservation) => {
    setSelectedReservation(reservation);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleStatusChange = (id: string, status: 'cancelled', reason: string) => {
    console.log(`Status change for ${id}: ${status}, reason: ${reason}`);
    alert(`예약 ${id}이(가) 취소되었습니다. 사유: ${reason}\n(실제 구현 필요)`);
    setDrawerOpen(false);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
        {/* 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            이사예약 관리
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {filteredData.length}건의 예약
          </Typography>
        </Box>

        {/* 통계 카드 */}
        <StatsCards stats={stats} />

        {/* 뷰 전환 탭 */}
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            <Tab
              icon={<ViewListIcon />}
              iconPosition="start"
              label="목록 뷰"
              sx={{ minHeight: 48 }}
            />
            <Tab
              icon={<CalendarMonthIcon />}
              iconPosition="start"
              label="달력 뷰"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        {/* 필터 영역 */}
        <FiltersBar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* 목록 뷰 */}
        <TabPanel value={tabValue} index={0}>
          <ReservationTable
            data={filteredData}
            onRowClick={handleRowClick}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </TabPanel>

        {/* 달력 뷰 */}
        <TabPanel value={tabValue} index={1}>
          <CalendarView reservations={filteredData} onReservationClick={handleRowClick} />
        </TabPanel>

        {/* 상세 드로어 */}
        <DetailDrawer
          open={drawerOpen}
          reservation={selectedReservation}
          onClose={handleDrawerClose}
          onStatusChange={handleStatusChange}
        />
    </Box>
  );
}
