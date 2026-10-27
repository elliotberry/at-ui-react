import React, { useState } from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

/**
 * `onChange(value)` fires on click; `onHoverChange(value)` while hovering.
 * With `allowHalf` the left half of a star selects `n - 0.5`.
 */
const Rate = (props) => {
  const {
    value: valueProp,
    defaultValue = 0,
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

  const [currentValue, setCurrentValue] = useSyncedState(valueProp, defaultValue)
  // Value previewed under the pointer, or null when not hovering.
  const [hoverValue, setHoverValue] = useState(null)
  const formItem = useFormItem()

  const displayValue = hoverValue !== null ? hoverValue : currentValue

  const starState = (index) => {
    const isHalf = allowHalf && displayValue === index - 0.5
    const isOn = displayValue >= index
    return {
      'at-rate__item--on': isOn || isHalf,
      'at-rate__item--half': isHalf,
      'at-rate__item--off': !isOn && !isHalf
    }
  }

  const valueAt = (index, evt) => {
    const isHalfStar = allowHalf && evt.target.getAttribute('type') === 'half'
    return isHalfStar ? index - 0.5 : index
  }

  const handleMove = (index, evt) => {
    if (disabled) return
    const next = valueAt(index, evt)
    if (next !== hoverValue) {
      setHoverValue(next)
      if (onHoverChange) onHoverChange(next)
    }
  }

  const handleClick = (index, evt) => {
    if (disabled) return
    const next = valueAt(index, evt)
    setCurrentValue(next)
    if (onChange) onChange(next)
    if (formItem) formItem.onChange(next)
  }

  return (
    <div className={classNames('at-rate', className)} {...restProps}>
      <ul
        className={classNames('at-rate__list', { 'at-rate--disabled': disabled })}
        onMouseLeave={() => !disabled && setHoverValue(null)}
      >
        {Array.from({ length: count }, (_, i) => i + 1).map(index => (
          <li key={index} className={classNames('at-rate__item', starState(index))}>
            <i
              className={`icon at-rate__icon ${icon}`}
              onMouseMove={(evt) => handleMove(index, evt)}
              onClick={(evt) => handleClick(index, evt)}
            >
              <span className={`icon at-rate__left ${icon}`} type="half" />
            </i>
          </li>
        ))}
      </ul>
      {showText && (
        <div className="at-rate__text">
          {children !== undefined ? children : currentValue}
        </div>
      )}
    </div>
  )
}

Rate.displayName = 'AtRate'

export default Rate
