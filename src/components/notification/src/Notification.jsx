import React, { useCallback, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { transitionClass } from '../../../utils/transition'

const ICONS = {
  success: 'icon-check-circle',
  error: 'icon-x-circle',
  warning: 'icon-alert-circle',
  info: 'icon-info'
}

/**
 * A single notification card. Normally created through `Notification(...)`;
 * `onClose` is called when `duration` (ms, 0 = never) has elapsed or the user
 * closes it. Hovering pauses the countdown.
 */
const Notification = (props) => {
  const {
    type = '',
    title = '',
    message = '',
    duration = 4000,
    icon = '',
    showClose = true,
    closing = false,
    onClose,
    className,
    ...restProps
  } = props

  const timerRef = useRef(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  const clearTimer = useCallback(() => clearTimeout(timerRef.current), [])

  const startTimer = useCallback(() => {
    clearTimeout(timerRef.current)
    if (duration > 0 && !closing) {
      timerRef.current = setTimeout(() => onCloseRef.current && onCloseRef.current(), duration)
    }
  }, [duration, closing])

  useEffect(() => {
    startTimer()
    return clearTimer
  }, [startTimer, clearTimer])

  const iconClass = ICONS[type] || icon

  return (
    <div
      className={classNames(
        'at-notification',
        {
          [`at-notification--${type}`]: type,
          'at-notification--with-message': message,
          'at-notification--hover': !showClose
        },
        transitionClass('notification-fade', closing ? 'leave' : 'enter'),
        className
      )}
      role="alert"
      onClick={!showClose ? () => onClose && onClose() : undefined}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      {...restProps}
    >
      {type && <i className={`icon at-notification__icon ${iconClass}`} />}
      <div className="at-notification__content">
        {title && <p className="at-notification__title">{title}</p>}
        {message && <p className="at-notification__message">{message}</p>}
      </div>
      {showClose && (
        <i className="icon icon-x at-notification__close" onClick={() => onClose && onClose()} />
      )}
    </div>
  )
}

Notification.displayName = 'AtNotification'

export default Notification
