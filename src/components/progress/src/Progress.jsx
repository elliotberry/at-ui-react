import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'

const CIRCLE_SIZE = 120

/**
 * `percent` is 0-100. At 100 the status switches to "success" automatically
 * and `onStatusSuccess(percent)` fires once.
 */
const Progress = (props) => {
  const {
    type = 'bar',
    status = '',
    percent = 0,
    strokeWidth = 8,
    onStatusSuccess,
    className,
    ...restProps
  } = props

  const value = Math.min(Math.max(Number(percent) || 0, 0), 100)
  const currentStatus = value === 100 ? 'success' : status

  const onSuccessRef = useRef(onStatusSuccess)
  useEffect(() => {
    onSuccessRef.current = onStatusSuccess
  })

  useEffect(() => {
    if (value === 100 && onSuccessRef.current) onSuccessRef.current(value)
  }, [value])

  const statusIconClass = currentStatus === 'success' ? 'icon-check-circle' : 'icon-x-circle'

  const radius = (CIRCLE_SIZE - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div
      className={classNames(
        'at-progress',
        `at-progress--${type}`,
        { [`at-progress--${currentStatus}`]: currentStatus },
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      {...restProps}
    >
      {type === 'circle' ? (
        <svg
          className="at-progress-circle"
          width={CIRCLE_SIZE}
          height={CIRCLE_SIZE}
          viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
        >
          <circle
            className="at-progress-circle__track"
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
          />
          <circle
            className="at-progress-circle__path"
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - value / 100)}
            transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
          />
        </svg>
      ) : (
        <div className="at-progress-bar">
          <div className="at-progress-bar__wraper" style={{ height: `${strokeWidth}px` }}>
            <div className="at-progress-bar__inner" style={{ width: `${value}%` }} />
          </div>
        </div>
      )}
      <div className="at-progress__text">
        {!currentStatus ? (
          <span>{value}%</span>
        ) : (
          <i className={`icon ${statusIconClass}`} />
        )}
      </div>
    </div>
  )
}

Progress.displayName = 'AtProgress'

export default Progress
