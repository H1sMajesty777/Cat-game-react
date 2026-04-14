import React from 'react'
import { useGame } from '../../contexts/GameContext'
import SettingsMenu from '../Game/UI/SettingsMenu'
import styles from './Header.module.css'

const Header = () => {
  const { score, toggleSettings, isSettingsOpen } = useGame()

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>GameAboutCat</h1>
      <div className={styles.score}>
        Counter: <span className={styles.counter}>{score}</span>
      </div>
      <div className={styles.menuWrapper}>
        <button className={styles.menuBtn} onClick={toggleSettings}>
          Menu
        </button>
        {isSettingsOpen && <SettingsMenu />}
      </div>
    </header>
  )
}

export default Header