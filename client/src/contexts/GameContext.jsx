import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const GameContext = createContext(null)

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [musicVolume, setMusicVolume] = useState(0.7)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const audioRef = useRef({
    music: null,
    meow: null,
    purring: null,
    hissing: null
  })

  const incrementScore = useCallback(() => {
    setScore(prev => prev + 1)
  }, [])

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prev => !prev)
  }, [])

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  const value = {
    score,
    incrementScore,
    isMusicPlaying,
    setIsMusicPlaying,
    musicVolume,
    setMusicVolume,
    isSettingsOpen,
    toggleSettings,
    closeSettings,
    audioRef
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}