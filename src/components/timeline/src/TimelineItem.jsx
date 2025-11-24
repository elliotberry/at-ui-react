import React, { useContext } from 'react'
import classNames from 'classnames'
import { TimelineContext } from './Timeline'
import styles from './TimelineItem.module.scss'

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

  const colors = {
    blue: 'default',
    red: 'error',
    green: 'success',
    yellow: 'warning'
  }

  const status = colors[color] || colors.blue

  // Simplified last item detection
  const isLastItem = false // Would need to check siblings
  const isPendingItem = false

  const timelineItemClasses = classNames(
    'at-timeline__item',
    {
      'at-timeline__item--last': isLastItem,
      'at-timeline__item--pending': isPendingItem,
      'at-timeline__item--custom': !!dot,
      [`at-timeline__item--${status}`]: status
    },
    className
  )

  return (
    <div className={timelineItemClasses} {...restProps}>
      <div className="at-timeline__tail" />
      <div className="at-timeline__dot">
        {dot || null}
      </div>
      <div className="at-timeline__content">
        {children}
      </div>
    </div>
  )
}

TimelineItem.displayName = 'AtTimelineItem'

export default TimelineItem

