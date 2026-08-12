import { useEffect, useState } from 'react'
import {
  delayFor,
  initialTypewriterState,
  nextTypewriterState,
  type TypewriterTiming,
} from './typewriter'

const DEFAULT_TIMING: TypewriterTiming = {
  typeSpeed: 110,
  deleteSpeed: 60,
  pauseDuration: 5000,
}

export type UseTypewriterResult = {
  displayed: string
  font: string
  showCursor: boolean
}

export function useTypewriter(
  text: string,
  fonts: string[],
  timing: TypewriterTiming = DEFAULT_TIMING,
): UseTypewriterResult {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [state, setState] = useState(() =>
    reduceMotion ? { text, displayed: text, phase: 'pausing' as const, fontIndex: 0 } : initialTypewriterState(text),
  )

  useEffect(() => {
    if (reduceMotion) return

    const timeoutId = window.setTimeout(() => {
      setState((current) => nextTypewriterState(current, fonts.length))
    }, delayFor(state.phase, timing))

    return () => window.clearTimeout(timeoutId)
  }, [state, fonts.length, timing, reduceMotion])

  return {
    displayed: state.displayed,
    font: fonts[state.fontIndex],
    showCursor: !reduceMotion,
  }
}
