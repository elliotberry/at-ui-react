import React, { createContext } from 'react'
import classNames from 'classnames'

export const TimelineContext = createContext(null)

const isItem = (child) =>
  React.isValidElement(child) && child.type && child.type.displayName === 'AtTimelineItem'

const Timeline = (props) => {
  const {
    pending = false,
    className,
    children,
    ...restProps
  } = props

  const items = React.Children.toArray(children)
  const total = items.filter(isItem).length
  // With `pending`, the final item is the pending one and the one before it
  // is the last "real" item.
  const lastIndex = pending ? total - 2 : total - 1
  let index = -1

  return (
    <div
      className={classNames('at-timeline', { 'at-timeline--pending': pending }, className)}
      {...restProps}
    >
      {items.map((child) => {
        if (!isItem(child)) return child

        index += 1
        const value = {
          isLastItem: index === lastIndex,
          isPendingItem: pending && index === lastIndex + 1
        }

        return (
          <TimelineContext.Provider key={child.key || index} value={value}>
            {child}
          </TimelineContext.Provider>
        )
      })}
    </div>
  )
}

Timeline.displayName = 'AtTimeline'

export default Timeline
