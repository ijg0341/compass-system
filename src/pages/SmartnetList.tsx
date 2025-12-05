import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FiltersBar from '@/src/components/smartnet-list/FiltersBar';
import ListTable from '@/src/components/smartnet-list/ListTable';
import DetailDrawer from '@/src/components/smartnet-list/DetailDrawer';
import { mockSmartnetList } from '@/src/lib/mockData/smartnetData';
import type {
  SmartnetFilter,
  SmartnetListItem,
} from '@/src/types/smartnet';

export default function SmartnetListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SmartnetFilter>({});
  const [selectedItem, setSelectedItem] = useState<SmartnetListItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 필터링된 데이터
  const filteredItems = useMemo(() => {
    let result = [...mockSmartnetList];

    // 카테고리 필터
    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    // 상태 필터
    if (filters.status && filters.status.length > 0) {
      result = result.filter((item) => filters.status!.includes(item.status));
    }

    // 검색어 필터
    if (filters.searchKeyword) {
      const keyword = filters.searchKeyword.toLowerCase();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.url.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword)
      );
    }

    // 날짜 범위 필터 (생성일 기준)
    if (filters.startDate) {
      result = result.filter(
        (item) => item.createdAt.split(' ')[0] >= filters.startDate!
      );
    }
    if (filters.endDate) {
      result = result.filter(
        (item) => item.createdAt.split(' ')[0] <= filters.endDate!
      );
    }

    return result;
  }, [filters]);

  const handleFiltersChange = (newFilters: SmartnetFilter) => {
    setFilters(newFilters);
  };

  const handleItemClick = (item: SmartnetListItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    // 애니메이션이 끝난 후 selectedItem 초기화
    setTimeout(() => {
      setSelectedItem(null);
    }, 300);
  };

  const handleCreateNew = () => {
    navigate('/smartnet/create');
  };

  return (
    <Box sx={{ p: 3 }}>
        {/* 헤더 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
              스마트넷 URL 관리
            </Typography>
            <Typography variant="body2" color="text.secondary">
              방문예약, 이사예약, 전자투표 URL을 생성하고 관리합니다
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            size="medium"
            sx={{
              px: 2.5,
              py: 1,
            }}
          >
            새 URL 생성
          </Button>
        </Box>

        {/* 필터 바 */}
        <FiltersBar filters={filters} onFiltersChange={handleFiltersChange} />

        {/* 목록 테이블 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            총 {filteredItems.length}개의 URL
            {filters.category || filters.status || filters.searchKeyword || filters.startDate || filters.endDate
              ? ` (전체 ${mockSmartnetList.length}개 중 필터링됨)`
              : ''}
          </Typography>
        </Box>
        <ListTable items={filteredItems} onItemClick={handleItemClick} />

        {/* 상세 Drawer */}
        <DetailDrawer
          open={drawerOpen}
          item={selectedItem}
          onClose={handleDrawerClose}
        />
    </Box>
  );
}
