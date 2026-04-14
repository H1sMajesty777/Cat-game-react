import React, { useEffect } from 'react'
import { useGame } from '../../../contexts/GameContext'
import { useAudio } from '../../../hooks/useAudio'
import styles from './SettingsMenu.module.css'

const SettingsMenu = () => {
  const { 
    closeSettings, 
    musicVolume, 
    setMusicVolume,
    isMusicPlaying,
    setIsMusicPlaying 
  } = useGame()
  
  const { playMusic, pauseMusic, setMusicVolume: setAudioVolume, initAudio } = useAudio()

  useEffect(() => {
    initAudio()
  }, [initAudio])

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value) / 100
    setMusicVolume(value)
    setAudioVolume(value)
  }

  const toggleMusic = () => {
    if (isMusicPlaying) {
      pauseMusic()
    } else {
      playMusic()
    }
    setIsMusicPlaying(!isMusicPlaying)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeSettings()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.menu}>
        <h2 className={styles.title}>Settings</h2>
        
        <div className={styles.setting}>
          <label>Music Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(musicVolume * 100)}
            onChange={handleVolumeChange}
            className={styles.slider}
          />
          <span>{Math.round(musicVolume * 100)}%</span>
        </div>
        
        <div className={styles.setting}>
          <label>Music:</label>
          <button onClick={toggleMusic} className={styles.toggleBtn}>
            {isMusicPlaying ? 'Off' : 'On'}
          </button>
        </div>
        
        <button onClick={closeSettings} className={styles.closeBtn}>
          Close
        </button>
      </div>
    </div>
  )
}

export default SettingsMenu