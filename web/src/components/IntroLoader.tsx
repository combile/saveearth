import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { gsap, reducedMotion, useGSAP } from '../motion'
import { bigNumber, eyebrow, theme } from '../theme'
import { Icon } from './Icon'

const SEEN_KEY = 'earth-guard:intro'

function shouldPlay() {
  if (reducedMotion()) return false
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

/** 최초 진입 시 1회만 보이는 전체 화면 로더. 0→100 카운트 후 위로 걷힌다 (총 1.5초) */
export default function IntroLoader() {
  const [show, setShow] = useState(shouldPlay)
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (!show) return
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {
        /* noop */
      }
      const state = { n: 0 }
      gsap
        .timeline({ onComplete: () => setShow(false) })
        .from('[data-intro]', { autoAlpha: 0, y: 20, duration: 0.5, ease: 'power3.out', stagger: 0.06 })
        .to(
          state,
          {
            n: 100,
            duration: 0.9,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(state.n))
            },
          },
          0,
        )
        .to(root.current, { yPercent: -100, duration: 0.6, ease: 'power4.inOut' })
    },
    { scope: root, dependencies: [show] },
  )

  if (!show) return null

  return (
    <div ref={root} css={s.root} data-intro-loader aria-hidden>
      <div css={s.brand}>
        <span data-intro>
          <Icon name="potted_plant" size={48} css={{ color: theme.color.lime }} />
        </span>
        <p data-intro css={s.name}>
          한밭대학교
        </p>
        <p data-intro css={s.tagline}>
          탄소중립 캠퍼스
        </p>
      </div>
      <p css={[bigNumber, s.counter]}>
        <span ref={count}>0</span>
        <span css={[eyebrow, { marginLeft: 6, color: 'rgba(255,255,255,0.5)' }]}>%</span>
      </p>
    </div>
  )
}

const s = {
  root: css({
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'grid',
    placeItems: 'center',
    background: theme.color.brand900,
    color: '#fff',
    willChange: 'transform',
  }),
  brand: css({ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }),
  name: css({ marginTop: 16, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }),
  tagline: css([eyebrow, { marginTop: 12, fontFamily: theme.font.sans, fontSize: 14, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.7)' }]),
  counter: css({ position: 'absolute', right: 40, bottom: 32, fontSize: 'clamp(48px, 8vw, 96px)', color: theme.color.lime }),
}
