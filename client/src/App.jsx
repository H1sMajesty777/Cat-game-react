import React from 'react'
import { GameProvider } from './contexts/GameContext'
import Header from './components/Layout/Header'
import GameArea from './components/Game/GameArea/GameArea'
import styles from './App.module.css'

function App() {
  return (
    <GameProvider>
      <div className={styles.app}>
        <Header />
        <GameArea />
      </div>
    </GameProvider>
  )
}

export default App