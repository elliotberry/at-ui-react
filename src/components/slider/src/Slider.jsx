import React, { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import Tooltip from '../../tooltip/src/Tooltip'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

const decimals = (num) => {
  const part = String(num).split('.')[1]
  return part ? part.length : 0
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

/**
 * `onChange(value)` fires whenever the value changes by click, drag or keyboard.
 */
const Slider = (props) => {
  const {
    value: valueProp,
    defaultValue = 0,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    className,
    ...restProps
  } = props

  const [rawValue, setValue] = useSyncedState(valueProp, defaultValue)
  const [isHover, setIsHover] = useState(false)
  const [isDrag, setIsDrag] = useState(false)
  const trackRef = useRef(null)
  const formItem = useFormItem()

  const value = typeof rawValue === 'number' && !Number.isNaN(rawValue)
    ? clamp(rawValue, min, max)
    : min
  const percent = max === min ? 0 : (value - min) * 100 / (max - min)

  const update = useCallback((next) => {
    if (next === value) return
    setValue(next)
    if (onChange) onChange(next)
    if (formItem) formItem.onChange(next)
  }, [value, setValue, onChange, formItem])

  // Maps a pointer x-coordinate onto the nearest step value.
  const valueFromClientX = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = rect.width ? clamp((clientX - rect.left) / rect.width, 0, 1) : 0
    const steps = Math.round(ratio * (max - min) / step)
    const precision = Math.max(decimals(step), decimals(min))
    return clamp(parseFloat((min + steps * step).toFixed(precision)), min, max)
  }, [min, max, step])

  // While dragging, follow the pointer anywhere on the page.
  useEffect(() => {
    if (!isDrag) return

    const handleMove = (evt) => update(valueFromClientX(evt.clientX))
    const handleUp = () => setIsDrag(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isDrag, update, valueFromClientX])

  const handleMouseDown = (evt) => {
    if (disabled) return
    evt.preventDefault()
    setIsDrag(true)
  }

  const handleTrackClick = (evt) => {
    if (disabled || isDrag) return
    update(valueFromClientX(evt.clientX))
  }

  const handleKeyDown = (evt) => {
    if (disabled) return

    const precision = Math.max(decimals(step), decimals(min))
    const move = (delta) => {
      evt.preventDefault()
      update(clamp(parseFloat((value + delta).toFixed(precision)), min, max))
    }

    switch (evt.key) {
      case 'ArrowRight':
      case 'ArrowUp': return move(step)
      case 'ArrowLeft':
      case 'ArrowDown': return move(-step)
      case 'Home': evt.preventDefault(); return update(min)
      case 'End': evt.preventDefault(); return update(max)
    }
  }

  return (
    <div className={classNames('at-slider', className)} {...restProps}>
      <div
        className={classNames('at-slider__track', {
          'at-slider--disabled': disabled
        })}
        onClick={handleTrackClick}
        ref={trackRef}
      >
        <div className="at-slider__bar" style={{ width: `${percent}%` }} />
        <div
          className={classNames('at-slider__dot-wrapper', {
            'at-slider__dot-wrapper--hover': isHover,
            'at-slider__dot-wrapper--drag': isDrag
          })}
          style={{ left: `${percent}%` }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onMouseDown={handleMouseDown}
        >
          <Tooltip placement="top" trigger="manual" value={!disabled && (isHover || isDrag)} content={value}>
            <div
              className={classNames('at-slider__dot', {
                'at-slider__dot--hover': isHover,
                'at-slider__dot--drag': isDrag
              })}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={value}
              aria-disabled={disabled}
              onKeyDown={handleKeyDown}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

Slider.displayName = 'AtSlider'

export default Slider
