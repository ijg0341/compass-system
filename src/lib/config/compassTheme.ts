
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { koKR } from '@mui/material/locale';

/**
 * =====================================================================
 * Compass Design System - Theme Configuration
 * =====================================================================
 *
 * ## 디자인 원칙
 * - 컴팩트/정보 밀도 높은 레이아웃 (Joyful Density)
 * - 무채색 중심, 레드(#C44233) 포인트
 * - 1px 미세 보더, 섀도우 최소화
 * - 8px 라운딩, 8px 그리드 시스템
 * - 접근성 대비 기준(AA) 준수
 *
 * ## 디자인 토큰
 */

// =====================================================================
// Color Tokens
// =====================================================================
const COLOR_TOKENS = {
  // Primary (로고 레드) - 채도 및 명암 대비 강화
  primary: {
    main: '#E63C2E',      // 메인 레드 (채도+명도 up)
    light: '#FF4433',     // 라이터 레드 (호버, 더 밝게)
    dark: '#C42E20',      // 다크 레드 (더 어둡게)
    tonal: '#EDE8E6',     // 토널 배경 (라이트 모드)
    soft: '#FFE3DF',      // 소프트 배경
    contrastText: '#FFFFFF',
    gradient: {
      start: '#FF6B5B',   // 그라데이션 시작 (더 밝게)
      end: '#E63C2E',     // 그라데이션 끝
      dark: '#B82818',    // 어두운 부분 강조
    },
  },

  // Neutral/Gray Scale
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic Colors (채도 및 명암 대비 강화)
  success: {
    main: '#00E676',      // 형광 그린 (Neon Green)
    light: '#69F0AE',     // 라이트 네온 그린
    dark: '#00C853',      // 다크 네온 그린
    gradient: {
      start: '#76FF03',   // 라임 그린 (밝은 형광)
      end: '#00E676',     // 네온 그린
      dark: '#00C853',    // 다크 네온 그린
    },
  },
  warning: {
    main: '#FB8C00',
    light: '#FFB74D',
    dark: '#E65100',
    gradient: {
      start: '#FFC947',   // 더 밝게
      end: '#FB8C00',
      dark: '#E65100',
    },
  },
  error: {
    main: '#E53935',
    light: '#FF5252',
    dark: '#C62828',
    gradient: {
      start: '#FF6E6E',   // 더 밝게
      end: '#E53935',
      dark: '#B71C1C',
    },
  },
  info: {
    main: '#039BE5',
    light: '#29B6F6',
    dark: '#01579B',
    gradient: {
      start: '#4FC3F7',   // 더 밝게
      end: '#039BE5',
      dark: '#01579B',
    },
  },
} as const;

// =====================================================================
// Typography Tokens (Compact)
// =====================================================================
const TYPOGRAPHY_TOKENS = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),

  // 기본 글꼴 크기 (컴팩트)
  fontSize: 13.5,

  // 타이포 스케일
  h1: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.2 },      // 32px
  h2: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.25 },  // 28px
  h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },    // 24px
  h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35 },  // 20px
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },  // 18px
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },      // 16px

  body1: { fontSize: '0.875rem', lineHeight: 1.5 },                // 14px
  body2: { fontSize: '0.8125rem', lineHeight: 1.45 },              // 13px
  caption: { fontSize: '0.75rem', lineHeight: 1.4 },               // 12px
  button: { fontSize: '0.875rem', fontWeight: 500 },               // 14px

  // 숫자 UI용 (tabular-nums)
  tabularNums: {
    fontVariantNumeric: 'tabular-nums',
  },
} as const;

// =====================================================================
// Spacing Tokens (8px Grid, Compact)
// =====================================================================
const SPACING_TOKENS = {
  unit: 8,
  // 컴포넌트 내부 패딩은 -1 step (예: 12→8)
  compact: {
    xs: 4,   // 0.5 * 8
    sm: 8,   // 1 * 8
    md: 12,  // 1.5 * 8
    lg: 16,  // 2 * 8
    xl: 24,  // 3 * 8
  },
} as const;

