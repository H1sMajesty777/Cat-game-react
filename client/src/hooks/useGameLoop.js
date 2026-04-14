import { useRef, useEffect } from 'react'

export const useGameLoop = (callback, isActive = true) => {
  const frameRef = useRef()
  const lastTimeRef = useRef(0)

  useEffect(() => {
    if (!isActive) return

    const loop = (currentTime) => {
      if (lastTimeRef.current !== 0) {
        const deltaTime = currentTime - lastTimeRef.current
        callback(deltaTime)
      }
      lastTimeRef.current = currentTime
      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [callback, isActive])
}