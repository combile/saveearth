// 화면 구성용 더미 데이터. 백엔드(MQTT/DB) 연동 시 이 파일만 API 호출로 교체하면 된다.

export type Level = 'high' | 'mid' | 'low'

export interface Building {
  id: string
  code: string
  name: string
  /** 캠퍼스 맵 이미지 기준 건물 위치 (%) */
  x: number
  y: number
  /** 말풍선 중심 위치 (%) — 서로 겹치지 않게 띄워 두고 건물과 선으로 잇는다 */
  labelX: number
  labelY: number
  /** 실시간 사용량 (kW) */
  kw: number
  /** 이번 달 누적 사용량 (kWh) */
  monthKwh: number
  /** 전월 대비 증감 (%) — 음수면 감소 */
  delta: number
  area: number
  builtYear: number
  usage: string
  trend: number[]
}

export const BUILDINGS: Building[] = [
  { id: 'n4', code: 'N4', name: '산업정보관', x: 39.6, y: 55.6, labelX: 29, labelY: 50, kw: 1380, monthKwh: 12542, delta: -6.4, area: 12345, builtYear: 2015, usage: '교육연구시설', trend: [5, 6, 5, 7, 6, 8, 6, 5, 7, 6] },
  { id: 's1', code: 'S1', name: '도서관', x: 47.4, y: 53.4, labelX: 45, labelY: 34, kw: 1170, monthKwh: 10935, delta: -5.1, area: 15120, builtYear: 2003, usage: '도서관', trend: [4, 5, 6, 5, 7, 6, 5, 6, 5, 6] },
  { id: 'n3', code: 'N3', name: '전기전자관', x: 43.1, y: 62.6, labelX: 43, labelY: 77, kw: 920, monthKwh: 8104, delta: -7.8, area: 9870, builtYear: 2008, usage: '교육연구시설', trend: [6, 5, 5, 4, 5, 6, 5, 4, 5, 5] },
  { id: 's6', code: 'S6', name: '공동실습관(1)', x: 60.8, y: 58.7, labelX: 58, labelY: 40, kw: 680, monthKwh: 6623, delta: -3.6, area: 7420, builtYear: 2011, usage: '실습시설', trend: [4, 5, 6, 7, 6, 5, 6, 5, 6, 5] },
  { id: 'n5', code: 'N5', name: '자동화관', x: 38.7, y: 63.0, labelX: 27, labelY: 66, kw: 610, monthKwh: 4703, delta: -2.1, area: 6210, builtYear: 2006, usage: '교육연구시설', trend: [5, 4, 5, 6, 5, 7, 5, 4, 5, 5] },
  { id: 's8', code: 'S8', name: '건설공학관', x: 67.9, y: 55.5, labelX: 71, labelY: 29, kw: 520, monthKwh: 3472, delta: -1.3, area: 5980, builtYear: 2004, usage: '교육연구시설', trend: [5, 5, 4, 5, 6, 5, 4, 5, 5, 4] },
  { id: 's5', code: 'S5', name: '산학연협동관', x: 74.9, y: 56.7, labelX: 85, labelY: 60, kw: 390, monthKwh: 3120, delta: 1.2, area: 4870, builtYear: 2012, usage: '산학협력시설', trend: [4, 4, 5, 4, 5, 5, 6, 5, 5, 6] },
  { id: 's3', code: 'S3', name: '경상학관', x: 66.6, y: 65.1, labelX: 66, labelY: 81, kw: 390, monthKwh: 2984, delta: -0.8, area: 5230, builtYear: 2001, usage: '교육연구시설', trend: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4] },
  { id: 's10', code: 'S10', name: '디자인관', x: 73.8, y: 50.1, labelX: 85, labelY: 43, kw: 370, monthKwh: 2810, delta: -2.6, area: 4410, builtYear: 2009, usage: '교육연구시설', trend: [4, 5, 4, 4, 5, 4, 5, 4, 4, 5] },
]

export const getBuilding = (id: string) => BUILDINGS.find((b) => b.id === id)

export const levelOf = (kw: number): Level => (kw >= 900 ? 'high' : kw >= 500 ? 'mid' : 'low')

export const CAMPUS_TOTAL_KW = 8350
export const LAST_UPDATED = '2026.04.28 14:00'

