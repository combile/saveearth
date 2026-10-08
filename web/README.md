# 지구를 지켜라 — 한밭대 탄소중립 캠퍼스 대시보드 (웹)

React + Vite + TypeScript + Emotion + GSAP + Material Symbols + Recharts

```bash
npm install
npm run dev      # 로컬 실행
npm run build    # dist/ 정적 빌드 (Vercel/Netlify 등에 그대로 배포 가능)
```

## 구조
- `src/layouts/DashboardLayout.tsx` — 사이드바 + 공통 레이아웃
- `src/pages/` — 화면별 페이지 (대시보드, 전력 소비 시각화 3종, 실시간 예측, 비효율 구역, 강의실 추천, 리포트, 설정, 상세 4종)
- `src/components/` — 공통 UI(`ui.tsx`), 차트(`charts.tsx`), 캠퍼스 맵(`CampusMap.tsx`)
- `src/data/mock.ts` — **더미 데이터**. 백엔드(MQTT/DB) 연동 시 이 파일을 API 호출로 교체
- `public/images/campus-map.webp` — 피그마 '캠퍼스 맵' 프레임의 한밭대 3D 맵 이미지

## 공개 / 관리자
- 사이트는 로그인 없이 공개: 대시보드, 전력 소비 시각화, 실시간 예측, 강의실 추천, 캠퍼스 탄소 절감 현황
- 관리자만 `/admin/login`에서 로그인 → 비효율 구역 분석, 리포트, 데이터 관리, 설정 메뉴가 추가됨
- 인증 서버 연동 전이라 아무 값이나 입력하면 로그인됨 (`src/auth.tsx`) — **배포 전 실제 인증 필요**
- 개발 모드에서는 URL에 `?as=admin`을 붙이면 바로 관리자로 로그인됨 (배포 빌드에는 미포함)
