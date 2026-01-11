import React from 'react'
import classNames from 'classnames'

const colorArr = ['default', 'primary', 'success', 'error', 'warning', 'info']

const Tag = (props) => {
  const {
    name,
    color = 'default',
    closable = false,
    onClose,
    className,
    children,
    ...restProps
  } = props

  const colorClass = colorArr.indexOf(color) > -1 ? `at-tag--${color}` : ''
  
  const colorStyle = colorArr.indexOf(color) > -1 
    ? {} 
    : {
        borderColor: color,
        backgroundColor: color
      }

  const tagClasses = classNames('at-tag', colorClass, className)

  const closeAction = (evt) => {
    if (onClose) {
      if (typeof name === 'undefined') {
        onClose(evt)
      } else {
        onClose(evt, name)
      }
    }
  }

  return (
    <span className={tagClasses} style={colorStyle} {...restProps}>
      <span className="at-tag__text">{children}</span>
      {closable && (
        <i className="icon icon-x at-tag__close" onClick={closeAction} />
      )}
    </span>
  )
}

Tag.displayName = 'AtTag'

export default Tag

