
import {
  Box,
  Paper,
  Typography,
  Button,
  Slide,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';

interface BulkActionBarProps {
  selectedCount: number;
  onStatusChange: () => void;
  onAssigneeChange: () => void;
  onPartnerChange: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onStatusChange,
  onAssigneeChange,
  onPartnerChange,
}: BulkActionBarProps) {
  return (
    <Slide direction="up" in={selectedCount > 0} mountOnEnter unmountOnExit>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          p: 2,
          borderRadius: 0,
          borderTop: 2,
          borderColor: 'primary.main',
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            {selectedCount}건 선택됨
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onStatusChange}
              size="medium"
            >
              상태 변경
            </Button>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={onAssigneeChange}
              size="medium"
            >
              담당자 배정
            </Button>
            <Button
              variant="outlined"
              startIcon={<BusinessIcon />}
              onClick={onPartnerChange}
              size="medium"
            >
              협력사 지정
            </Button>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
}
