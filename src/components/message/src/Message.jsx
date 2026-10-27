import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { transitionClass } from '../../../utils/transition'

const ICONS = {
  success: 'icon-check-circle',
  error: 'icon-x-circle',
  warning: 'icon-alert-circle',
  info: 'icon-info',
  loading: 'icon-loader'
}

/**
 * A single message bubble. Normally created through the `Message(...)`
 * function; `onClose` is called when `duration` (ms, 0 = never) has elapsed.
 */
const Message = (props) => {
  const {
    message = '',
    duration = 3000,
    type = 'info',
    icon = '',
    closing = false,
    onClose,
    className,
    style,
    ...restProps
  } = props

  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!duration || closing) return
    const timer = setTimeout(() => onCloseRef.current && onCloseRef.current(), duration)
    return () => clearTimeout(timer)
  }, [duration, closing])

  return (
    <div className="at-message__wrapper" style={style} {...restProps}>
      <div
        className={classNames(
          'at-message',
          { [`at-message--${type}`]: type },
          transitionClass('move-up', closing ? 'leave' : 'enter'),
          className
        )}
        role="alert"
      >
        <i className={`icon at-message__icon ${icon || ICONS[type] || ''}`} />
        <span className="at-message__content">{message}</span>
      </div>
    </div>
  )
}

Message.displayName = 'AtMessage'

export default Message
