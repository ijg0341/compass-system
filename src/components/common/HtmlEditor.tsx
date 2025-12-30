/**
 * HTML 에디터 컴포넌트 (React Quill 기반)
 */
import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = lazy(() => import('react-quill-new'));

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

// Quill 모듈 설정
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link',
];

export default function HtmlEditor({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  minHeight = 200,
}: HtmlEditorProps) {
  const [isReady, setIsReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);

  useEffect(() => {
    // Quill 로드 확인
    import('react-quill-new').then(() => {
      setIsReady(true);
    });
  }, []);

  return (
    <Box
      sx={{
        '& .quill': {
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(26, 26, 26, 0.7)',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: 'divider',
        },
        '& .ql-toolbar': {
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(245, 245, 245, 0.9)'
              : 'rgba(26, 26, 26, 0.5)',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
        '& .ql-container': {
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
          minHeight: `${minHeight}px`,
          fontSize: '0.875rem',
        },
        '& .ql-editor': {
          minHeight: `${minHeight}px`,
        },
        '& .ql-editor.ql-blank::before': {
          color: 'text.secondary',
          fontStyle: 'normal',
        },
        // 라이트 모드 스타일
        '& .ql-stroke': {
          stroke: (theme) =>
            theme.palette.mode === 'light' ? '#333' : '#EDEDED',
        },
        '& .ql-fill': {
          fill: (theme) =>
            theme.palette.mode === 'light' ? '#333' : '#EDEDED',
        },
        '& .ql-picker-label': {
          color: (theme) =>
            theme.palette.mode === 'light' ? '#333' : '#EDEDED',
        },
        '& .ql-picker-options': {
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#fff' : '#2a2a2a',
        },
      }}
    >
      {isReady ? (
        <Suspense
          fallback={
            <Box
              sx={{
                minHeight: `${minHeight + 42}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '4px',
              }}
            >
              <CircularProgress size={24} />
            </Box>
          }
        >
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
          />
        </Suspense>
      ) : (
        <Box
          sx={{
            minHeight: `${minHeight + 42}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '4px',
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
}
