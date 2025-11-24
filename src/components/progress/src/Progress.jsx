import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import styles from './Progress.module.scss'

const Progress = (props) => {
  const {
    type = 'bar',
    status = '',
    percent = 0,
    strokeWidth = 8,
    onStatusSuccess,
    className,
    ...restProps
  } = props

  const [currentStatus, setCurrentStatus] = useState(status)

  useEffect(() => {
    if (percent === 100) {
      setCurrentStatus('success')
      if (onStatusSuccess) {
        onStatusSuccess(percent)
      }
    } else {
      setCurrentStatus(status)
    }
  }, [percent, status, onStatusSuccess])

  const progressClasses = classNames(
    'at-progress',
    {
      [`at-progress--${type}`]: type,
      [`at-progress--${currentStatus}`]: currentStatus
    },
    className
  )

  const barStyle = {
    height: `${strokeWidth}px`
  }

  const statusIconClass = currentStatus === 'success' ? 'icon-check-circle' : 'icon-x-circle'

  return (
    <div className={progressClasses} {...restProps}>
      {type === 'circle' ? (
        <div className="at-progress-circle" />
      ) : (
        <div className="at-progress-bar">
          <div className="at-progress-bar__wraper" style={barStyle}>
            <div className="at-progress-bar__inner" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}
      <div className="at-progress__text">
        {!currentStatus ? (
          <span>{percent}%</span>
        ) : (
          <i className={`icon ${statusIconClass}`} />
        )}
      </div>
    </div>
  )
}

Progress.displayName = 'AtProgress'

export default Progress

