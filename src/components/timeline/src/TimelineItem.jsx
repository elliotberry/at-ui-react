import React, { useContext } from 'react'
import classNames from 'classnames'
import { TimelineContext } from './Timeline'

const COLORS = {
  blue: 'default',
  red: 'error',
  green: 'success',
  yellow: 'warning'
}

const TimelineItem = (props) => {
  const {
    color = 'blue',
    dot,
    className,
    children,
    ...restProps
  } = props

  const context = useContext(TimelineContext)

  if (!context) {
    console.warn('TimelineItem must be used within Timeline')
    return null
  }

  const status = COLORS[color] || COLORS.blue

  return (
    <div
      className={classNames(
        'at-timeline__item',
        {
          'at-timeline__item--last': context.isLastItem,
          'at-timeline__item--pending': context.isPendingItem,
          'at-timeline__item--custom': !!dot,
          [`at-timeline__item--${status}`]: status
        },
        className
      )}
      {...restProps}
    >
      <div className="at-timeline__tail" />
      <div className="at-timeline__dot">{dot || null}</div>
      <div className="at-timeline__content">{children}</div>
    </div>
  )
}

TimelineItem.displayName = 'AtTimelineItem'

export default TimelineItem
