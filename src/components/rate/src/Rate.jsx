import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

const Rate = (props) => {
  const {
    value: valueProp = 0,
    count = 5,
    disabled = false,
    allowHalf = false,
    showText = false,
    icon = 'icon-star-on',
    onChange,
    onHoverChange,
    className,
    children,
    ...restProps
  } = props

  const [currentValue, setCurrentValue] = useState(valueProp)
  const [hoverIndex, setHoverIndex] = useState(-1)
  const [lastHoverIndex, setLastHoverIndex] = useState(-1)
  const [isHoverRate, setIsHoverRate] = useState(false)
  const [isHalf, setIsHalf] = useState(allowHalf)

  useEffect(() => {
    setCurrentValue(valueProp)
    checkIsHalf(valueProp)
  }, [valueProp])

  const checkIsHalf = (val) => {
    setIsHalf(allowHalf && val.toString().indexOf('.') >= 0)
  }

  const calcClass = (index) => {
    const STAR_ON_CLASS_NAME = 'at-rate__item--on'
    const STAR_OFF_CLASS_NAME = 'at-rate__item--off'
    const STAR_HALF_CLASS_NAME = 'at-rate__item--half'

    const isHalfStar = isHalf
    const isHoverStar = hoverIndex !== -1
    const currentIndex = isHoverStar ? hoverIndex : currentValue
    const lastItemIndex = Math.ceil(currentIndex)

    return {
      [STAR_ON_CLASS_NAME]: isHalfStar ? index < lastItemIndex : index <= lastItemIndex,
      [STAR_HALF_CLASS_NAME]: (index === lastItemIndex) && isHalfStar,
      [STAR_OFF_CLASS_NAME]: index > lastItemIndex
    }
  }

  const overRateHandle = () => {
    if (disabled) return
    setIsHoverRate(true)
  }

  const leaveRateHandle = () => {
    if (disabled) return
    setIsHoverRate(false)
    setHoverIndex(-1)
    setLastHoverIndex(-1)
    checkIsHalf(currentValue)
  }

  const moveStarHandle = (index, event) => {
    if (disabled) return
    setHoverIndex(index)

    const isHalfStar = allowHalf && event.target.getAttribute('type') === 'half'
    setIsHalf(isHalfStar)

    const exactlyHoverIndex = isHalfStar ? index - 0.5 : index
    if (exactlyHoverIndex !== lastHoverIndex) {
      if (onHoverChange) {
        onHoverChange(exactlyHoverIndex)
      }
    }

    setLastHoverIndex(exactlyHoverIndex)
  }

  const confirmValue = (index) => {
    if (disabled) return
    const newValue = isHalf ? index - 0.5 : index
    setCurrentValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const rateClasses = classNames(
    'at-rate__list',
    {
      'at-rate--disabled': disabled
    },
    className
  )

  return (
    <div className="at-rate" {...restProps}>
      <ul className={rateClasses} onMouseOver={overRateHandle} onMouseLeave={leaveRateHandle}>
        {Array.from({ length: count }).map((_, index) => {
          const itemIndex = index + 1
          return (
            <li key={itemIndex} className={classNames('at-rate__item', calcClass(itemIndex))}>
              <i
                className={['icon', 'at-rate__icon', icon].join(' ')}
                onMouseMove={(e) => moveStarHandle(itemIndex, e)}
                onClick={() => confirmValue(itemIndex)}
              >
                <span className={['icon', 'at-rate__left', icon].join(' ')} type="half" />
              </i>
            </li>
          )
        })}
      </ul>
      {showText && (
        <div className="at-rate__text">
          {children || currentValue}
        </div>
      )}
    </div>
  )
}

Rate.displayName = 'AtRate'

export default Rate

