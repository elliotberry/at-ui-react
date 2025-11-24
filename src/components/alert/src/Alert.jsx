import React, { useState } from 'react'
import classNames from 'classnames'
import styles from './Alert.module.scss'

const Alert = (props) => {
  const {
    type = 'info',
    message,
    description,
    closable = false,
    showIcon = false,
    icon,
    closeText,
    onClose,
    className,
    ...restProps
  } = props

  const [isShow, setIsShow] = useState(true)

  const iconClassMap = {
    'success': 'icon-check-circle',
    'error': 'icon-x-circle',
    'warning': 'icon-alert-circle',
    'info': 'icon-info'
  }

  const iconClass = iconClassMap[type] || icon || 'icon-info'

  const alertClasses = classNames(
    'at-alert',
    {
      [`at-alert--${type}`]: type,
      'at-alert--with-description': description
    },
    className
  )

  const handleClose = () => {
    setIsShow(false)
    if (onClose) {
      onClose()
    }
  }

  if (!isShow) {
    return null
  }

  return (
    <div className={alertClasses} {...restProps}>
      {showIcon && (
        <i className={`icon at-alert__icon ${iconClass}`} />
      )}
      <div className="at-alert__content">
        {message && (
          <p className="at-alert__message">{message}</p>
        )}
        {description && (
          <p className="at-alert__description">{description}</p>
        )}
      </div>
      {(closable || closeText) && (
        <i
          className={classNames(
            'icon at-alert__close',
            {
              'at-alert__close--custom': closeText,
              'icon-x': !closeText
            }
          )}
          onClick={handleClose}
        >
          {closeText}
        </i>
      )}
    </div>
  )
}

Alert.displayName = 'AtAlert'

export default Alert

