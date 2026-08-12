export type Phase = 'typing' | 'pausing' | 'deleting'

export type TypewriterState = {
  text: string
  displayed: string
  phase: Phase
  fontIndex: number
}

export function initialTypewriterState(text: string): TypewriterState {
  return { text, displayed: '', phase: 'typing', fontIndex: 0 }
}

/**
 * One tick of the type -> pause -> delete -> (next font) -> type loop.
 * Pure and timer-agnostic: the caller decides how long to wait between ticks
 * (see delayFor) and how many fonts to cycle through.
 */
export function nextTypewriterState(state: TypewriterState, fontCount: number): TypewriterState {
  const { text, displayed, phase, fontIndex } = state

  if (phase === 'typing') {
    if (displayed.length < text.length) {
      return { ...state, displayed: text.slice(0, displayed.length + 1) }
    }
    return { ...state, phase: 'pausing' }
  }

  if (phase === 'pausing') {
    return { ...state, phase: 'deleting' }
  }

  // phase === 'deleting'
  if (displayed.length > 0) {
    return { ...state, displayed: displayed.slice(0, -1) }
  }
  return { ...state, phase: 'typing', fontIndex: (fontIndex + 1) % fontCount }
}

export type TypewriterTiming = {
  typeSpeed: number
  deleteSpeed: number
  pauseDuration: number
}

export function delayFor(phase: Phase, timing: TypewriterTiming): number {
  if (phase === 'typing') return timing.typeSpeed
  if (phase === 'deleting') return timing.deleteSpeed
  return timing.pauseDuration
}
