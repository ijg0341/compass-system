/**
 * 제출서류 보기 모달
 */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';

interface FileInfo {
  url: string;
  name: string;
}

interface VoteDocumentModalProps {
  open: boolean;
  onClose: () => void;
  document: Record<string, unknown> | null;
  memberName: string;
}

export default function VoteDocumentModal({
  open,
  onClose,
  document,
  memberName,
}: VoteDocumentModalProps) {
  // vote_document에서 URL 목록 추출
  const getFileList = (): FileInfo[] => {
    if (!document) return [];

    const results: FileInfo[] = [];

    // 객체의 모든 값을 순회하면서 URL 찾기
    const extractUrls = (obj: unknown): void => {
      if (!obj) return;

      if (typeof obj === 'string') {
        // URL 형태인지 확인
        if (obj.startsWith('http://') || obj.startsWith('https://')) {
          results.push({ url: obj, name: obj.split('/').pop() || '제출서류' });
        } else {
          // JSON 문자열일 수 있음
          try {
            const parsed = JSON.parse(obj);
            extractUrls(parsed);
          } catch {
            // 일반 문자열
          }
        }
        return;
      }

      if (Array.isArray(obj)) {
        obj.forEach((item) => extractUrls(item));
        return;
      }

      if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach((value) => extractUrls(value));
      }
    };

    extractUrls(document);
    return results;
  };

  const files = getFileList();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: '#1a1a1a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          제출서류 - {memberName}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {files.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">제출된 서류가 없습니다.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {files.map((file, index) => (
              <Box
                key={index}
                component="a"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <FileIcon sx={{ color: 'primary.main' }} />
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  열기
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
