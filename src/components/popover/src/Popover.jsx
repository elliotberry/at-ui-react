import React, { useEffect } from 'react'
import { usePopover } from '../../../hooks/usePopover'
import { useClickOutside } from '../../../hooks/useClickOutside'
import classNames from 'classnames'
import styles from './Popover.module.scss'

const Popover = React.forwardRef((props, ref) => {
  const {
    trigger = 'click',
    transition = 'fade',
    placement = 'top',
    title,
    content,
    value: valueProp = false,
    onToggle,
    className,
    children,
    ...restProps
  } = props

  const {
    show,
    position,
    triggerRef,
    popoverRef,
    hidePopover
  } = usePopover({
    trigger,
    placement,
    value: valueProp,
    onToggle
  })

  const parentRef = useClickOutside(() => {
    if (show) {
      hidePopover()
    }
  })

  useEffect(() => {
    if (valueProp !== undefined) {
      // Controlled mode
    }
  }, [valueProp])

  const popoverClasses = classNames(
    'at-popover',
    className
  )

  const popperClasses = classNames(
    'at-popover__popper',
    {
      [`at-popover--${placement}`]: placement
    }
  )

  return (
    <div className={popoverClasses} ref={parentRef} {...restProps}>
      <span className="at-popover__trigger" ref={triggerRef}>
        {children}
      </span>

      {show && (
        <div
          className={popperClasses}
          ref={popoverRef}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          <div className="at-popover__arrow" />
          {title && (
            <div className="at-popover__title" dangerouslySetInnerHTML={{ __html: title }} />
          )}
          <div className="at-popover__content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </div>
  )
})

Popover.displayName = 'AtPopover'

export default Popover

