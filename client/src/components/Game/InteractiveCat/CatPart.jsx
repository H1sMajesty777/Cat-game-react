import React from 'react'

const CatPart = ({ src, className, style, alt = '' }) => {
  return (
    <img 
      src={src} 
      className={className} 
      style={style}
      alt={alt}
    />
  )
}

export default CatPart