import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { reducedMotion } from '../motion'
import { theme } from '../theme'

const c = theme.color

export const CHART = {
  dark: c.brand900,
  mid: c.brand700,
  light: c.brand300,
  grid: c.lineSoft,
  axis: { fontSize: 11, fill: c.mute },
}

/** 차트가 그려지는 진입 애니메이션 (모션 최소화 설정이면 끔) */
const anim = { isAnimationActive: !reducedMotion(), animationDuration: 900, animationEasing: 'ease-out' as const }

const grid = { vertical: false, stroke: CHART.grid, strokeDasharray: '2 4' }
const axis = { tick: CHART.axis, axisLine: false, tickLine: false }
const cursorFill = { fill: c.brand100, fillOpacity: 0.5 }
const cursorLine = { stroke: c.line }

const tooltip = {
  contentStyle: { borderRadius: theme.radius.md, border: `1px solid ${c.line}`, background: c.surface, boxShadow: 'none', padding: '8px 12px', fontSize: 12 },
  labelStyle: { marginBottom: 2, fontFamily: theme.font.mono, fontSize: 11, letterSpacing: '0.08em', color: c.mute },
  itemStyle: { padding: 0, color: c.ink, fontVariantNumeric: 'tabular-nums' },
}

const num = (v: unknown) => Number(v).toLocaleString()

/** 단일 계열 막대 (값 라벨 표시) */
export function SimpleBars({ data, x, y, height = 280, unit, tickRender }: { data: object[]; x: string; y: string; height?: number; unit?: string; tickRender?: (v: string) => string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 24, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={x} {...axis} tickFormatter={tickRender} />
        <YAxis {...axis} tickFormatter={num} />
        <Tooltip cursor={cursorFill} {...tooltip} formatter={(v) => [`${num(v)} ${unit ?? ''}`, '사용량']} />
        <Bar dataKey={y} fill={CHART.dark} radius={[4, 4, 0, 0]} maxBarSize={28} {...anim}>
          <LabelList dataKey={y} position="top" fontSize={11} fill={c.sub} formatter={num} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/** 그라데이션 면적 + 점 라인 */
export function AreaTrend({ data, x, y, compareKey, height = 280, color = CHART.mid, unit = 'kWh' }: { data: object[]; x: string; y: string; compareKey?: string; height?: number; color?: string; unit?: string }) {
  const id = `g-${y}-${color.replace('#', '')}`
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 16, right: 12, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey={x} {...axis} interval="preserveStartEnd" minTickGap={16} />
        <YAxis {...axis} tickFormatter={num} />
        <Tooltip cursor={cursorLine} {...tooltip} formatter={(v, name) => [`${num(v)} ${unit}`, name === y ? '사용량' : '비교']} />
        {compareKey && <Area {...anim} type="linear" dataKey={compareKey} stroke={c.warn} strokeDasharray="4 4" fill="none" dot={false} strokeWidth={1.5} />}
        <Area {...anim} type="linear" dataKey={y} stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={{ r: 3, fill: color, strokeWidth: 0 }} activeDot={{ r: 5, stroke: c.surface, strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/** 여러 계열 묶음 막대 */
export function GroupedBars({ data, x, series, height = 280, labels, unit = 'kWh' }: { data: object[]; x: string; series: { key: string; name: string; color: string }[]; height?: number; labels?: boolean; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 24, right: 8, left: -4, bottom: 0 }} barGap={6}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} tickFormatter={num} />
        <Tooltip cursor={cursorFill} {...tooltip} formatter={(v) => `${num(v)} ${unit}`} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={24} {...anim}>
            {labels && <LabelList dataKey={s.key} position="top" fontSize={11} fill={c.sub} formatter={num} />}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

/** 여러 계열 라인 */
export function MultiLine({ data, x, series, height = 280, unit = 'kW' }: { data: object[]; x: string; series: { key: string; name: string; color: string }[]; height?: number; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 16, right: 12, left: -8, bottom: 0 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={x} {...axis} />
        <YAxis {...axis} tickFormatter={num} />
        <Tooltip cursor={cursorLine} {...tooltip} formatter={(v) => `${num(v)} ${unit}`} />
        {series.map((s) => (
          <Line key={s.key} {...anim} type="linear" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={{ r: 3, fill: s.color, strokeWidth: 0 }} activeDot={{ r: 5, stroke: c.surface, strokeWidth: 2 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Sparkline({ data }: { data: number[] }) {
  return (
    <ResponsiveContainer width={110} height={28}>
      <LineChart data={data.map((v, i) => ({ i, v }))}>
        <Line type="monotone" dataKey="v" stroke={CHART.mid} strokeWidth={1.5} dot={false} {...anim} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Legend({ items }: { items: { name: string; color: string; dashed?: boolean }[] }) {
  return (
    <div css={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: c.sub }}>
      {items.map((i) => (
        <span key={i.name} css={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span css={{ width: 10, height: 10, borderRadius: 3 }} style={{ background: i.color }} />
          {i.name}
        </span>
      ))}
    </div>
  )
}