// =====================================================================
// Shape Tokens
// =====================================================================
const SHAPE_TOKENS = {
  borderRadius: 8,  // 컴팩트 라운드
} as const;

// =====================================================================
// Border Tokens
// =====================================================================
const BORDER_TOKENS = {
  width: {
    thin: '1px',
    medium: '2px',
  },
  style: 'solid',
} as const;

// =====================================================================
// Shadow Tokens (그림자 제거)
// =====================================================================
const SHADOW_TOKENS = {
  card: 'none',
  hover: 'none',
  chart: 'none',
  chartElement: 'none',
  inner: 'none',
} as const;

// =====================================================================
// Chart Tokens (@mui/x-charts)
// =====================================================================
const CHART_TOKENS = {
  line: {
    strokeWidth: 2,
  },
  point: {
    radius: 3.5,
  },
  axis: {
    labelFontSize: 11.5,
    tickFontSize: 11,
  },
  tooltip: {
    fontSize: 13,
  },
} as const;

// =====================================================================
// Light Theme
// =====================================================================
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: COLOR_TOKENS.primary.main,
      light: COLOR_TOKENS.primary.light,
      dark: COLOR_TOKENS.primary.dark,
      contrastText: COLOR_TOKENS.primary.contrastText,
    },
    secondary: {
      main: COLOR_TOKENS.neutral[600],
      light: COLOR_TOKENS.neutral[400],
      dark: COLOR_TOKENS.neutral[800],
    },
    error: COLOR_TOKENS.error,
    warning: COLOR_TOKENS.warning,
    info: COLOR_TOKENS.info,
    success: COLOR_TOKENS.success,
    background: {
      default: '#F8F9FA',       // 약간 더 밝은 배경
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: COLOR_TOKENS.neutral[900],       // #212121
      secondary: COLOR_TOKENS.neutral[700],     // #616161
      disabled: COLOR_TOKENS.neutral[400],
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    grey: COLOR_TOKENS.neutral,
  },

  typography: {
    fontFamily: TYPOGRAPHY_TOKENS.fontFamily,
    fontSize: TYPOGRAPHY_TOKENS.fontSize,
    h1: TYPOGRAPHY_TOKENS.h1,
    h2: TYPOGRAPHY_TOKENS.h2,
    h3: TYPOGRAPHY_TOKENS.h3,
    h4: TYPOGRAPHY_TOKENS.h4,
    h5: TYPOGRAPHY_TOKENS.h5,
    h6: TYPOGRAPHY_TOKENS.h6,
    body1: TYPOGRAPHY_TOKENS.body1,
    body2: TYPOGRAPHY_TOKENS.body2,
    caption: TYPOGRAPHY_TOKENS.caption,
    button: TYPOGRAPHY_TOKENS.button,
  },

  spacing: SPACING_TOKENS.unit,

  shape: {
    borderRadius: SHAPE_TOKENS.borderRadius,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // 글래스모픽을 위한 역동적인 배경 (채도 강화)
          background: `
            radial-gradient(circle at 20% 30%, rgba(230, 60, 46, 0.18) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(3, 155, 229, 0.18) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(67, 160, 71, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 60% 20%, rgba(251, 140, 0, 0.12) 0%, transparent 40%),
            linear-gradient(135deg, #F5F7F8 0%, #E3E7EA 50%, #D6DBE0 100%)
          `,
          minHeight: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(255, 255, 255, 0.08) 100px,
                rgba(255, 255, 255, 0.08) 200px
              )
            `,
            pointerEvents: 'none',
            zIndex: 0,
          },
          // 기본 스크롤바 스타일
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: COLOR_TOKENS.neutral[100],
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: COLOR_TOKENS.neutral[400],
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: COLOR_TOKENS.neutral[500],
            },
          },
        },
        '#__next': {
          position: 'relative',
          zIndex: 1,
        },
      },
    },

    // 버튼 (컴팩트)
    MuiButton: {
      defaultProps: {
        size: 'small',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '6px 12px',
          '&:focus-visible': {
            outline: `2px solid ${COLOR_TOKENS.primary.main}`,
            outlineOffset: '2px',
            opacity: 0.7,
          },
        },
        sizeMedium: {
          padding: '8px 16px',
        },
      },
    },

    // 텍스트 필드 (컴팩트)
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: COLOR_TOKENS.neutral[400],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: COLOR_TOKENS.primary.main,
            borderWidth: '2px',
          },
        },
        input: {
          padding: '8px 12px',
        },
      },
    },

    // 카드 (글래스모픽)
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(255, 255, 255, 0.3)`,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },

    // 테이블 (덴스)
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 12px',
          fontSize: '0.8125rem',
          borderBottom: `1px solid ${COLOR_TOKENS.neutral[200]}`,
        },
        head: {
          fontSize: '0.8125rem',
          fontWeight: 600,
          backgroundColor: COLOR_TOKENS.neutral[50],
          color: COLOR_TOKENS.neutral[800],
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },

    // 리스트 (덴스)
    MuiList: {
      defaultProps: {
        dense: true,
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },

    // 셀렉트
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },

    // 칩 (컴팩트)
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },

    // 아이콘 버튼
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${COLOR_TOKENS.primary.main}`,
            outlineOffset: '2px',
            opacity: 0.7,
          },
        },
      },
    },

    // Drawer
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${COLOR_TOKENS.neutral[200]}`,
        },
      },
    },

    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: SHADOW_TOKENS.card,
          borderBottom: `1px solid ${COLOR_TOKENS.neutral[200]}`,
        },
      },
    },
  },
};

