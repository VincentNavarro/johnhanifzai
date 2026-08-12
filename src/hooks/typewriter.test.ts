import { describe, expect, it } from 'vitest'
import {
  delayFor,
  initialTypewriterState,
  nextTypewriterState,
  type TypewriterState,
} from './typewriter'

describe('nextTypewriterState', () => {
  const FONT_COUNT = 3

  it('appends one character per tick while typing', () => {
    let state = initialTypewriterState('Hi')
    state = nextTypewriterState(state, FONT_COUNT)
    expect(state).toMatchObject({ displayed: 'H', phase: 'typing' })
    state = nextTypewriterState(state, FONT_COUNT)
    expect(state).toMatchObject({ displayed: 'Hi', phase: 'typing' })
  })

  it('moves to pausing once the full text is typed', () => {
    let state: TypewriterState = { text: 'Hi', displayed: 'Hi', phase: 'typing', fontIndex: 0 }
    state = nextTypewriterState(state, FONT_COUNT)
    expect(state).toMatchObject({ displayed: 'Hi', phase: 'pausing' })
  })

  it('moves from pausing straight to deleting, text untouched', () => {
    let state: TypewriterState = { text: 'Hi', displayed: 'Hi', phase: 'pausing', fontIndex: 0 }
    state = nextTypewriterState(state, FONT_COUNT)
    expect(state).toMatchObject({ displayed: 'Hi', phase: 'deleting' })
  })

  it('removes one character per tick while deleting', () => {
    let state: TypewriterState = { text: 'Hi', displayed: 'Hi', phase: 'deleting', fontIndex: 0 }
    state = nextTypewriterState(state, FONT_COUNT)
    expect(state).toMatchObject({ displayed: 'H', phase: 'deleting' })
    state = nextTypewriterState(state, FONT_COUNT)
    expect(state).toMatchObject({ displayed: '', phase: 'deleting' })
  })

  it('advances to the next font and restarts typing once fully deleted', () => {
    const state: TypewriterState = { text: 'Hi', displayed: '', phase: 'deleting', fontIndex: 0 }
    const next = nextTypewriterState(state, FONT_COUNT)
    expect(next).toMatchObject({ displayed: '', phase: 'typing', fontIndex: 1 })
  })

  it('wraps the font index back to 0 after the last font', () => {
    const state: TypewriterState = { text: 'Hi', displayed: '', phase: 'deleting', fontIndex: 2 }
    const next = nextTypewriterState(state, FONT_COUNT)
    expect(next.fontIndex).toBe(0)
  })
})

describe('delayFor', () => {
  const timing = { typeSpeed: 100, deleteSpeed: 50, pauseDuration: 5000 }

  it('uses typeSpeed while typing', () => {
    expect(delayFor('typing', timing)).toBe(100)
  })

  it('uses deleteSpeed while deleting', () => {
    expect(delayFor('deleting', timing)).toBe(50)
  })

  it('uses pauseDuration while pausing', () => {
    expect(delayFor('pausing', timing)).toBe(5000)
  })
})
