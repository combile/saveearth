import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, ScrollTrigger, useGSAP }

export const EASE = 'power3.out'
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
/** 인트로 로더가 화면을 덮고 있는 동안은 등장 애니메이션을 그만큼 늦춘다 */
const introDelay = () => (document.querySelector('[data-intro-loader]') ? 1.1 : 0)

/**
 * scope 안의 [data-reveal] 요소를 화면에 들어올 때 순차 등장시킨다.
 * deps 가 바뀌면(라우트 이동 등) 다시 실행. Card 는 기본으로 data-reveal 을 갖는다.
 */
export function useReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null)
  useGSAP(
    () => {
      if (reducedMotion()) return
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]', ref.current)
      if (!els.length) return
      gsap.set(els, { autoAlpha: 0, y: 28 })
      ScrollTrigger.batch(els, {
        start: 'top 95%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, delay: introDelay(), duration: 0.8, ease: EASE, stagger: 0.07, clearProps: 'transform' }),
      })
    },
    { scope: ref, dependencies: deps, revertOnUpdate: true },
  )
  return ref
}

/** "1,256,890" 같은 포맷된 숫자를 0 에서부터 카운트업. 숫자가 아니면 그대로 출력 */
export function CountUp({ value, duration = 1.4 }: { value: string | number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const text = String(value)
  const target = Number(text.replace(/,/g, ''))
  const decimals = text.split('.')[1]?.length ?? 0
  const grouped = typeof value === 'number' || text.includes(',')
  const format = (n: number) => (grouped ? n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n.toFixed(decimals))

  useGSAP(
    () => {
      if (Number.isNaN(target) || reducedMotion()) return
      const el = ref.current!
      const state = { n: 0 }
      el.textContent = format(0)
      const tween = gsap.to(state, { n: target, duration, ease: 'power2.out', paused: true, onUpdate: () => void (el.textContent = format(state.n)) })
      ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: () => tween.delay(introDelay()).restart(true) })
    },
    { dependencies: [text] },
  )

  return <span ref={ref}>{Number.isNaN(target) ? text : format(target)}</span>
}