// =====================================================================
// Dark Theme
// =====================================================================
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: COLOR_TOKENS.primary.light,         // 다크모드에선 밝은 레드
      light: '#FF6E5E',
      dark: COLOR_TOKENS.primary.main,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: COLOR_TOKENS.neutral[400],
      light: COLOR_TOKENS.neutral[300],
      dark: COLOR_TOKENS.neutral[600],
    },
    error: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FFB74D',
      light: '#FFD54F',
      dark: '#FF9800',
    },
    info: {
      main: '#4FC3F7',
      light: '#81D4FA',
      dark: '#0288D1',
    },
    success: {
      main: '#81C784',
      light: '#A5D6A7',
      dark: '#4CAF50',
    },
    background: {
      default: '#0A0A0A',                       // 더 어두운 배경
      paper: 'rgba(26, 26, 26, 0.9)',
    },
    text: {
      primary: '#EDEDED',
      secondary: '#B3B3B3',
      disabled: COLOR_TOKENS.neutral[600],
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    grey: COLOR_TOKENS.neutral,
  },

  typography: {
    fontFamily: TYPOGRAPHY_TOKENS.fontFamily,
    fontSize: TYPOGRAPHY_TOKENS.fontSize,
    h1: TYPOGRAPHY_TOKENS.h1,
    h2: TYPOGRAPHY_TOKENS.h2,
    h3: TYPOGRAPHY_TOKENS.h3,
    h4: TYPOGRAPHY_TOKENS.h4,
    h5: TYPOGRAPHY_TOKENS.h5,
    h6: TYPOGRAPHY_TOKENS.h6,
    body1: TYPOGRAPHY_TOKENS.body1,
    body2: TYPOGRAPHY_TOKENS.body2,
    caption: TYPOGRAPHY_TOKENS.caption,
    button: TYPOGRAPHY_TOKENS.button,
  },

  spacing: SPACING_TOKENS.unit,

  shape: {
    borderRadius: SHAPE_TOKENS.borderRadius,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // 다크모드 글래스모픽을 위한 역동적인 배경 (채도 강화)
          background: `
            radial-gradient(circle at 20% 30%, rgba(230, 60, 46, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(3, 155, 229, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(67, 160, 71, 0.20) 0%, transparent 50%),
            radial-gradient(circle at 60% 20%, rgba(251, 140, 0, 0.18) 0%, transparent 40%),
            linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #121212 100%)
          `,
          minHeight: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(255, 255, 255, 0.02) 100px,
                rgba(255, 255, 255, 0.02) 200px
              )
            `,
            pointerEvents: 'none',
            zIndex: 0,
          },
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1A1A1A',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#404040',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#4F4F4F',
            },
          },
        },
        '#__next': {
          position: 'relative',
          zIndex: 1,
        },
      },
    },

    MuiButton: {
      defaultProps: {
        size: 'small',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '6px 12px',
          '&:focus-visible': {
            outline: `2px solid ${COLOR_TOKENS.primary.light}`,
            outlineOffset: '2px',
            opacity: 0.7,
          },
        },
        sizeMedium: {
          padding: '8px 16px',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: COLOR_TOKENS.primary.light,
            borderWidth: '2px',
          },
        },
        input: {
          padding: '8px 12px',
        },
      },
    },

    // 카드 (글래스모픽 - 다크모드)
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },

    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 12px',
          fontSize: '0.8125rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
        head: {
          fontSize: '0.8125rem',
          fontWeight: 600,
          backgroundColor: '#1F1F1F',
          color: '#EDEDED',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },

    MuiList: {
      defaultProps: {
        dense: true,
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },

    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${COLOR_TOKENS.primary.light}`,
            outlineOffset: '2px',
            opacity: 0.7,
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
  },
};

