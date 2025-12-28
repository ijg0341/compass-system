/**
 * 이미지 미리보기 모달
 * 이미지 URL과 이름을 받아 모달로 표시
 */

import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName?: string;
}

export default function ImagePreviewModal({
  open,
  onClose,
  imageUrl,
  imageName = '',
}: ImagePreviewModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          zIndex: 1,
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0 }}>
        <Box
          component="img"
          src={imageUrl}
          alt={imageName}
          sx={{ maxWidth: '100%', maxHeight: '80vh', display: 'block' }}
        />
      </DialogContent>
    </Dialog>
  );
}