export const DASHBOARD_KPIS = [
  { key: 'now', label: '현재 총 전력 사용량', value: '2,342', unit: 'kW', compare: '전일 대비', delta: -6.4 },
  { key: 'today', label: '오늘 누적 전력 사용량', value: '56,782', unit: 'kWh', compare: '전일 대비', delta: -8.1 },
  { key: 'month', label: '이번 달 누적 사용량', value: '1,256,890', unit: 'kWh', compare: '전월 대비', delta: -5.7 },
  { key: 'carbon', label: '이번 달 탄소 배출량', value: '583', unit: 'tCO₂', compare: '전월 대비', delta: -4.9 },
] as const

export const CARBON_SAVING = { today: 32.6, trees: 5.2, progress: 46 }

/** 00시~23시 시간대별 사용량 (kWh) */
export const HOURLY = [640, 520, 450, 430, 470, 560, 880, 1020, 1190, 1560, 1700, 1720, 1640, 1350, 1842, 1810, 1700, 1640, 1790, 1530, 1300, 1260, 1050, 820].map(
  (kwh, h) => ({ hour: `${String(h).padStart(2, '0')}:00`, kwh, avg: Math.round(kwh * (0.86 + ((h * 7) % 5) * 0.05)) }),
)

export const HOURLY_COMPARE = ['00시', '04시', '08시', '12시', '16시', '20시'].map((label, i) => ({
  label,
  mon: [520, 260, 600, 640, 590, 560][i],
  wed: [480, 240, 560, 700, 620, 510][i],
  fri: [380, 220, 450, 610, 520, 430][i],
}))

export const SEASONAL = [
  { season: '봄 (3~5월)', cur: 18562, prev: 17645 },
  { season: '여름 (6~8월)', cur: 26981, prev: 25210 },
  { season: '가을 (9~11월)', cur: 19234, prev: 18662 },
  { season: '겨울 (12~2월)', cur: 23105, prev: 21087 },
]

/** 건물 상세용 일별 사용량 */
export const DAILY = ['04.01', '04.03', '04.05', '04.07', '04.09', '04.11', '04.13', '04.15', '04.17', '04.19', '04.21', '04.23', '04.25', '04.27'].map((d, i) => ({
  date: d,
  kwh: [460, 490, 470, 450, 540, 510, 480, 460, 580, 470, 500, 530, 610, 480][i],
  prev: [520, 540, 500, 530, 560, 570, 520, 540, 590, 520, 560, 560, 640, 540][i],
}))

/** 실시간 예측 (kW): 현재 / 1시간 후 / 3시간 후 */
export const FORECAST = BUILDINGS.slice(0, 6).map((b, i) => ({
  name: b.code,
  now: b.kw,
  h1: Math.round(b.kw * [1.08, 0.96, 1.05, 1.1, 0.94, 1.02][i]),
  h3: Math.round(b.kw * [1.24, 0.88, 1.12, 1.18, 0.9, 0.97][i]),
}))

export const FORECAST_SUMMARY = [
  { label: '현재 총 사용량', value: '6,430 kW' },
  { label: '예측 총 사용량 (1시간 후)', value: '6,812 kW' },
  { label: '예측 총 사용량 (3시간 후)', value: '7,264 kW' },
  { label: '전력 예비율', value: '18.6% (양호)' },
]

export const REALTIME_TREND = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'].map((t, i) => ({
  time: t,
  kw: [1020, 1180, 1160, 1120, 1190, 1250, 1180, 1240, 1300, 1230, 1340, 1410, 1380][i],
}))

export const INEFFICIENT = [
  { rank: 1, buildingId: 'n4', place: 'N4동 2층 강의실', ratio: 142, status: 'danger' as const },
  { rank: 2, buildingId: 'n3', place: 'N3동 5층 복도', ratio: 128, status: 'danger' as const },
  { rank: 3, buildingId: 's6', place: 'S6동 실험실', ratio: 118, status: 'warn' as const },
  { rank: 4, buildingId: 's8', place: 'S8동 제도실', ratio: 112, status: 'warn' as const },
  { rank: 5, buildingId: 's10', place: 'S10동 로비', ratio: 107, status: 'good' as const },
]