// =====================================================================
// Theme Export
// =====================================================================
export const lightTheme = createTheme(lightThemeOptions, koKR);
export const darkTheme = createTheme(darkThemeOptions, koKR);

// 디자인 토큰 export (컴포넌트에서 직접 사용 가능)
export {
  COLOR_TOKENS,
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  SHAPE_TOKENS,
  BORDER_TOKENS,
  SHADOW_TOKENS,
  CHART_TOKENS,
};

/**
 * =====================================================================
 * 사용 가이드
 * =====================================================================
 *
 * ## 테마 사용
 * ```tsx
 * import { lightTheme, darkTheme } from '@/lib/config/compassTheme';
 * import { ThemeProvider } from '@mui/material/styles';
 *
 * <ThemeProvider theme={darkTheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * ## 디자인 토큰 사용
 * ```tsx
 * import { COLOR_TOKENS, TYPOGRAPHY_TOKENS } from '@/lib/config/compassTheme';
 *
 * <Box sx={{
 *   color: COLOR_TOKENS.primary.main,
 *   fontSize: TYPOGRAPHY_TOKENS.body1.fontSize,
 * }} />
 * ```
 *
 * ## 컴포넌트 기본 설정
 * - Button: size="small", disableElevation
 * - TextField, Select: size="small"
 * - Table, List: dense 모드
 * - Chip: size="small"
 *
 * ## 차트 스타일링 (@mui/x-charts)
 * ```tsx
 * import { CHART_TOKENS } from '@/lib/config/compassTheme';
 *
 * <LineChart
 *   series={[{ data, strokeWidth: CHART_TOKENS.line.strokeWidth }]}
 *   sx={{
 *     '.MuiChartsAxis-label': {
 *       fontSize: CHART_TOKENS.axis.labelFontSize,
 *     },
 *   }}
 * />
 * ```
 *
 * ## 숫자 UI (tabular-nums)
 * ```tsx
 * <Typography sx={{ fontVariantNumeric: 'tabular-nums' }}>
 *   12,345.6
 * </Typography>
 * ```
 *
 * =====================================================================
 */
