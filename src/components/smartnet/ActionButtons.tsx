
import { Box, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface ActionButtonsProps {
  onSave: () => void;
  isFormValid: boolean;
  isSaving: boolean;
}

export default function ActionButtons({
  onSave,
  isFormValid,
  isSaving,
}: ActionButtonsProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
      <Button
        variant="contained"
        size="medium"
        startIcon={<SaveIcon />}
        onClick={onSave}
        disabled={!isFormValid || isSaving}
      >
        {isSaving ? '저장 중...' : '저장'}
      </Button>
    </Box>
  );
}
