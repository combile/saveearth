import mqtt from 'mqtt'
import { useEffect, useState } from 'react'
import { parsePower } from '../lib/parsePower'

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'error' | 'closed'
export type Reading = { t: string; v: number }

const HISTORY = 60
const env = import.meta.env
export const MQTT_TOPIC: string | undefined = env.VITE_MQTT_TOPIC

/** MQTT(WebSocket)로 전력 값을 받아 현재 값·최근 기록·연결 상태를 돌려준다 */
export function useMqttPower() {
  const [history, setHistory] = useState<Reading[]>([])
  const [raw, setRaw] = useState<string | null>(null)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  useEffect(() => {
    const { VITE_MQTT_HOST: host, VITE_MQTT_PORT: port } = env
    const topic = MQTT_TOPIC
    if (!host || !port || !topic) {
      console.error('MQTT 환경 변수 누락: .env.local 의 VITE_MQTT_HOST, VITE_MQTT_PORT, VITE_MQTT_TOPIC 을 확인하세요.')
      setStatus('error')
      return
    }

    // StrictMode 이중 실행 방어
    let destroyed = false
    const client = mqtt.connect(`wss://${host}:${port}/mqtt`, {
      username: env.VITE_MQTT_USERNAME,
      password: env.VITE_MQTT_PASSWORD,
      reconnectPeriod: 3000, // MQTT 3.1.1 기본값 (HiveMQ Cloud 호환)
    })
    const guard = (fn: () => void) => () => void (destroyed || fn())

    client.on('connect', guard(() => {
      setStatus('connected')
      client.subscribe(topic, { qos: 0 })
    }))
    client.on('reconnect', guard(() => setStatus('reconnecting')))
    client.on('close', guard(() => setStatus('closed')))
    client.on('error', (err) => {
      if (destroyed) return
      console.error('MQTT error', err)
      setStatus('error')
    })
    client.on('message', (_t, payload) => {
      if (destroyed) return
      const text = payload.toString()
      const v = parsePower(text)
      if (v === null) return console.warn('파싱 실패, 원본:', text) // 이전 값 유지
      const t = new Date().toLocaleTimeString('ko-KR', { hour12: false })
      setRaw(text)
      setHistory((h) => [...h.slice(-(HISTORY - 1)), { t, v }])
    })

    return () => {
      destroyed = true
      client.end(true)
    }
  }, [])

  return { value: history.at(-1)?.v ?? null, history, raw, status }
}
