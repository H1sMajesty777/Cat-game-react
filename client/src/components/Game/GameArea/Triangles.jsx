import React, { useRef, useEffect, useState } from 'react'
import { useGameLoop } from '../../../hooks/useGameLoop'
import styles from './Triangles.module.css'

const CONFIG = {
  count: 19,
  width: 150,
  height: 450,
  radius: 480,
  angularSpeed: 0.0005
}

const Triangles = () => {
  const containerRef = useRef(null)
  const [triangles, setTriangles] = useState([])

  useEffect(() => {
    const newTriangles = []
    for (let i = 0; i < CONFIG.count; i++) {
      newTriangles.push({
        id: i,
        angle: (i / CONFIG.count) * Math.PI * 2,
        isEven: i % 2 === 0
      })
    }
    setTriangles(newTriangles)
  }, [])

  useGameLoop((deltaTime) => {
    if (!containerRef.current) return
    
    const centerX = window.innerWidth / 2 - CONFIG.width / 2
    const centerY = window.innerHeight / 2 - CONFIG.height
    
    const elements = containerRef.current.children
    
    for (let i = 0; i < elements.length; i++) {
      const triangle = triangles[i]
      if (!triangle) continue
      
      triangle.angle += CONFIG.angularSpeed * deltaTime
      
      const x = centerX + Math.cos(triangle.angle) * CONFIG.radius
      const y = centerY + Math.sin(triangle.angle) * CONFIG.radius
      const rotation = triangle.angle * (180 / Math.PI) - 90
      
      elements[i].style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`
    }
    
    setTriangles([...triangles])
  })

  return (
    <div className={styles.triangles} ref={containerRef}>
      {triangles.map((triangle) => (
        <img
          key={triangle.id}
          src="/assets/triangle.png"
          className={`${styles.triangle} ${triangle.isEven ? styles.even : ''}`}
          alt=""
        />
      ))}
    </div>
  )
}

export default Triangles