import { Link } from 'react-router-dom'
import { type Building, type Level, levelOf } from '../data/mock'
import { cx } from './ui'

const MAP_SRC = '/images/campus-map.webp'

const CALLOUT_TONE: Record<Level, string> = {
  high: 'border-red-400 text-red-500',
  mid: 'border-amber-400 text-amber-500',
  low: 'border-emerald-500 text-emerald-600',
}

export interface MapPin {
  building: Building
  tone: 'danger' | 'warn' | 'good'
}

interface Props {
  callouts?: Building[]
  pins?: MapPin[]
  linkTo?: (b: Building) => string
  legend?: boolean
  className?: string
}

/** 한밭대 3D 캠퍼스 맵 위에 건물별 사용량 말풍선 또는 경고 핀을 올린다. */
export default function CampusMap({ callouts = [], pins = [], linkTo, legend, className }: Props) {
  return (
    <div className={cx('@container relative aspect-[1670/850] w-full select-none', className)}>
      <img src={MAP_SRC} alt="국립한밭대학교 3D 캠퍼스 맵" className="absolute inset-0 size-full object-contain" draggable={false} />

      {callouts.length > 0 && (
        <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {callouts.map((b) => (
            <line key={b.id} x1={b.x} y1={b.y} x2={b.labelX} y2={b.labelY} stroke="#374151" strokeOpacity={0.7} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      )}

      {callouts.map((b) => {
        const body = (
          <div className={cx('rounded-lg border-2 bg-white/95 px-[0.6cqw] py-[0.3cqw] text-center leading-tight shadow-sm', CALLOUT_TONE[levelOf(b.kw)])}>
            <p className="text-[clamp(8px,1.15cqw,12px)] font-medium whitespace-nowrap text-gray-800">
              {b.name} ({b.code})
            </p>
            <p className="text-[clamp(9px,1.3cqw,13px)] font-semibold">{b.kw.toLocaleString()} kW</p>
          </div>
        )
        return (
          <div key={b.id}>
            <span className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-700 ring-2 ring-white" style={{ left: `${b.x}%`, top: `${b.y}%` }} />
            <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${b.labelX}%`, top: `${b.labelY}%` }}>
              {linkTo ? (
                <Link to={linkTo(b)} className="block transition-transform hover:scale-105">
                  {body}
                </Link>
              ) : (
                body
              )}
            </div>
          </div>
        )
      })}

      {pins.map(({ building: b, tone }) => (
        <span
          key={b.id}
          className={cx(
            'absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-bold text-white shadow-md ring-4',
            tone === 'danger' && 'bg-red-500 ring-red-500/25',
            tone === 'warn' && 'bg-amber-400 ring-amber-400/30',
            tone === 'good' && 'bg-emerald-500 ring-emerald-500/25',
          )}
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          title={`${b.name} (${b.code})`}
        >
          !
        </span>
      ))}

      {legend && (
        <div className="absolute top-2 left-2 rounded-xl border border-gray-200 bg-white/90 px-3 py-2.5 text-xs text-gray-600">
          <p className="mb-1.5">(kW)</p>
          <div className="flex gap-2">
            <span className="h-16 w-2 rounded-full bg-gradient-to-b from-red-400 via-amber-300 to-emerald-400" />
            <span className="flex flex-col justify-between">
              <span>높음</span>
              <span>낮음</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/** 캠퍼스 맵을 확대해서 특정 건물 주변을 썸네일로 보여준다 (건물 사진 대용). */
export function BuildingThumb({ building, className }: { building: Building; className?: string }) {
  return (
    <div className={cx('relative overflow-hidden rounded-xl bg-gray-100', className)} role="img" aria-label={`${building.name} 위치`}>
      <img
        src={MAP_SRC}
        alt=""
        className="absolute top-1/2 left-1/2 w-[400%] max-w-none"
        style={{ transform: `translate(-${building.x}%, -${building.y}%)` }}
        draggable={false}
      />
    </div>
  )
}
