
import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';
import type { AdminMoveReservation, ElevatorLine } from '@/src/types/reservation';

interface CalendarViewProps {
  reservations: AdminMoveReservation[];
  onReservationClick: (reservation: AdminMoveReservation) => void;
}

const ELEVATOR_LINE_COLORS: Record<ElevatorLine, string> = {
  A: '#E63C2E',
  B: '#2196F3',
  C: '#4CAF50',
  D: '#FF9800',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function CalendarView({
  reservations,
  onReservationClick,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const calendarDays = useMemo(() => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfCalendar = startOfMonth.startOf('week');
    const endOfCalendar = endOfMonth.endOf('week');

    const days: dayjs.Dayjs[] = [];
    let day = startOfCalendar;

    while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  }, [currentDate]);

  const reservationsByDate = useMemo(() => {
    const map: Record<string, AdminMoveReservation[]> = {};
    reservations.forEach((reservation) => {
      if (reservation.status === 'active') {
        const dateKey = reservation.date;
        if (!map[dateKey]) {
          map[dateKey] = [];
        }
        map[dateKey].push(reservation);
      }
    });
    return map;
  }, [reservations]);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const isCurrentMonth = (day: dayjs.Dayjs) => {
    return day.month() === currentDate.month();
  };

  const isToday = (day: dayjs.Dayjs) => {
    return day.isSame(dayjs(), 'day');
  };

  return (
    <Paper
      sx={{
        p: 2,
        background: 'rgba(26, 26, 26, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 달력 헤더 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>
          {currentDate.format('YYYY년 MM월')}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* 요일 헤더 */}
      <Grid container spacing={0.5} sx={{ mb: 1 }}>
        {WEEKDAYS.map((day, index) => (
          <Grid size="grow" key={day} sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              fontWeight={600}
              color={
                index === 0 ? 'error.main' : index === 6 ? 'info.main' : 'text.secondary'
              }
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* 달력 그리드 */}
      <Grid container spacing={0.5}>
        {calendarDays.map((day) => {
          const dateKey = day.format('YYYY-MM-DD');
          const dayReservations = reservationsByDate[dateKey] || [];
          const dayOfWeek = day.day();

          return (
            <Grid size="grow" key={dateKey}>
              <Box
                sx={{
                  minHeight: 100,
                  p: 0.5,
                  border: '1px solid',
                  borderColor: isToday(day)
                    ? 'primary.main'
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  backgroundColor: isCurrentMonth(day)
                    ? 'transparent'
                    : 'rgba(0, 0, 0, 0.3)',
                  opacity: isCurrentMonth(day) ? 1 : 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={isToday(day) ? 700 : 500}
                  color={
                    isToday(day)
                      ? 'primary.main'
                      : dayOfWeek === 0
                        ? 'error.main'
                        : dayOfWeek === 6
                          ? 'info.main'
                          : 'text.primary'
                  }
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  {day.date()}
                </Typography>

                {/* 예약 목록 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {dayReservations.slice(0, 3).map((reservation) => (
                    <Tooltip
                      key={reservation.id}
                      title={`${reservation.ownerName} - ${reservation.building} ${reservation.unit} (${reservation.timeSlot})`}
                      arrow
                    >
                      <Chip
                        label={reservation.elevatorLine}
                        size="small"
                        onClick={() => onReservationClick(reservation)}
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          backgroundColor: ELEVATOR_LINE_COLORS[reservation.elevatorLine],
                          color: 'white',
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                  {dayReservations.length > 3 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.65rem' }}
                    >
                      +{dayReservations.length - 3}건
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* 범례 */}
      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
          승강기 라인:
        </Typography>
        {(Object.keys(ELEVATOR_LINE_COLORS) as ElevatorLine[]).map((line) => (
          <Box key={line} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: ELEVATOR_LINE_COLORS[line],
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {line}라인
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
