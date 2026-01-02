# Compass System

아파트 관리 및 운영을 위한 통합 관리 시스템 웹 애플리케이션입니다.

## 주요 기능

- **대시보드**: 현장 현황, 통계, 알림 등 주요 지표 한눈에 확인
- **사전방문 관리**: 입주 전 방문 예약 및 검수 프로세스 관리
- **입주방문 관리**: 입주민 방문 예약 및 일정 관리
- **전입/전출 관리**: 세대별 전입/전출 현황 관리
- **A/S 관리**: 하자 접수부터 완료까지 전체 프로세스 관리
- **전자투표**: 조합원 총회 전자투표 생성 및 관리
- **커뮤니티**: 공지사항, 자료실 게시판 관리
- **세대 관리**: 동/호별 세대 현황 및 구성원 관리
- **사용자 관리**: 입주자, 협력사, 매니저 계정 관리
- **통계**: 각종 현황 통계 및 차트

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **프레임워크** | React 19, React Router 7 |
| **언어** | TypeScript 5.9 |
| **상태관리** | Zustand, React Query |
| **UI** | Material-UI 7, Emotion |
| **애니메이션** | Framer Motion |
| **차트** | Recharts, MUI X Charts, Toast UI Chart |
| **HTTP** | Axios |
| **빌드** | Vite 7 |

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

### 빌드 미리보기

```bash
npm run preview
```

### 린트 검사

```bash
npm run lint
```

## 환경 변수

`.env.local` 파일을 생성하여 환경 변수를 설정합니다.

```env
VITE_API_BASE_URL=http://localhost:9084
```

## 프로젝트 구조

```
src/
├── pages/              # 페이지 컴포넌트
│   ├── Dashboard.tsx        # 대시보드
│   ├── PrevisitManage.tsx   # 사전방문 관리
│   ├── ResidenceVisit.tsx   # 입주방문
│   ├── ResidenceMove.tsx    # 전입/전출
│   ├── ASManagePage.tsx     # A/S 관리
│   ├── UserManagement.tsx   # 사용자 관리
│   ├── VoteMeetingList.tsx  # 전자투표
│   ├── admin/               # 관리자 전용 페이지
│   └── statistics/          # 통계 페이지
├── components/         # 재사용 컴포넌트
│   ├── common/              # 공통 컴포넌트
│   ├── layout/              # 레이아웃
│   └── [feature]/           # 기능별 컴포넌트
├── hooks/              # 커스텀 React Hooks
├── stores/             # Zustand 상태 관리
├── lib/
│   ├── api/                 # API 통신
│   ├── config/              # 테마 설정
│   └── utils/               # 유틸리티
└── types/              # TypeScript 타입 정의
```

## 공통 컴포넌트 사용법

### FilterContainer

필터바 래퍼 컴포넌트입니다.

```tsx
import FilterContainer, { FilterRow } from '@/src/components/common/FilterContainer';

<FilterContainer onReset={handleReset} onApply={handleApply}>
  <FilterRow>
    <Select ... />
    <TextField ... />
  </FilterRow>
</FilterContainer>
```

### DataTable

테이블 컴포넌트입니다.

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
/>
```

### BaseDrawer

상세 정보 Drawer 컴포넌트입니다.

```tsx
import BaseDrawer, { DrawerSection, DrawerInfoTable } from '@/src/components/common/BaseDrawer';

<BaseDrawer open={open} onClose={onClose} title="상세" footer={<Button>저장</Button>}>
  <DrawerSection title="기본 정보" isFirst>
    <DrawerInfoTable rows={[
      [{ label: '이름', value: data.name }, { label: '연락처', value: data.phone }],
    ]} />
  </DrawerSection>
</BaseDrawer>
```

## 사용자 역할

| 역할 코드 | 설명 |
|----------|------|
| A1 | 슈퍼 관리자 |
| A2 | 관리자 |
| B1 | 조합사용자 |
| B2 | 현장관리자 |
| B3 | 매니저 |
| B4 | 관리사무소 |

## 주의사항

- MUI v6에서 Grid 사용 시 `item xs={6}` 대신 `size={6}` 사용
- Drawer 스크롤: `data-lenis-prevent` + `onWheel={(e) => e.stopPropagation()}` 필수
- 상태 색상은 `AS_STATUS_COLORS`, `AS_PRIORITY_COLORS` 상수 사용
