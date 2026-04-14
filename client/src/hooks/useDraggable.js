import { useState, useRef, useCallback, useEffect } from 'react'

export const useDraggable = (onDrop, dropZoneRef) => {
  const [draggingId, setDraggingId] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, fishX: 0, fishY: 0 })
  const elementRef = useRef(null)

  const startDrag = useCallback((e, id, startPos) => {
    e.preventDefault()
    e.stopPropagation()
    
    const element = e.currentTarget
    elementRef.current = element
    
    const rect = element.getBoundingClientRect()
    
    setDraggingId(id)
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      fishX: rect.left,
      fishY: rect.top
    }
    
    element.style.transition = 'none'
    element.style.zIndex = '1000'
    element.style.cursor = 'grabbing'
  }, [])

  const onDrag = useCallback((e) => {
    if (!draggingId) return
    
    e.preventDefault()
    
    const deltaX = e.clientX - dragStartRef.current.mouseX
    const deltaY = e.clientY - dragStartRef.current.mouseY
    
    const newX = dragStartRef.current.fishX + deltaX
    const newY = dragStartRef.current.fishY + deltaY
    
    setPosition({ x: newX, y: newY })
    
    if (elementRef.current) {
      elementRef.current.style.transform = `translate(${newX}px, ${newY}px)`
    }
  }, [draggingId])

  const stopDrag = useCallback((e, fishData) => {
    if (!draggingId) return
    
    const element = elementRef.current
    if (element) {
      element.style.cursor = 'grab'
      element.style.zIndex = ''
      
      // Проверяем, попала ли рыбка в зону дропа
      if (dropZoneRef?.current) {
        const dropZone = dropZoneRef.current
        const fishRect = element.getBoundingClientRect()
        const zoneRect = dropZone.getBoundingClientRect()
        
        const isInZone = fishRect.left < zoneRect.right && 
                        fishRect.right > zoneRect.left &&
                        fishRect.top < zoneRect.bottom && 
                        fishRect.bottom > zoneRect.top
        
        if (isInZone && onDrop) {
          onDrop(fishData)
        }
      }
    }
    
    setDraggingId(null)
    elementRef.current = null
  }, [draggingId, onDrop, dropZoneRef])

  useEffect(() => {
    if (draggingId) {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
      
      return () => {
        document.removeEventListener('mousemove', onDrag)
        document.removeEventListener('mouseup', stopDrag)
      }
    }
  }, [draggingId, onDrag, stopDrag])

  return {
    draggingId,
    startDrag,
    position
  }
}