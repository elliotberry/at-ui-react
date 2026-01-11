import React, { createContext } from 'react'
import classNames from 'classnames'

export const TimelineContext = createContext(null)

const Timeline = (props) => {
  const {
    pending = false,
    className,
    children,
    ...restProps
  } = props

  const timelineClasses = classNames(
    'at-timeline',
    {
      'at-timeline--pending': pending
    },
    className
  )

  return (
    <TimelineContext.Provider value={{ pending }}>
      <div className={timelineClasses} {...restProps}>
        {children}
      </div>
    </TimelineContext.Provider>
  )
}

Timeline.displayName = 'AtTimeline'

export default Timeline

