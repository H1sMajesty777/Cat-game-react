import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDraggable } from '../../../hooks/useDraggable'
import styles from './FishPool.module.css'

const FISH_CONFIG = {
  count: 6,
  positions: [
    { x: -60, y: -78, rotation: -30, zIndex: 1, scale: 0.93 },
    { x: -40, y: -75, rotation: -20, zIndex: 2, scale: 0.93 },
    { x: -15, y: -77, rotation: -5, zIndex: 3, scale: 0.94 },
    { x: 15, y: -78, rotation: 10, zIndex: 4, scale: 0.94 },
    { x: 50, y: -79, rotation: 20, zIndex: 5, scale: 0.95 },
    { x: 70, y: -78, rotation: 30, zIndex: 6, scale: 1 }
  ]
}

const FishPool = ({ onFishDrop }) => {
  const [fishes, setFishes] = useState([])
  const [availableFish, setAvailableFish] = useState([0, 1, 2, 3, 4, 5])
  const { draggingId, startDrag } = useDraggable(onFishDrop)
  const poolRef = React.useRef(null)

  const spawnFish = useCallback(() => {
    if (availableFish.length === 0) return
    
    const fishIndex = availableFish[Math.floor(Math.random() * availableFish.length)]
    const positionIndex = fishes.length
    
    if (positionIndex >= FISH_CONFIG.count) return
    
    const newFish = {
      id: Date.now() + Math.random(),
      poolIndex: fishIndex,
      positionIndex,
      ...FISH_CONFIG.positions[positionIndex]
    }
    
    setFishes(prev => [...prev, newFish])
    setAvailableFish(prev => prev.filter(i => i !== fishIndex))
  }, [availableFish, fishes.length])

  const removeFish = useCallback((fishId, wasEaten) => {
    const fish = fishes.find(f => f.id === fishId)
    if (!fish) return
    
    setFishes(prev => prev.filter(f => f.id !== fishId))
    
    if (!wasEaten) {
      setAvailableFish(prev => [...prev, fish.poolIndex])
    }
  }, [fishes])

  const handleFishDrop = useCallback((fishData) => {
    const success = onFishDrop(fishData.id)
    removeFish(fishData.id, success)
    
    // Спавним новую рыбку через некоторое время
    setTimeout(() => {
      spawnFish()
    }, 500)
  }, [onFishDrop, removeFish, spawnFish])

  useEffect(() => {
    // Начальный спавн рыбок
    const spawnInterval = setInterval(() => {
      if (fishes.length < FISH_CONFIG.count) {
        spawnFish()
      }
    }, 500)
    
    return () => clearInterval(spawnInterval)
  }, [fishes.length, spawnFish])

  return (
    <div className={styles.fishPool} ref={poolRef}>
      <AnimatePresence>
        {fishes.map((fish) => {
          const isDragging = draggingId === fish.id
          
          return (
            <motion.img
              key={fish.id}
              id={`fish-${fish.id}`}
              src="/assets/fish_1.png"
              className={`${styles.fish} ${isDragging ? styles.dragging : ''}`}
              initial={{ 
                x: -300, 
                y: 300, 
                rotate: 0, 
                scale: 0.5,
                opacity: 0 
              }}
              animate={{ 
                x: fish.x, 
                y: fish.y, 
                rotate: fish.rotation, 
                scale: fish.scale,
                opacity: 1,
                zIndex: fish.zIndex
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              onMouseDown={(e) => startDrag(e, fish.id, { x: fish.x, y: fish.y })}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              alt="Fish"
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default FishPool