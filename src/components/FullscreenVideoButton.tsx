import { useEffect, useRef } from 'react'

const VIDEO_SRC = '/video/johnnybday.mp4'

// iOS Safari doesn't support the standard Fullscreen API on <video> - it
// has its own non-standard entry point (and its own exit event) instead
type SafariVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
}

export function FullscreenVideoButton() {
  const videoRef = useRef<SafariVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function reset() {
      video!.pause()
      video!.currentTime = 0
    }

    function handleFullscreenChange() {
      if (!document.fullscreenElement) reset()
    }

    function handleEnded() {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        // iOS Safari's own fullscreen path doesn't use
        // document.fullscreenElement, so reset directly here instead
        reset()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    video.addEventListener('webkitendfullscreen', reset)
    video.addEventListener('ended', handleEnded)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      video.removeEventListener('webkitendfullscreen', reset)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  function handleClick() {
    const video = videoRef.current
    if (!video) return

    // both calls need to stay inside this synchronous click handler - once
    // either one crosses an await, browsers stop treating it as a direct
    // response to the user's gesture and silently reject it. Fullscreen
    // goes first, ahead of play(): some browsers only treat a fullscreen
    // request as "directly" gesture-triggered when nothing else has run in
    // the handler yet, so playback starting first can get a later request
    // rejected on a repeat click - both promises are caught rather than
    // awaited so a rejection can't silently stop the rest of the handler.
    video.currentTime = 0
    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen()
    } else if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {})
    }
    video.play().catch(() => {})
  }

  return (
    <>
      <button
        type="button"
        className="video-trigger"
        aria-label="Play a birthday video"
        onClick={handleClick}
      />
      <video ref={videoRef} className="video-trigger__video" src={VIDEO_SRC} preload="none" playsInline />
    </>
  )
}
