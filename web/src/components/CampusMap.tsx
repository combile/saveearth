import { css, keyframes } from '@emotion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { type Building, type Level, levelOf } from '../data/mock'
import { theme } from '../theme'

const MAP_SRC = '/images/campus-map.webp'

const c = theme.color

const CALLOUT_TONE: Record<Level, string> = { high: c.danger, mid: c.warn, low: c.good }
const PIN_TONE = { danger: c.danger, warn: c.warn, good: c.good }

const pulse = keyframes({ from: { transform: 'scale(1)', opacity: 0.55 }, to: { transform: 'scale(2.4)', opacity: 0 } })

const fill = css({ position: 'absolute', inset: 0, width: '100%', height: '100%' })
/** 좌표(%)에 중심을 맞추는 래퍼. transform 을 여기서 쓰므로 GSAP 은 안쪽 [data-pop] 만 건드린다 */
const anchor = css({ position: 'absolute', transform: 'translate(-50%, -50%)' })

const s = {
  // 말풍선 크기가 맵 폭(cqw)에 비례하도록 컨테이너로 선언
  root: css({ containerType: 'inline-size', position: 'relative', aspectRatio: '1670 / 850', width: '100%', userSelect: 'none' }),
  // 좁은 화면: 말풍선이 겹치지 않게 지도 폭을 지키고 옆으로 밀어 보게 한다
  frame: css({ '@media (max-width: 767px)': { overflowX: 'auto', overscrollBehaviorX: 'contain' } }),
  rootWide: css({ '@media (max-width: 767px)': { minWidth: 640 } }),
  img: css(fill, { objectFit: 'contain' }),
  lines: css(fill, { pointerEvents: 'none' }),
  dot: css(anchor, { width: 6, height: 6, borderRadius: '50%', background: c.ink, boxShadow: `0 0 0 2px ${c.surface}` }),
  callout: css({
    display: 'block',
    borderRadius: theme.radius.sm,
    border: '1.5px solid currentColor',
    background: theme.onDark(0.95),
    padding: '0.3cqw 0.6cqw',
    textAlign: 'center',
    lineHeight: 1.25,
    transition: `transform 0.3s ${theme.ease}`,
    '&:hover': { transform: 'scale(1.06)' },
  }),
  calloutName: css({ fontSize: 'clamp(8px, 1.15cqw, 12px)', fontWeight: 500, whiteSpace: 'nowrap', color: c.ink }),
  calloutValue: css({ fontSize: 'clamp(9px, 1.3cqw, 13px)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }),
  pin: css({
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'currentColor',
    fontSize: 14,
    fontWeight: 700,
    boxShadow: `0 0 0 2px ${c.surface}`,
    '& > b': { color: c.surface },
  }),
  // danger 핀만 은은한 펄스 링
  pinPulse: css({
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: 'currentColor',
      animation: `${pulse} 1.8s ${theme.ease} infinite`,
      '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 },
    },
  }),
  legend: css({
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: theme.radius.md,
    border: `1px solid ${c.line}`,
    background: theme.onDark(0.9),
    padding: '10px 12px',
    fontSize: 12,
    color: c.sub,
  }),
  legendUnit: css({ marginBottom: 6, fontSize: 11, color: c.mute }),
  legendBody: css({ display: 'flex', gap: 8 }),
  legendBar: css({ width: 6, height: 64, borderRadius: theme.radius.pill, background: `linear-gradient(${c.danger}, ${c.warn}, ${c.good})` }),
  legendLabels: css({ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }),
  thumb: css({ position: 'relative', overflow: 'hidden', borderRadius: theme.radius.md, background: c.lineSoft }),
  thumbImg: css({ position: 'absolute', top: '50%', left: '50%', width: '400%', maxWidth: 'none' }),
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
  const root = useRef<HTMLDivElement>(null)

  return (
    <div css={s.frame} className={className}>
    <div ref={root} css={[s.root, callouts.length > 0 && s.rootWide]}>
      <img src={MAP_SRC} alt="국립한밭대학교 3D 캠퍼스 맵" css={s.img} draggable={false} />

      {callouts.length > 0 && (
        <svg css={s.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {callouts.map((b) => (
            <line key={b.id} x1={b.x} y1={b.y} x2={b.labelX} y2={b.labelY} stroke={c.ink} strokeOpacity={0.55} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      )}

      {callouts.map((b) => {
        const tone = { color: CALLOUT_TONE[levelOf(b.kw)] }
        const body = (
          <>
            <p css={s.calloutName}>
              {b.name} ({b.code})
            </p>
            <p css={s.calloutValue}>{b.kw.toLocaleString()} kW</p>
          </>
        )
        return (
          <div key={b.id}>
            <span css={s.dot} style={{ left: `${b.x}%`, top: `${b.y}%` }} />
            <div css={anchor} style={{ left: `${b.labelX}%`, top: `${b.labelY}%` }}>
              <div data-pop>
                {linkTo ? (
                  <Link to={linkTo(b)} css={s.callout} style={tone}>
                    {body}
                  </Link>
                ) : (
                  <div css={s.callout} style={tone}>
                    {body}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {pins.map(({ building: b, tone }) => (
        <span key={b.id} css={anchor} style={{ left: `${b.x}%`, top: `${b.y}%` }} title={`${b.name} (${b.code})`}>
          <span data-pop css={[s.pin, tone === 'danger' && s.pinPulse]} style={{ color: PIN_TONE[tone] }}>
            <b css={{ position: 'relative' }}>!</b>
          </span>
        </span>
      ))}

      {legend && (
        <div css={s.legend}>
          <p css={s.legendUnit}>(kW)</p>
          <div css={s.legendBody}>
            <span css={s.legendBar} />
            <span css={s.legendLabels}>
              <span>높음</span>
              <span>낮음</span>
            </span>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

/** 캠퍼스 맵을 확대해서 특정 건물 주변을 썸네일로 보여준다 (건물 사진 대용). */
export function BuildingThumb({ building, className }: { building: Building; className?: string }) {
  return (
    <div css={s.thumb} className={className} role="img" aria-label={`${building.name} 위치`}>
      <img src={MAP_SRC} alt="" css={s.thumbImg} style={{ transform: `translate(-${building.x}%, -${building.y}%)` }} draggable={false} />
    </div>
  )
}
