import React, { useEffect } from 'react'
import { GameProvider } from './contexts/GameContext'
import Header from './components/Layout/Header'
import GameArea from './components/Game/GameArea/GameArea'
import { useAudio } from './hooks/useAudio'
import styles from './App.module.css'

// Компонент-обертка для инициализации аудио
const AudioInitializer = ({ children }) => {
  const { initAudio } = useAudio()
  
  useEffect(() => {
    // Инициализируем аудио при первом клике
    const handleFirstClick = () => {
      initAudio()
      document.removeEventListener('click', handleFirstClick)
    }
    
    document.addEventListener('click', handleFirstClick)
    return () => document.removeEventListener('click', handleFirstClick)
  }, [initAudio])
  
  return children
}

function App() {
  return (
    <GameProvider>
      <AudioInitializer>
        <div className={styles.app}>
          <Header />
          <GameArea />
        </div>
      </AudioInitializer>
    </GameProvider>
  )
}

export default App