import { useCallback, useRef, lazy, Suspense, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import type { SmartnetContent } from '@/src/types/smartnet';
import 'react-quill-new/dist/quill.snow.css';

// Quill을 lazy import로 로드
const ReactQuill = lazy(() => import('react-quill-new'));

// Quill Divider Blot 등록 상태
let quillInitialized = false;

interface ContentEditorProps {
  content: SmartnetContent;
  onChange: (content: SmartnetContent) => void;
}

export default function ContentEditor({ content, onChange }: ContentEditorProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);
  const [isQuillReady, setIsQuillReady] = useState(false);

  // Quill Divider Blot 등록
  useEffect(() => {
    if (!quillInitialized) {
      import('react-quill-new').then((mod) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const QuillInstance = (mod as any).Quill;
        if (QuillInstance) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const BlockEmbed = QuillInstance.import('blots/block/embed') as any;

          class DividerBlot extends BlockEmbed {
            static blotName = 'divider';
            static tagName = 'hr';
          }

          QuillInstance.register(DividerBlot);
          quillInitialized = true;
        }
        setIsQuillReady(true);
      });
    } else {
      setIsQuillReady(true);
    }
  }, []);

  // 구분선 삽입 핸들러
  const insertDivider = useCallback(() => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      if (range) {
        editor.insertEmbed(range.index, 'divider', true, 'user');
        editor.setSelection(range.index + 1);
      }
    }
  }, []);

  // 제목 변경
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...content, title: e.target.value });
  }, [content, onChange]);

  // 내용 변경 (Quill)
  const handleDescriptionChange = useCallback((value: string) => {
    onChange({ ...content, description: value });
  }, [content, onChange]);

  // 이미지 업로드 공통 함수
  const handleImageUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'main'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일만 허용
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하만 가능합니다.');
        return;
      }

      // base64로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          onChange({ ...content, logoImage: reader.result as string });
        } else {
          onChange({ ...content, mainImage: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [content, onChange]);

  // 로고 이미지 삭제
  const handleLogoRemove = useCallback(() => {
    onChange({ ...content, logoImage: null });
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  }, [content, onChange]);

  // 메인 이미지 삭제
  const handleMainImageRemove = useCallback(() => {
    onChange({ ...content, mainImage: null });
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  }, [content, onChange]);

  // 로고 업로드 버튼 클릭
  const handleLogoUploadClick = () => {
    logoInputRef.current?.click();
  };

  // 메인 이미지 업로드 버튼 클릭
  const handleMainImageUploadClick = () => {
    mainImageInputRef.current?.click();
  };

  // Quill 모듈 설정
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['divider'],
        ['clean'],
      ],
      handlers: {
        divider: insertDivider,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        컨텐츠 정보
      </Typography>

      {/* 제목 */}
      <TextField
        fullWidth
        label="제목"
        value={content.title}
        onChange={handleTitleChange}
        placeholder="예: 2024년 하반기 방문예약"
        size="small"
        sx={{ mb: 3 }}
      />

      {/* 내용 (Quill 에디터) */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
          내용
        </Typography>
        <Box
          sx={{
            '& .quill': {
              backgroundColor: 'rgba(26, 26, 26, 0.7)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            '& .ql-toolbar': {
              backgroundColor: 'rgba(26, 26, 26, 0.5)',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            },
            '& .ql-container': {
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              minHeight: '300px',
              fontSize: '13.5px',
              color: '#EDEDED',
            },
            '& .ql-editor': {
              minHeight: '300px',
            },
            '& .ql-editor.ql-blank::before': {
              color: '#B3B3B3',
            },
            '& .ql-editor hr': {
              border: 'none',
              borderTop: '2px solid rgba(255, 255, 255, 0.2)',
              margin: '16px 0',
              height: '0',
            },
            '& .ql-stroke': {
              stroke: '#EDEDED',
            },
            '& .ql-fill': {
              fill: '#EDEDED',
            },
            '& .ql-picker-label': {
              color: '#EDEDED',
            },
            // 구분선 버튼 아이콘 추가
            '& .ql-toolbar .ql-divider': {
              width: '28px !important',
            },
            '& .ql-toolbar .ql-divider::before': {
              content: '"—"',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#EDEDED',
            },
            '& .ql-toolbar .ql-divider:hover::before': {
              color: '#E63C2E',
            },
          }}
        >
          {isQuillReady ? (
            <Suspense fallback={<Box sx={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content.description}
                onChange={handleDescriptionChange}
                modules={modules}
                placeholder="내용을 입력하세요..."
              />
            </Suspense>
          ) : (
            <Box sx={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>
          )}
        </Box>
      </Box>

      {/* 이미지 업로드 영역 */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* 로고 이미지 */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            로고 이미지
          </Typography>

          {content.logoImage ? (
            <Paper
              sx={{
                p: 2,
                position: 'relative',
                background: 'rgba(26, 26, 26, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton
                size="small"
                onClick={handleLogoRemove}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <Box
                component="img"
                src={content.logoImage}
                alt="로고 이미지"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 100,
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </Paper>
          ) : (
            <>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'logo')}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={<BrandingWatermarkIcon />}
                onClick={handleLogoUploadClick}
                size="small"
              >
                로고 업로드
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                최대 5MB
              </Typography>
            </>
          )}
        </Box>

        {/* 메인 이미지 */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            메인 이미지
          </Typography>

          {content.mainImage ? (
            <Paper
              sx={{
                p: 2,
                position: 'relative',
                background: 'rgba(26, 26, 26, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton
                size="small"
                onClick={handleMainImageRemove}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <Box
                component="img"
                src={content.mainImage}
                alt="메인 이미지"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </Paper>
          ) : (
            <>
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'main')}
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                onClick={handleMainImageUploadClick}
                size="small"
              >
                이미지 업로드
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                최대 5MB
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
