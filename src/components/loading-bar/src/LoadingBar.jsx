import React, { useState } from 'react'
import classNames from 'classnames'
import styles from './LoadingBar.module.scss'

const LoadingBar = (props) => {
  const {
    show = false,
    status = 'success',
    percent = 0,
    width = 2,
    className,
    ...restProps
  } = props

  const barStyle = {
    height: `${width}px`
  }

  const loadingBarClasses = classNames(
    'at-loading-bar',
    {
      [`at-loading-bar--${status}`]: status
    },
    className
  )

  if (!show) return null

  return (
    <div className={loadingBarClasses} style={barStyle} {...restProps}>
      <div className="at-loading-bar__inner" style={{ width: `${percent}%` }} />
    </div>
  )
}

LoadingBar.displayName = 'AtLoadingBar'

// Static methods
LoadingBar.start = () => {
  console.log('LoadingBar.start')
}

LoadingBar.finish = () => {
  console.log('LoadingBar.finish')
}

LoadingBar.error = () => {
  console.log('LoadingBar.error')
}

export default LoadingBar

