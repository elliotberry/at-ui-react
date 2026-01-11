import React from 'react'
import { usePopover } from '../../../hooks/usePopover'
import classNames from 'classnames'

const Tooltip = React.forwardRef((props, ref) => {
  const {
    trigger = 'hover',
    transition = 'fade',
    placement = 'top',
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
    showPopover,
    hidePopover
  } = usePopover({
    trigger,
    placement,
    value: valueProp,
    onToggle
  })

  // Expose methods via ref
  React.useImperativeHandle(ref, () => ({
    showPopover,
    hidePopover,
    show
  }))

  const tooltipClasses = classNames(
    'at-tooltip',
    className
  )

  const popperClasses = classNames(
    'at-tooltip__popper',
    {
      [`at-tooltip--${placement}`]: placement
    }
  )

  return (
    <div className={tooltipClasses} {...restProps}>
      <span className="at-tooltip__trigger" ref={triggerRef}>
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
          <div className="at-tooltip__arrow" />
          <div className="at-tooltip__content">
            {content}
          </div>
        </div>
      )}
    </div>
  )
})

Tooltip.displayName = 'AtTooltip'

export default Tooltip

