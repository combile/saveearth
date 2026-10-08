import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const CHART = {
  dark: '#02302c',
  mid: '#2f8a5b',
  light: '#9fd0b3',
  grid: '#eef0ef',
  axis: { fontSize: 12, fill: '#8a8f8d' },
}

const tooltipStyle = { borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,.06)' }

/** 단일 계열 막대 (값 라벨 표시) */
export function SimpleBars({ data, x, y, height = 280, unit, tickRender }: { data: object[]; x: string; y: string; height?: number; unit?: string; tickRender?: (v: string) => string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 24, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey={x} tick={CHART.axis} axisLine={false} tickLine={false} tickFormatter={tickRender} />
        <YAxis tick={CHART.axis} axisLine={false} tickLine={false} tickFormatter={(v: number) => v.toLocaleString()} />
        <Tooltip cursor={{ fill: '#f3f6f4' }} contentStyle={tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString()} ${unit ?? ''}`, '사용량']} />
        <Bar dataKey={y} fill={CHART.dark} radius={[3, 3, 0, 0]} maxBarSize={44} isAnimationActive={false}>
          <LabelList dataKey={y} position="top" fontSize={12} fill="#444" formatter={(v) => Number(v).toLocaleString()} />
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
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey={x} tick={CHART.axis} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={16} />
        <YAxis tick={CHART.axis} axisLine={false} tickLine={false} tickFormatter={(v: number) => v.toLocaleString()} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${Number(v).toLocaleString()} ${unit}`, name === y ? '사용량' : '비교']} />
        {compareKey && <Area isAnimationActive={false} type="linear" dataKey={compareKey} stroke="#f59e0b" strokeDasharray="4 4" fill="none" dot={false} strokeWidth={1.5} />}
        <Area isAnimationActive={false} type="linear" dataKey={y} stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={{ r: 3.5, fill: color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/** 여러 계열 묶음 막대 */
export function GroupedBars({ data, x, series, height = 280, labels, unit = 'kWh' }: { data: object[]; x: string; series: { key: string; name: string; color: string }[]; height?: number; labels?: boolean; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 24, right: 8, left: -4, bottom: 0 }} barGap={6}>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey={x} tick={CHART.axis} axisLine={false} tickLine={false} />
        <YAxis tick={CHART.axis} axisLine={false} tickLine={false} tickFormatter={(v: number) => v.toLocaleString()} />
        <Tooltip cursor={{ fill: '#f3f6f4' }} contentStyle={tooltipStyle} formatter={(v) => `${Number(v).toLocaleString()} ${unit}`} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[3, 3, 0, 0]} maxBarSize={40} isAnimationActive={false}>
            {labels && <LabelList dataKey={s.key} position="top" fontSize={11} fill="#555" formatter={(v) => Number(v).toLocaleString()} />}
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
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey={x} tick={CHART.axis} axisLine={false} tickLine={false} />
        <YAxis tick={CHART.axis} axisLine={false} tickLine={false} tickFormatter={(v: number) => v.toLocaleString()} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${Number(v).toLocaleString()} ${unit}`} />
        {series.map((s) => (
          <Line key={s.key} isAnimationActive={false} type="linear" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={{ r: 3.5, fill: s.color, strokeWidth: 0 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Sparkline({ data }: { data: number[] }) {
  return (
    <ResponsiveContainer width={110} height={28}>
      <LineChart data={data.map((v, i) => ({ i, v }))}>
        <Line type="monotone" dataKey="v" stroke={CHART.mid} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function Legend({ items }: { items: { name: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="flex items-center gap-4 text-xs text-gray-600">
      {items.map((i) => (
        <span key={i.name} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} />
          {i.name}
        </span>
      ))}
    </div>
  )
}