export const CLASSROOMS = [
  { id: 'n5-404', buildingId: 'n5', room: 'N5동 404호', walk: 3, efficiency: '상위 5%', expectKwh: 150, capacity: 70, floor: 4, facilities: '빔프로젝터, 냉난방' },
  { id: 's1-203', buildingId: 's1', room: 'S1동 203호', walk: 5, efficiency: '상위 10%', expectKwh: 162, capacity: 60, floor: 2, facilities: '전자칠판, 냉난방' },
  { id: 's3-302', buildingId: 's3', room: 'S3동 302호', walk: 6, efficiency: '상위 15%', expectKwh: 175, capacity: 80, floor: 3, facilities: '빔프로젝터, 마이크' },
]

export const REPORTS = [
  { title: '2026년 3월 요약 리포트', date: '2026.04.01' },
  { title: '2026년 1분기 전력 사용 리포트', date: '2026.04.01' },
  { title: '2025년 연간 탄소 배출 리포트', date: '2026.01.10' },
]

export interface User {
  id: string
  name: string
  dept: string
  email: string
  phone: string
}

/** 데모 관리자 계정 — 실제 인증 연동 전까지 사용 */
export const DEMO_ADMIN: User = { id: 'admin', name: '김관리', dept: '시설관리팀', email: 'facility@hanbat.ac.kr', phone: '042-821-0000' }

/** 캠퍼스 탄소 절감 현황 (공개) */
export const CAMPUS_CARBON = {
  monthSavedT: 4.2,
  trees: 638,
  yoy: -7.4,
  recommendUses: 1286,
  monthly: [
    { month: '11월', saved: 2.4 },
    { month: '12월', saved: 2.9 },
    { month: '1월', saved: 1.8 },
    { month: '2월', saved: 2.1 },
    { month: '3월', saved: 3.6 },
    { month: '4월', saved: 4.2 },
  ],
  breakdown: [
    { name: '효율 강의실 배정', value: 1.9 },
    { name: '이동 동선 단축', value: 1.2 },
    { name: '피크 시간 분산', value: 1.1 },
  ],
  buildingRank: [
    { code: 'S1', name: '도서관', saved: 812, yoy: -11.2 },
    { code: 'N4', name: '산업정보관', saved: 764, yoy: -9.8 },
    { code: 'N3', name: '전기전자관', saved: 593, yoy: -8.1 },
    { code: 'S6', name: '공동실습관(1)', saved: 421, yoy: -6.4 },
    { code: 'S8', name: '건설공학관', saved: 388, yoy: -5.9 },
  ],
}

/** 데이터 관리 — S8동 3층 분전반 실측 구성 (중간 발표 3~7p) */
export const MQTT_INFO = { broker: 'broker.hivemq.com', topic: 'hnu/s8/power/data', interval: '5초' }

export const SENSORS = [
  ...['R', 'S', 'T'].map((p, i) => ({ id: `CT-M${p}`, circuit: `메인 ${p}상`, type: '분전반 메인', status: 'online' as const, value: [8.42, 7.95, 8.11][i] })),
  ...[1, 2, 3, 4].map((n, i) => ({ id: `CT-L${n}`, circuit: `전등 ${n}`, type: '조명', status: (n === 3 ? 'offline' : 'online') as 'online' | 'offline', value: n === 3 ? null : [1.21, 1.08, 0, 0.96][i] })),
  ...[1, 2, 4, 7].map((n, i) => ({ id: `CT-P${n}`, circuit: `전열 ${n}`, type: '플러그 부하', status: 'online' as const, value: [2.34, 1.87, 3.02, 0.74][i] })),
]

export const DATA_SOURCES = [
  { building: 'S8 건설공학관 3층', source: '아두이노 실측 (ESP32 + PZEM-004T)', unit: '회로별 · 5초', lastSync: '2026.04.28 14:00:05', status: 'ok' as const },
  { building: '교내 전체 건물', source: '학교 자체 계측 시스템 (후처리 자료)', unit: '건물별 · 1시간', lastSync: '2026.04.27 23:00', status: 'pending' as const },
  { building: '강의실 예약 / 학사 시간표', source: '학사 시스템 API (연동 예정)', unit: '강의실별', lastSync: '-', status: 'none' as const },
]

export const UPLOADS = [
  { file: 's8_3f_20260428.csv', rows: 17280, date: '2026.04.28 09:12', by: '김관리' },
  { file: 's8_3f_20260427.csv', rows: 17280, date: '2026.04.27 09:05', by: '김관리' },
  { file: 'campus_building_2026_03.csv', rows: 6696, date: '2026.04.02 15:40', by: '김관리' },
]
