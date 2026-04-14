import { useState, useEffect, useRef, useCallback } from 'react'
import { useAudio } from './useAudio'

const MOOD_CONFIG = {
  chill: {
    headOffset: 1,
    eyes: 'normal',
    mouth: 'normal',
    pupils: true,
    blinking: true,
    headMovement: true,
    earsPosition: 'normal',
    tailSprite: 'tail'
  },
  enjoy: {
    headOffset: 5,
    eyes: 'blink',
    mouth: 'normal',
    pupils: false,
    blinking: false,
    headMovement: true,
    earsPosition: 'down',
    tailSprite: 'tail'
  },
  sad: {
    headOffset: 5,
    eyes: 'sad',
    mouth: 'sad',
    pupils: false,
    blinking: true,
    headMovement: false,
    earsPosition: 'down',
    tailSprite: 'tail_scared'
  },
  happy: {
    headOffset: 0,
    eyes: 'normal',
    mouth: 'happy',
    pupils: true,
    blinking: true,
    headMovement: true,
    earsPosition: 'normal',
    tailSprite: 'tail'
  },
  scared: {
    headOffset: 0,
    eyes: 'normal',
    mouth: 'normal',
    pupils: true,
    blinking: false,
    headMovement: true,
    earsPosition: 'back',
    tailSprite: 'tail_scared'
  },
  angry: {
    headOffset: 5,
    eyes: 'angry',
    mouth: 'angry',
    pupils: false,
    blinking: false,
    headMovement: false,
    earsPosition: 'down',
    tailSprite: 'tail_scared'
  },
  eating: {
    headOffset: 0,
    eyes: 'blink',
    mouth: 'happy',
    pupils: false,
    blinking: false,
    headMovement: false,
    earsPosition: 'normal',
    tailSprite: 'tail'
  }
}

