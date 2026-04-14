import { useEffect, useRef, useCallback } from 'react'
import { useGame } from '../contexts/GameContext'

export const useAudio = () => {
  const { audioRef, musicVolume } = useGame()

  const initAudio = useCallback(() => {
    if (!audioRef.current.music) {
      audioRef.current.music = new Audio('/assets/sounds/main_music.mp3')
      audioRef.current.music.loop = true
      audioRef.current.music.volume = musicVolume
    }
    if (!audioRef.current.meow) {
      audioRef.current.meow = new Audio('/assets/sounds/may.mp3')
      audioRef.current.meow.volume = 0.7
    }
    if (!audioRef.current.purring) {
      audioRef.current.purring = new Audio('/assets/sounds/purring.mp3')
      audioRef.current.purring.loop = true
      audioRef.current.purring.volume = 0.5
    }
    if (!audioRef.current.hissing) {
      audioRef.current.hissing = new Audio('/assets/sounds/hissing.mp3')
      audioRef.current.hissing.volume = 0.4
    }
  }, [audioRef, musicVolume])

  const playMusic = useCallback(() => {
    initAudio()
    if (audioRef.current.music) {
      // Для автовоспроизведения в CRA нужен обработчик клика
      audioRef.current.music.play().catch(e => console.log('Click to play music'))
    }
  }, [initAudio, audioRef])

  const pauseMusic = useCallback(() => {
    if (audioRef.current.music) {
      audioRef.current.music.pause()
    }
  }, [audioRef])

  const setMusicVolume = useCallback((volume) => {
    if (audioRef.current.music) {
      audioRef.current.music.volume = Math.max(0, Math.min(1, volume))
    }
  }, [audioRef])

  const playSound = useCallback((soundName) => {
    initAudio()
    const sound = audioRef.current[soundName]
    if (sound) {
      sound.currentTime = 0
      sound.play().catch(e => console.log(`${soundName} play error:`, e))
    }
  }, [initAudio, audioRef])

  const stopSound = useCallback((soundName) => {
    const sound = audioRef.current[soundName]
    if (sound) {
      sound.pause()
      sound.currentTime = 0
    }
  }, [audioRef])

  return {
    playMusic,
    pauseMusic,
    setMusicVolume,
    playSound,
    stopSound,
    initAudio
  }
}