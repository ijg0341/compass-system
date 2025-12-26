# Compass System Vite

## 공통 컴포넌트

### FilterContainer
필터바 래퍼. `FilterRow`로 행 구분.
```tsx
import FilterContainer, { FilterRow } from '@/src/components/common/FilterContainer';

<FilterContainer onReset={handleReset} onApply={handleApply}>
  <FilterRow>
    <Select ... />
    <TextField ... />
  </FilterRow>
  <FilterRow isLast>
    <TextField type="date" ... />
  </FilterRow>
</FilterContainer>
```

### DataTable
테이블 컴포넌트. columns 정의해서 사용.
```tsx
import DataTable, { type Column } from '@/src/components/common/DataTable';

const columns: Column<T>[] = [
  { id: 'name', label: '이름', minWidth: 100 },
  { id: 'status', label: '상태', render: (row) => <Chip label={row.status} /> },
];

<DataTable
  columns={columns}
  data={data}
  total={total}
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={setPage}
  onRowsPerPageChange={setRowsPerPage}
  onRowClick={handleRowClick}
  getRowKey={(row) => row.id}
/>
```

### BaseDrawer
상세 Drawer. `DrawerSection`, `DrawerInfoTable`로 내용 구성.
```tsx
import BaseDrawer, { DrawerSection, DrawerInfoTable } from '@/src/components/common/BaseDrawer';

<BaseDrawer open={open} onClose={onClose} title="상세" footer={<Button>저장</Button>}>
  <DrawerSection title="기본 정보" isFirst>
    <DrawerInfoTable rows={[
      [{ label: '이름', value: data.name }, { label: '연락처', value: data.phone }],
      { label: '주소', value: data.address, fullWidth: true },
    ]} />
  </DrawerSection>
</BaseDrawer>
```

### 폼 테이블 패턴
Drawer 내 폼을 테이블 레이아웃으로 구성. 라벨과 입력 필드를 2열 또는 4열로 배치.
```tsx
// 스타일 정의
const labelCellSx = {
  width: '15%',
  bgcolor: 'action.hover',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.primary',
  py: 1,
  px: 1.5,
};

const valueCellSx = {
  width: '35%',
  py: 0.5,
  px: 1,
};

const inputSx = {
  '& .MuiOutlinedInput-root': { backgroundColor: 'background.paper' },
  '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' },
};

// 사용 예시
<TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
  <Table size="small">
    <TableBody>
      {/* 4열 (라벨-값-라벨-값) */}
      <TableRow>
        <TableCell sx={labelCellSx}>아이디 *</TableCell>
        <TableCell sx={valueCellSx}>
          <TextField fullWidth size="small" name="user_id" sx={inputSx} />
        </TableCell>
        <TableCell sx={labelCellSx}>비밀번호 *</TableCell>
        <TableCell sx={valueCellSx}>
          <TextField fullWidth size="small" type="password" sx={inputSx} />
        </TableCell>
      </TableRow>
      {/* 전체 너비 (라벨-값 colspan=3) */}
      <TableRow>
        <TableCell sx={labelCellSx}>주소</TableCell>
        <TableCell colSpan={3} sx={valueCellSx}>
          <TextField fullWidth size="small" sx={inputSx} />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```
참고: `ManagerFormDrawer`, `PartnerFormDrawer`, `ResidentFormDrawer`

## 주의사항

- MUI v6 Grid: `item xs={6}` 대신 `size={6}` 사용
- Drawer 스크롤: `data-lenis-prevent` + `onWheel={(e) => e.stopPropagation()}` 필수
- 상태 색상: `AS_STATUS_COLORS`, `AS_PRIORITY_COLORS` 상수 사용 (types/afterservice.types.ts)
