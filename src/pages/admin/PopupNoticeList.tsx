/**
 * 관리자 전용 - 팝업공지 목록 페이지
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import FilterContainer, { FilterRow } from '@/src/components/common/FilterContainer';
import DataTable, { type Column } from '@/src/components/common/DataTable';
import { popupApi, type PopupNoticeListItem } from '@/src/lib/api/superadminApi';

export default function PopupNoticeList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 필터 상태
  const [searchType, setSearchType] = useState<string>('project_name');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 적용된 필터 (검색 버튼 클릭 시에만 적용)
  const [appliedFilters, setAppliedFilters] = useState({
    searchKeyword: '',
  });

  // 데이터 조회
  const { data, isLoading } = useQuery({
    queryKey: ['popup-notices', page, rowsPerPage, appliedFilters],
    queryFn: () =>
      popupApi.getList({
        offset: page * rowsPerPage,
        limit: rowsPerPage,
        searchKeyword: appliedFilters.searchKeyword || undefined,
      }),
  });

  const list = data?.data?.list ?? [];
  const total = data?.data?.total ?? 0;

  // 현재 노출중인지 확인
  const isExposing = (item: PopupNoticeListItem) => {
    if (!item.notice_begin || !item.notice_end) return false;
    const today = new Date().toISOString().split('T')[0];
    return item.notice_begin <= today && today <= item.notice_end;
  };

  // 테이블 컬럼 정의
  const columns: Column<PopupNoticeListItem>[] = [
    { id: 'id', label: '번호', minWidth: 60, align: 'center' },
    {
      id: 'project_name',
      label: '현장명',
      minWidth: 120,
      render: (row) => row.project_name || '[전체]',
    },
    {
      id: 'board_subject',
      label: '제목',
      minWidth: 300,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/popup-notice/${row.id}`);
            }}
          >
            {row.board_subject}
          </Typography>
          {isExposing(row) && (
            <Chip label="노출중" size="small" color="success" />
          )}
        </Box>
      ),
    },
    { id: 'notice_begin', label: '공지시작일', minWidth: 100, align: 'center' },
    { id: 'notice_end', label: '공지종료일', minWidth: 100, align: 'center' },
  ];

  const handleSearch = () => {
    setPage(0);
    setAppliedFilters({
      searchKeyword: searchKeyword,
    });
  };

  const handleReset = () => {
    setSearchType('project_name');
    setSearchKeyword('');
    setStartDate('');
    setEndDate('');
    setAppliedFilters({ searchKeyword: '' });
    setPage(0);
  };

  const handleRowClick = (row: PopupNoticeListItem) => {
    navigate(`/admin/popup-notice/${row.id}`);
  };

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          팝업공지 목록
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/popup-notice/create')}
        >
          등록
        </Button>
      </Box>

      {/* 필터 */}
      <FilterContainer onReset={handleReset} onApply={handleSearch}>
        <FilterRow isLast>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>검색유형</InputLabel>
            <Select
              value={searchType}
              label="검색유형"
              onChange={(e) => setSearchType(e.target.value)}
            >
              <MenuItem value="project_name">현장명</MenuItem>
              <MenuItem value="title">제목</MenuItem>
              <MenuItem value="content">내용</MenuItem>
              <MenuItem value="writer">작성자</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="검색어 입력"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ minWidth: 200 }}
          />
          <Typography sx={{ mx: 1 }}>공지일</Typography>
          <TextField
            size="small"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ width: 150 }}
          />
          <Typography>~</Typography>
          <TextField
            size="small"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ width: 150 }}
          />
        </FilterRow>
      </FilterContainer>

      {/* 테이블 */}
      <DataTable
        columns={columns}
        data={list}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onRowClick={handleRowClick}
        getRowKey={(row) => row.id}
        emptyMessage="등록된 팝업공지가 없습니다."
      />
    </Box>
  );
}
