import React from 'react'
import classNames from 'classnames'

const Card = (props) => {
  const {
    bordered = true,
    noHover = false,
    loading = false,
    bodyStyle,
    title,
    extra,
    className,
    children,
    ...restProps
  } = props

  const cardClasses = classNames(
    'at-card',
    {
      'at-card--bordered': bordered,
      'at-card--no-hover': noHover
    },
    className
  )

  const hasHeader = title || extra

  return (
    <div className={cardClasses} {...restProps}>
      {hasHeader && (
        <div className="at-card__head">
          {title && (
            <div className="at-card__title">{title}</div>
          )}
          {extra && (
            <div className="at-card__extra">{extra}</div>
          )}
        </div>
      )}
      <div className="at-card__body" style={bodyStyle}>
        {loading ? (
          <div className="at-card__body--loading">
            <div><span style={{ width: '95%' }} /></div>
            <div><span style={{ width: '32%' }} /><span style={{ width: '58%' }} /></div>
            <div><span style={{ width: '23%' }} /><span style={{ width: '65%' }} /></div>
            <div><span style={{ width: '59%' }} /><span style={{ width: '32%' }} /></div>
            <div><span style={{ width: '26%' }} /><span style={{ width: '10%' }} /><span style={{ width: '50%' }} /></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

Card.displayName = 'AtCard'

export default Card

