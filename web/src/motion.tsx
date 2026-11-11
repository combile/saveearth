import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, ScrollTrigger, useGSAP }

export const EASE = 'power3.out'
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 예전엔 [data-reveal] 요소를 순차 등장시켰다. 앱 화면에서 로드 때 장식 모션은 빼기로 해서(Hallmark app screen)
 * 지금은 ref 만 돌려준다. 호출부를 건드리지 않으려고 API 는 그대로 둔다.
 */
export function useReveal<T extends HTMLElement>(_deps: unknown[] = []) {
  return useRef<T>(null)
}

/** 포맷된 숫자를 그대로 출력. 카운트업은 같은 이유로 껐다 */
export function CountUp({ value }: { value: string | number; duration?: number }) {
  return <>{typeof value === 'number' ? value.toLocaleString('en-US') : value}</>
}
