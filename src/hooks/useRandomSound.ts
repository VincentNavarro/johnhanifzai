import { useCallback, useRef } from 'react'
import { pickRandomSound, SOUND_URLS } from './sounds'

export function useRandomSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  return useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    const audio = audioRef.current
    audio.src = pickRandomSound(SOUND_URLS)
    audio.currentTime = 0
    // play() rejects if the browser blocks it (no prior user gesture) -
    // this is only ever called from a click handler, but swallow it
    // defensively rather than letting an unhandled rejection surface.
    audio.play().catch(() => {})
  }, [])
}
