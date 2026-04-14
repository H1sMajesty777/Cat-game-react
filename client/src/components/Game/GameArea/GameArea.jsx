import React, { useRef } from 'react'
import { useGame } from '../../../contexts/GameContext'
import InteractiveCat from '../InteractiveCat/InteractiveCat'
import Triangles from './Triangles'
import FishPool from './FishPool'
import styles from './GameArea.module.css'

const GameArea = () => {
  const catRef = useRef(null)
  const { incrementScore } = useGame()

  const handleFishDrop = (fishId) => {
    const catRect = catRef.current?.getBoundingClientRect()
    const fishElement = document.getElementById(`fish-${fishId}`)
    
    if (catRect && fishElement) {
      const fishRect = fishElement.getBoundingClientRect()
      
      const isInCatZone = fishRect.left < catRect.right && 
                         fishRect.right > catRect.left &&
                         fishRect.top < catRect.bottom && 
                         fishRect.bottom > catRect.top
      
      if (isInCatZone) {
        incrementScore()
        catRef.current?.feed()
        return true
      }
    }
    return false
  }

  return (
    <main className={styles.gameArea}>
      <Triangles />
      <InteractiveCat ref={catRef} />
      <div className={styles.basket}>
        <img src="/assets/basket.png" alt="Basket" />
      </div>
      <FishPool onFishDrop={handleFishDrop} />
    </main>
  )
}

export default GameArea