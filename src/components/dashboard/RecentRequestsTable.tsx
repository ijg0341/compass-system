
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState } from 'react';
import type { RecentRequestData } from '@/src/types/dashboard';

interface RecentRequestsTableProps {
  data: RecentRequestData[];
  title?: string;
}

export default function RecentRequestsTable({
  data,
  title = '최근 접수 내역',
}: RecentRequestsTableProps) {
  const [statusFilter, setStatusFilter] = useState<RecentRequestData['status'] | 'all'>('all');

  const getStatusColor = (
    status: RecentRequestData['status']
  ): 'default' | 'primary' | 'success' | 'error' => {
    switch (status) {
      case '접수중':
        return 'default';
      case '처리중':
        return 'primary';
      case '완료':
        return 'success';
      case '지연':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredData =
    statusFilter === 'all' ? data : data.filter((item) => item.status === statusFilter);

  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>상태</InputLabel>
            <Select
              value={statusFilter}
              label="상태"
              onChange={(e) =>
                setStatusFilter(e.target.value as RecentRequestData['status'] | 'all')
              }
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="접수중">접수중</MenuItem>
              <MenuItem value="처리중">처리중</MenuItem>
              <MenuItem value="완료">완료</MenuItem>
              <MenuItem value="지연">지연</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>접수번호</TableCell>
                <TableCell>현장명</TableCell>
                <TableCell>동/호수</TableCell>
                <TableCell>공종</TableCell>
                <TableCell>접수일</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>담당자</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(0, 10).map((request) => (
                <TableRow
                  key={request.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}
                    >
                      {request.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{request.site}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {request.building} {request.unit}
                    </Typography>
                  </TableCell>
                  <TableCell>{request.workType}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {request.receivedDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      size="small"
                      color={getStatusColor(request.status)}
                      sx={{ minWidth: 60 }}
                    />
                  </TableCell>
                  <TableCell>{request.manager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {filteredData.length === 0 && (
          <Box
            sx={{
              py: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              해당 조건에 맞는 데이터가 없습니다.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
