import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import styles from './Notification.module.scss'

const Notification = (props) => {
  const {
    type = '',
    title = '',
    message = '',
    duration = 4000,
    icon = '',
    showClose = true,
    onClose,
    top,
    className,
    ...restProps
  } = props

  const [isShow, setIsShow] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    setIsShow(true)
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (!closed) {
          handleClose()
        }
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, closed])

  const iconClassMap = {
    'success': 'icon-check-circle',
    'error': 'icon-x-circle',
    'warning': 'icon-alert-circle',
    'info': 'icon-info'
  }

  const iconClass = iconClassMap[type] || icon || ''
  const showIcon = !!type

  const handleClose = () => {
    setClosed(true)
    setIsShow(false)
    if (onClose) {
      onClose()
    }
  }

  const startTimer = () => {
    if (duration > 0 && !closed) {
      setTimeout(() => {
        if (!closed) {
          handleClose()
        }
      }, duration)
    }
  }

  const clearTimer = () => {
    // Timer cleared on mouseenter
  }

  const notificationClasses = classNames(
    'at-notification',
    {
      [`at-notification--${type}`]: type,
      'at-notification--with-message': message,
      'at-notification--hover': !showClose
    },
    className
  )

  if (!isShow) return null

  return (
    <div
      className={notificationClasses}
      style={{ top: top ? `${top}px` : 'auto' }}
      onClick={!showClose ? handleClose : undefined}
      onMouseLeave={startTimer}
      onMouseEnter={clearTimer}
      {...restProps}
    >
      {showIcon && <i className={`icon at-notification__icon ${iconClass}`} />}
      <div className="at-notification__content">
        {title && <p className="at-notification__title">{title}</p>}
        {message && <p className="at-notification__message">{message}</p>}
      </div>
      {showClose && (
        <i className="icon icon-x at-notification__close" onClick={handleClose} />
      )}
    </div>
  )
}

Notification.displayName = 'AtNotification'

// Static methods
Notification.success = (config) => {
  console.log('Notification.success', config)
}

Notification.error = (config) => {
  console.log('Notification.error', config)
}

Notification.info = (config) => {
  console.log('Notification.info', config)
}

Notification.warning = (config) => {
  console.log('Notification.warning', config)
}

export default Notification