export const useCatAI = (catRef) => {
  const { playSound, stopSound } = useAudio()
  
  const [mood, setMood] = useState('chill')
  const [headY, setHeadY] = useState(0)
  const [headDirection, setHeadDirection] = useState('down')
  const [pupilsX, setPupilsX] = useState(0)
  const [pupilsY, setPupilsY] = useState(0)
  const [eyeDirection, setEyeDirection] = useState('right')
  const [isBlinking, setIsBlinking] = useState(false)
  const [earState, setEarState] = useState({ left: false, right: false })
  const [tailPullCount, setTailPullCount] = useState(0)
  
  const lastFeedTimeRef = useRef(Date.now())
  const moodTimeoutRef = useRef(null)
  const blinkTimeoutRef = useRef(null)
  const earTimeoutRef = useRef({ left: null, right: null })
  const animationFrameRef = useRef(null)

  const config = MOOD_CONFIG[mood] || MOOD_CONFIG.chill

  const changeMood = useCallback((newMood) => {
    if (mood === newMood) return
    
    setMood(newMood)
    
    // Останавливаем предыдущие звуки
    stopSound('purring')
    stopSound('hissing')
    
    // Запускаем новые звуки
    if (newMood === 'enjoy') {
      playSound('purring')
    } else if (newMood === 'angry') {
      playSound('hissing')
    }
    
    // Сбрасываем таймеры настроения
    if (moodTimeoutRef.current) {
      clearTimeout(moodTimeoutRef.current)
      moodTimeoutRef.current = null
    }
    
    // Автоматический возврат в chill для временных настроений
    const durations = {
      happy: 3000,
      scared: 2000,
      angry: 3000,
      eating: 500
    }
    
    if (durations[newMood]) {
      moodTimeoutRef.current = setTimeout(() => {
        changeMood('chill')
      }, durations[newMood])
    }
  }, [mood, playSound, stopSound])

  const feed = useCallback(() => {
    lastFeedTimeRef.current = Date.now()
    changeMood('eating')
    playSound('meow')
  }, [changeMood, playSound])

  const updateAnimation = useCallback(() => {
    const currentConfig = MOOD_CONFIG[mood]
    
    // Движение головы
    if (currentConfig.headMovement) {
      setHeadY(prev => {
        const speed = 0.05
        const maxDistance = 5
        let next = prev
        
        if (headDirection === 'down') {
          next = prev + speed
          if (next >= maxDistance + currentConfig.headOffset) {
            setHeadDirection('up')
          }
        } else {
          next = prev - speed
          if (next <= currentConfig.headOffset) {
            setHeadDirection('down')
          }
        }
        return next
      })
    }
    
    // Движение зрачков
    if (currentConfig.pupils && !isBlinking) {
      setPupilsX(prev => {
        const speed = 0.05
        const maxDistance = 7
        let next = prev
        
        switch (eyeDirection) {
          case 'right':
            next = prev + speed
            if (next >= maxDistance) setEyeDirection('down')
            break
          case 'down':
            return prev
          case 'left':
            next = prev - speed
            if (next <= -maxDistance) setEyeDirection('up')
            break
          case 'up':
            return prev
          default:
            return prev
        }
        return next
      })
      
      setPupilsY(prev => {
        const speed = 0.05
        const maxDistance = 7
        let next = prev
        
        switch (eyeDirection) {
          case 'down':
            next = prev + speed
            if (next >= maxDistance) setEyeDirection('left')
            break
          case 'up':
            next = prev - speed
            if (next <= -maxDistance) setEyeDirection('right')
            break
          default:
            return prev
        }
        return next
      })
      
      // Случайная смена направления
      if (Math.random() < 0.01) {
        const directions = ['right', 'down', 'left', 'up']
        setEyeDirection(directions[Math.floor(Math.random() * directions.length)])
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(updateAnimation)
  }, [mood, headDirection, eyeDirection, isBlinking])

  const scheduleBlink = useCallback(() => {
    if (!MOOD_CONFIG[mood]?.blinking) return
    
    const nextBlink = Math.random() * 4000 + 2000
    blinkTimeoutRef.current = setTimeout(() => {
      setIsBlinking(true)
      setTimeout(() => {
        setIsBlinking(false)
        scheduleBlink()
      }, 150)
    }, nextBlink)
  }, [mood])

  const handlePetStart = useCallback(() => {
    changeMood('enjoy')
  }, [changeMood])

  const handlePetEnd = useCallback(() => {
    if (mood === 'enjoy') {
      changeMood('chill')
    }
  }, [mood, changeMood])

  const handleEarTwitch = useCallback((side) => {
    setEarState(prev => ({ ...prev, [side]: true }))
    
    if (earTimeoutRef.current[side]) {
      clearTimeout(earTimeoutRef.current[side])
    }
    
    earTimeoutRef.current[side] = setTimeout(() => {
      setEarState(prev => ({ ...prev, [side]: false }))
    }, 300)
  }, [])

  const handleTailPull = useCallback(() => {
    setTailPullCount(prev => {
      const newCount = prev + 1
      if (newCount >= 5) {
        changeMood('angry')
        setTimeout(() => setTailPullCount(0), 10000)
        return 0
      } else {
        changeMood('scared')
        return newCount
      }
    })
  }, [changeMood])

  const checkHunger = useCallback(() => {
    const timeSinceLastFeed = Date.now() - lastFeedTimeRef.current
    if (timeSinceLastFeed > 15000 && mood === 'chill') {
      changeMood('sad')
    }
  }, [mood, changeMood])

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateAnimation)
    scheduleBlink()
    
    const hungerInterval = setInterval(checkHunger, 1000)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current)
      }
      if (moodTimeoutRef.current) {
        clearTimeout(moodTimeoutRef.current)
      }
      clearInterval(hungerInterval)
    }
  }, [updateAnimation, scheduleBlink, checkHunger])

  const getEyesSprite = useCallback(() => {
    switch (config.eyes) {
      case 'sad': return '/assets/cat_parts/eyes_sad.png'
      case 'angry': return '/assets/cat_parts/eyes_angry.png'
      case 'blink': return '/assets/cat_parts/eyes_blink.png'
      default: return '/assets/cat_parts/eyes.png'
    }
  }, [config.eyes])

  const getMouthSprite = useCallback(() => {
    switch (config.mouth) {
      case 'sad': return '/assets/cat_parts/mouth_sad.png'
      case 'happy': return '/assets/cat_parts/mouth_happy.png'
      case 'angry': return '/assets/cat_parts/mouth_angry.png'
      default: return '/assets/cat_parts/mouth.png'
    }
  }, [config.mouth])

  const getTailSprite = useCallback(() => {
    return config.tailSprite === 'tail_scared' 
      ? '/assets/cat_parts/tail_scared.png' 
      : '/assets/cat_parts/tail.gif'
  }, [config.tailSprite])

  const getEarStyle = useCallback((side) => {
    if (earState[side]) {
      return side === 'left' 
        ? 'translateX(-5px) rotate(-3deg) scale(0.95)'
        : 'translateX(5px) rotate(3deg) scale(0.95)'
    }
    
    switch (config.earsPosition) {
      case 'down':
        return side === 'left'
          ? 'translateX(-3px) rotate(-4deg) scale(0.95)'
          : 'translateX(3px) rotate(4deg) scale(0.95)'
      case 'back':
        return side === 'left'
          ? 'translateX(-5px) rotate(-3deg) scale(0.95)'
          : 'translateX(5px) rotate(3deg) scale(0.95)'
      default:
        return 'translateX(0) rotate(0) scale(1)'
    }
  }, [config.earsPosition, earState])

  return {
    mood,
    changeMood,
    feed,
    headY: headY + config.headOffset,
    pupilsX,
    pupilsY,
    isBlinking,
    getEyesSprite,
    getMouthSprite,
    getTailSprite,
    getEarStyle,
    showPupils: config.pupils,
    handlePetStart,
    handlePetEnd,
    handleEarTwitch,
    handleTailPull
  }
}