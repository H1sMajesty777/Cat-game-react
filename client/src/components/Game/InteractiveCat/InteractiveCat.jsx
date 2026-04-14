import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { useCatAI } from '../../../hooks/useCatAI'
import CatPart from './CatPart'
import styles from './InteractiveCat.module.css'

const InteractiveCat = forwardRef((props, ref) => {
  const containerRef = useRef(null)
  
  const catAI = useCatAI(containerRef)

  useImperativeHandle(ref, () => ({
    feed: catAI.feed,
    getBoundingClientRect: () => containerRef.current?.getBoundingClientRect()
  }))

  return (
    <div className={styles.catArea} ref={containerRef}>
      {/* Хитбоксы */}
      <div 
        className={styles.headHitbox}
        onMouseDown={catAI.handlePetStart}
        onMouseUp={catAI.handlePetEnd}
        onMouseLeave={catAI.handlePetEnd}
      />
      <div 
        className={`${styles.earHitbox} ${styles.earHitboxLeft}`}
        onClick={() => catAI.handleEarTwitch('left')}
      />
      <div 
        className={`${styles.earHitbox} ${styles.earHitboxRight}`}
        onClick={() => catAI.handleEarTwitch('right')}
      />
      <div 
        className={styles.tailHitbox}
        onClick={catAI.handleTailPull}
      />

      {/* Тело */}
      <CatPart src="/assets/cat_parts/body.png" className={styles.catBody} />
      
      {/* Хвост */}
      <CatPart src={catAI.getTailSprite()} className={styles.catTail} />
      
      {/* Уши */}
      <CatPart 
        src="/assets/cat_parts/ear_left.png" 
        className={styles.catEarLeft}
        style={{ transform: catAI.getEarStyle('left') }}
      />
      <CatPart 
        src="/assets/cat_parts/ear_right.png" 
        className={styles.catEarRight}
        style={{ transform: catAI.getEarStyle('right') }}
      />
      
      {/* Голова */}
      <CatPart 
        src="/assets/cat_parts/head.png" 
        className={styles.catHead}
        style={{ transform: `translateY(${catAI.headY}px)` }}
      />
      
      {/* Глаза */}
      {!catAI.isBlinking && (
        <CatPart src={catAI.getEyesSprite()} className={styles.catEyes} />
      )}
      {catAI.isBlinking && (
        <CatPart src="/assets/cat_parts/eyes_blink.png" className={styles.catEyesBlink} />
      )}
      
      {/* Зрачки */}
      {catAI.showPupils && !catAI.isBlinking && (
        <CatPart 
          src="/assets/cat_parts/eyes_pupils.png" 
          className={styles.catEyesPupils}
          style={{ transform: `translate(${catAI.pupilsX}px, ${catAI.pupilsY}px)` }}
        />
      )}
      
      {/* Рот */}
      <CatPart src={catAI.getMouthSprite()} className={styles.catMouth} />
    </div>
  )
})

InteractiveCat.displayName = 'InteractiveCat'

export default InteractiveCat