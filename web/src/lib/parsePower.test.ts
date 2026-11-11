// 실행: npm test  (Node 내장 test runner, 추가 의존성 없음)
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parsePower } from './parsePower.ts'

test('parsePower', () => {
  assert.equal(parsePower('3'), 3)
  assert.equal(parsePower(' 3.5 '), 3.5)
  assert.equal(parsePower('{"power": 12.5}'), 12.5)
  assert.equal(parsePower('{"wh": 7}'), 7)
  assert.equal(parsePower('{"value": 9}'), 9)
  assert.equal(parsePower('{"foo": 4}'), 4)
  assert.equal(parsePower('abc'), null)
  assert.equal(parsePower('{"foo": "bar"}'), null)
  assert.equal(parsePower(''), null)
})
