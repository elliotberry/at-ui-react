import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import InputNumber from '../../input-number/src/InputNumber'
import Tooltip from '../../tooltip/src/Tooltip'
import styles from './Slider.module.scss'

const Slider = (props) => {
  const {
    value: valueProp = 0,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    className,
    ...restProps
  } = props

  const [currentValue, setCurrentValue] = useState(valueProp)
  const [isHover, setIsHover] = useState(false)
  const [isDrag, setIsDrag] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [startPos, setStartPos] = useState(0)
  const [newPos, setNewPos] = useState(null)
  const sliderRef = useRef(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    let val = valueProp
    if (typeof val !== 'number' || isNaN(val) || val < min) {
      val = min
    } else if (val > max) {
      val = max
    }
    setCurrentValue(val)
    setPosition((val - min) * 100 / (max - min))
  }, [valueProp, min, max])

  const getSliderWidth = () => {
    if (!sliderRef.current) return 0
    return sliderRef.current.offsetWidth
  }

  const currentPosition = `${(currentValue - min) * 100 / (max - min)}%`

  const setPosition = (pos) => {
    if (pos < 0) pos = 0
    if (pos > 100) pos = 100

    const lengthPerStep = 100 / ((max - min) / step)
    const steps = Math.round(pos / lengthPerStep)
    let value = (steps * lengthPerStep * (max - min) * 0.01) + min
    value = parseFloat(value.toFixed(0))

    setCurrentValue(value)
    if (onChange) {
      onChange(value)
    }
  }

  const handleMouseEnter = () => {
    setIsHover(true)
    if (tooltipRef.current && tooltipRef.current.showPopover) {
      tooltipRef.current.showPopover()
    }
  }

  const handleMouseLeave = () => {
    if (isDrag) return
    setIsHover(false)
    setTimeout(() => {
      if (tooltipRef.current && tooltipRef.current.hidePopover) {
        tooltipRef.current.hidePopover()
      }
    }, 200)
  }

  const handleMouseDown = (evt) => {
    if (disabled) return
    onDragStart(evt)
    window.addEventListener('mousemove', onDragging)
    window.addEventListener('mouseup', onDragEnd)
  }

  const onDragStart = (evt) => {
    setIsDrag(true)
    setStartX(evt.clientX)
    setStartPos(parseInt(currentPosition))
  }

  const onDragging = (evt) => {
    if (!isDrag) return
    if (tooltipRef.current && tooltipRef.current.showPopover) {
      tooltipRef.current.showPopover()
    }
    setCurrentX(evt.clientX)
    const sliderWidth = getSliderWidth()
    const diff = (evt.clientX - startX) * 100 / sliderWidth
    const pos = startPos + diff
    setNewPos(pos)
    setPosition(pos)
  }

  const onDragEnd = () => {
    if (!isDrag) return
    if (tooltipRef.current && tooltipRef.current.hidePopover) {
      tooltipRef.current.hidePopover()
    }
    setIsDrag(false)
    setPosition(newPos)
    window.removeEventListener('mousemove', onDragging)
    window.removeEventListener('mouseup', onDragEnd)
  }

  const onSliderClick = (evt) => {
    if (disabled || isDrag) return
    const sliderOffsetLeft = sliderRef.current.getBoundingClientRect().left
    const sliderWidth = getSliderWidth()
    const pos = (evt.clientX - sliderOffsetLeft) / sliderWidth * 100
    setPosition(pos)
  }

  const sliderClasses = classNames(
    'at-slider',
    className
  )

  const trackClasses = classNames(
    'at-slider__track',
    {
      'at-slider--disabled': disabled
    }
  )

  const dotWrapperClasses = classNames(
    'at-slider__dot-wrapper',
    {
      'at-slider__dot-wrapper--hover': isHover,
      'at-slider__dot-wrapper--drag': isDrag
    }
  )

  const dotClasses = classNames(
    'at-slider__dot',
    {
      'at-slider__dot--hover': isHover,
      'at-slider__dot--drag': isDrag
    }
  )

  return (
    <div className={sliderClasses} {...restProps}>
      <InputNumber
        className="at-slider__input"
        style={{ display: 'none' }}
        value={currentValue}
        step={step}
        disabled={disabled}
        min={min}
        max={max}
        onChange={(evt) => {
          const val = evt.target.value
          if (val === '') return
          if (!isNaN(val)) {
            setPosition((val - min) * 100 / (max - min))
          }
        }}
      />
      <div
        className={trackClasses}
        onClick={onSliderClick}
        ref={sliderRef}
      >
        <div className="at-slider__bar" style={{ width: currentPosition }} />
        <div
          className={dotWrapperClasses}
          style={{ left: currentPosition }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
        >
          <Tooltip placement="top" trigger="click" content={currentValue} ref={tooltipRef}>
            <div className={dotClasses} />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

Slider.displayName = 'AtSlider'

export default Slider

