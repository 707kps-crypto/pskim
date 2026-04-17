'use client'

import { useEffect, useRef, useCallback } from 'react'

interface YouTubeBackgroundProps {
  videoId: string
  overlayOpacity?: number
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface YTPlayer {
  mute: () => void
  playVideo: () => void
  getDuration: () => number
  getCurrentTime: () => number
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  destroy: () => void
}

export default function YouTubeBackground({ videoId, overlayOpacity = 0.95 }: YouTubeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return

    const div = document.createElement('div')
    div.id = `yt-bg-${videoId}`
    containerRef.current.prepend(div)

    const YT = (window as any).YT
    playerRef.current = new YT.Player(div.id, {
      videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        playsinline: 1,
        modestbranding: 1,
        disablekb: 1,
        iv_load_policy: 3,
        fs: 0,
        cc_load_policy: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (e: any) => {
          const player: YTPlayer = e.target
          player.mute()
          player.playVideo()

          // 영상 끝나기 0.5초 전에 처음으로 되돌려 검정화면 방지
          timerRef.current = setInterval(() => {
            const duration = player.getDuration()
            const current = player.getCurrentTime()
            if (duration > 0 && current > duration - 0.5) {
              player.seekTo(0, true)
            }
          }, 200)
        },
        onStateChange: (e: any) => {
          // 영상이 끝났으면 즉시 재생
          const YT = (window as any).YT
          if (e.data === YT.PlayerState.ENDED) {
            e.target.seekTo(0, true)
            e.target.playVideo()
          }
        },
      },
    })
  }, [videoId])

  useEffect(() => {
    const w = window as any
    if (w.YT && w.YT.Player) {
      initPlayer()
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
      if (!existingScript) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }

      const prev = w.onYouTubeIframeAPIReady
      w.onYouTubeIframeAPIReady = () => {
        prev?.()
        initPlayer()
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [initPlayer])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* z-0: 영상 (가장 뒤) */}
      <div
        ref={containerRef}
        className="absolute z-0 top-1/2 left-1/2 w-[180%] md:w-[120%] aspect-video -translate-x-1/2 -translate-y-1/2 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
      {/* z-[1]: 오버레이 (영상 앞, 글자 뒤) */}
      <div className="absolute inset-0 z-[1]" style={{ backgroundColor: `rgba(10, 20, 32, ${overlayOpacity})` }} />
    </div>
  )
}
