import React from 'react'
import classNames from 'classnames'
import { transitionClass, usePresence } from '../../../utils/transition'

/**
 * The bar itself. Use the `LoadingBar.start()/finish()/error()` functions to
 * drive a page-level bar; render this component directly for a custom one.
 */
const LoadingBar = (props) => {
  const {
    show = false,
    status = 'success',
    percent = 0,
    width = 2,
    className,
    style,
    ...restProps
  } = props

  const { mounted, phase } = usePresence(show)

  if (!mounted) return null

  return (
    <div
      className={classNames(
        'at-loading-bar',
        { [`at-loading-bar--${status}`]: status },
        transitionClass('fade', phase),
        className
      )}
      style={{ height: `${(width | 0) || 2}px`, ...style }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      {...restProps}
    >
      <div className="at-loading-bar__inner" style={{ width: `${percent}%` }} />
    </div>
  )
}

LoadingBar.displayName = 'AtLoadingBar'

export default LoadingBar
