/**
 * 커뮤니티 - 공지사항 목록 페이지
 * 화면 ID: CP-SA-06-001
 */
import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import FilterContainer, { FilterRow } from '@/src/components/common/FilterContainer';
import DataTable, { type Column } from '@/src/components/common/DataTable';
import { useNotices } from '@/src/hooks/useBoard';
import { useCurrentProject } from '@/src/hooks/useCurrentProject';
import { formatBoardDate, type BoardPostListItem, type BoardListParams } from '@/src/types/board.types';

// 검색 타입 옵션
const SEARCH_TYPE_OPTIONS = [
  { value: 'subject', label: '제목' },
  { value: 'text', label: '내용' },
  { value: 'admin_user_name', label: '작성자' },
];

export default function CommunityNoticePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projectUuid } = useCurrentProject();

  // 필터 상태
  const [searchType, setSearchType] = useState<string>('subject');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateBegin, setDateBegin] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // 페이지네이션
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // API 파라미터
  const params: BoardListParams = useMemo(() => ({
    page: page + 1,
    size: rowsPerPage,
    searchType: searchKeyword ? searchType as BoardListParams['searchType'] : undefined,
    searchKeyword: searchKeyword || undefined,
    date_begin: dateBegin || undefined,
    date_end: dateEnd || undefined,
  }), [page, rowsPerPage, searchType, searchKeyword, dateBegin, dateEnd]);

  // API 훅
  const { data: postsData, isLoading, error, refetch } = useNotices(projectUuid, params);

  const posts = useMemo(() => postsData?.list || [], [postsData]);
  const total = postsData?.total || 0;

  // 필터 초기화
  const handleReset = useCallback(() => {
    setSearchType('subject');
    setSearchKeyword('');
    setDateBegin('');
    setDateEnd('');
    setPage(0);
  }, []);

  // 검색
  const handleSearch = useCallback(() => {
    setPage(0);
    refetch();
  }, [refetch]);

  // 상세 페이지로 이동
  const handleRowClick = useCallback((row: BoardPostListItem) => {
    navigate(`/community/notice/${row.id}`);
  }, [navigate]);

  // 등록 페이지로 이동
  const handleCreate = useCallback(() => {
    navigate('/community/notice/create');
  }, [navigate]);

  // 테이블 컬럼 정의
  const columns: Column<BoardPostListItem>[] = useMemo(() => [
    {
      id: 'id',
      label: '번호',
      minWidth: 70,
      align: 'center',
    },
    {
      id: 'board_subject',
      label: '제목',
      minWidth: 300,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            component="span"
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {row.board_subject}
          </Typography>
          {row.board_hidden === 1 && (
            <Chip label="비공개" size="small" color="warning" />
          )}
        </Box>
      ),
    },
    {
      id: 'admin_user_name',
      label: '작성자',
      minWidth: 100,
      align: 'center',
      render: (row) => row.admin_user_name || '관리자',
    },
    {
      id: 'board_date',
      label: '등록일',
      minWidth: 120,
      align: 'center',
      render: (row) => formatBoardDate(row.board_date),
    },
    {
      id: 'board_count_view',
      label: '조회수',
      minWidth: 80,
      align: 'center',
    },
  ], []);

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            공지사항
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            총 {total}건
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          등록
        </Button>
      </Box>

      {/* 필터 */}
      <FilterContainer onReset={handleReset} onApply={handleSearch}>
        <FilterRow isLast>
          <TextField
            select
            label="검색유형"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            size="small"
            sx={{ width: 120 }}
          >
            {SEARCH_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="검색어"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            size="small"
            sx={{ width: 200 }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <TextField
            label="등록일"
            type="date"
            value={dateBegin}
            onChange={(e) => setDateBegin(e.target.value)}
            size="small"
            sx={{ width: 150 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Typography variant="body2" sx={{ mx: 0.5 }}>~</Typography>
          <TextField
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            size="small"
            sx={{ width: 150 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </FilterRow>
      </FilterContainer>

      {/* 에러 표시 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          데이터를 불러오는데 실패했습니다.
        </Alert>
      )}

      {/* 로딩 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onRowClick={handleRowClick}
          getRowKey={(row) => row.id}
        />
      )}
    </Box>
  );
}
