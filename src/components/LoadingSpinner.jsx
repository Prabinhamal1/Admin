import React from 'react'

const LoadingSpinner = ({ size = 12 }) => {
  const dimension = `h-${size} w-${size}`
  return (
    <div className="flex items-center justify-center h-full">
      <div className={`animate-spin rounded-full ${dimension} border-b-2 border-primary-600`}></div>
    </div>
  )
}

export default LoadingSpinner

