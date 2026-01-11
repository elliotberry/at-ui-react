import React, { useContext } from 'react'
import classNames from 'classnames'
import { ButtonGroupContext } from './ButtonGroup'

const Button = React.forwardRef((props, ref) => {
  const {
    type = 'default',
    nativeType = 'button',
    size,
    icon,
    disabled = false,
    loading = false,
    hollow = false,
    circle = false,
    style,
    className,
    children,
    onClick,
    ...restProps
  } = props

  const groupContext = useContext(ButtonGroupContext)
  const effectiveSize = size || groupContext.size
  const gap = groupContext.gap

  const buttonClasses = classNames(
    'at-btn',
    {
      [`at-btn--${type}`]: type,
      [`at-btn--${effectiveSize}`]: effectiveSize,
      [`at-btn--${type}--hollow`]: hollow,
      'at-btn--circle': circle && !children
    },
    className
  )

  const buttonStyle = {
    ...style,
    ...(gap >= 0 && { marginRight: `${gap}px` })
  }

  const handleClick = (evt) => {
    if (disabled || loading) return
    if (onClick) {
      onClick(evt)
    }
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      style={buttonStyle}
      disabled={disabled}
      type={nativeType}
      onClick={handleClick}
      {...restProps}
    >
      {loading && <i className="at-btn__loading icon icon-loader" />}
      {icon && <i className={`at-btn__icon icon ${icon}`} />}
      {children && <span className="at-btn__text">{children}</span>}
    </button>
  )
})

Button.displayName = 'AtButton'

export default Button

