import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import styles from './Message.module.scss'

const Message = (props) => {
  const {
    message = '',
    duration = 3000,
    type = 'info',
    icon = '',
    onClose,
    top,
    className,
    ...restProps
  } = props

  const [visible, setVisible] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    setVisible(true)
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (!closed) {
          close()
        }
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, closed])

  const iconClassMap = {
    'success': 'icon-check-circle',
    'error': 'icon-x-circle',
    'warning': 'icon-alert-circle',
    'info': 'icon-info',
    'loading': 'icon-loader'
  }

  const iconClass = icon || iconClassMap[type] || 'icon-info'

  const close = () => {
    setClosed(true)
    setVisible(false)
    if (onClose) {
      onClose()
    }
  }

  const messageClasses = classNames(
    'at-message',
    {
      [`at-message--${type}`]: type
    },
    className
  )

  if (!visible) return null

  return (
    <div
      className="at-message__wrapper"
      style={{ top: top ? `${top}px` : 'auto' }}
      {...restProps}
    >
      <div className={messageClasses}>
        <i className={`icon at-message__icon ${iconClass}`} />
        <span className="at-message__content">{message}</span>
      </div>
    </div>
  )
}

Message.displayName = 'AtMessage'

// Static methods for programmatic usage
Message.info = (config) => {
  // Would create a portal and render Message component
  console.log('Message.info', config)
}

Message.success = (config) => {
  console.log('Message.success', config)
}

Message.error = (config) => {
  console.log('Message.error', config)
}

Message.warning = (config) => {
  console.log('Message.warning', config)
}

export default Message

