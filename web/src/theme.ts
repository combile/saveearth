/* Hallmark · v2.0.0 · redesign: restyle · shape: app screen · theme: brand (night + lime, Pretendard; 프로젝트가 고른 색이라 유지) · scope: app, 17 screens */
/* critique: 브랜드는 이미 절제돼 있었다. 하드코딩 색을 토큰으로 모으고, 로드 때 장식 모션을 걷고, 컨트롤 높이를 36px로 맞춘다 */
import { css } from '@emotion/react'

/** 다크 면 위의 흰색 / 사진 위 덮개. 알파만 바꿔 쓰는 토큰 */
const onDark = (a: number) => `rgba(255, 255, 255, ${a})`
const scrim = (a: number) => `rgba(8, 12, 10, ${a})`

/** 디자인 토큰. 연회색 배경 + 테두리 없는 흰 카드, 거의 검정인 사이드바, 라임 포인트 */
export const theme = {
  color: {
    bg: '#f4f5f4',
    surface: '#ffffff',
    ink: '#141615',
    sub: '#6b706d',
    mute: '#a3a7a3',
    line: '#e9ebe9',
    lineSoft: '#f2f3f2',
    /** 사이드바 */
    night: '#101312',
    nightSoft: '#1b1f1d',
    /** 다크 패널 위 글자·선 */
    nightInk: '#ffffff',
    nightSub: onDark(0.6),
    nightLine: onDark(0.1),
    nightHover: onDark(0.05),
    brand900: '#02302c',
    brand800: '#0a4136',
    brand700: '#0d6b43',
    brand600: '#16776e',
    brand300: '#7cb69e',
    brand100: '#e7f3ec',
    olive: '#5c6e21',
    lime: '#c5f04a',
    limeHover: '#b5e335',
    /** 차트 비교 계열 (예측 1시간·3시간, 배지 파랑) */
    seriesBlue: '#5b8def',
    seriesOrange: '#f97316',
    indigo: '#5b63d3',
    danger: '#e5484d',
    dangerSoft: '#fdecec',
    warn: '#e0a100',
    warnSoft: '#fdf5dc',
    good: '#00a862',
    goodSoft: '#e3f6ec',
  },
  /** 계절 차트 4색 (봄·여름·가을·겨울) */
  season: ['#5fae86', '#2f8a5b', '#8cc7a6', '#b9dcc8'],
  onDark,
  scrim,
  /** 떠 있는 목록·메뉴에만 쓰는 그림자 */
  shadow: { pop: `0 8px 24px ${scrim(0.08)}` },
  /** 컨트롤 높이 (앱 화면 32~40px 범위) */
  control: 36,
  radius: { sm: 6, md: 10, lg: 14, pill: 999 },
  font: {
    sans: "'Pretendard Variable', 'Pretendard', system-ui, sans-serif",
    /** 숫자·마이크로 라벨용 */
    mono: "ui-monospace, 'SF Mono', Menlo, monospace",
  },
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** 반응형 브레이크포인트 (min-width) */
  mq: { sm: '@media (min-width: 640px)', md: '@media (min-width: 768px)', lg: '@media (min-width: 1024px)', xl: '@media (min-width: 1280px)', xxl: '@media (min-width: 1536px)' },
} as const

/** 작은 회색 라벨 (표 헤더, 단위, 보조 설명 등) */
export const eyebrow = css({
  fontSize: 12,
  fontWeight: 500,
  color: theme.color.mute,
})

/** 큰 숫자: 고정폭 숫자 + 타이트한 자간 */
export const bigNumber = css({
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '-0.03em',
  fontWeight: 700,
  lineHeight: 1.05,
})

/** Tailwind preflight 대체 리셋 + 전역 스타일 */
export const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid ${theme.color.line};
  }
  html {
    -webkit-text-size-adjust: 100%;
  }
  body {
    font-family: ${theme.font.sans};
    font-size: 14px;
    line-height: 1.5;
    background: ${theme.color.bg};
    color: ${theme.color.ink};
    -webkit-font-smoothing: antialiased;
  }
  h1,
  h2,
  h3,
  h4 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  button,
  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
    background: transparent;
  }
  button {
    cursor: pointer;
  }
  img,
  svg {
    display: block;
    max-width: 100%;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  ul,
  ol {
    list-style: none;
  }
  :focus-visible {
    outline: 2px solid ${theme.color.brand600};
    outline-offset: 2px;
  }
  ::selection {
    background: ${theme.color.lime};
    color: ${theme.color.brand900};
  }
  .material-symbols-rounded {
    font-size: 20px;
    line-height: 1;
    flex-shrink: 0;
    user-select: none;
    transition: font-variation-settings 0.25s ${theme.ease};
  }
`
