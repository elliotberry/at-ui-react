import React, { useImperativeHandle } from 'react'
import classNames from 'classnames'
import { usePopover } from '../../../hooks/usePopover'

const Tooltip = React.forwardRef((props, ref) => {
  const {
    trigger = 'hover',
    placement = 'top',
    content,
    value,
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
    triggerProps,
    popoverProps,
    toggle,
    showPopover,
    hidePopover
  } = usePopover({ trigger, placement, value, onToggle })

  useImperativeHandle(ref, () => ({
    toggle,
    showPopover,
    hidePopover,
    get show () { return show }
  }), [toggle, showPopover, hidePopover, show])

  return (
    <div className={classNames('at-tooltip', className)} {...restProps}>
      <span className="at-tooltip__trigger" ref={triggerRef} {...triggerProps}>
        {children}
      </span>

      {show && (
        <div
          className={classNames('at-tooltip__popper', `at-tooltip--${placement}`)}
          ref={popoverRef}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          role="tooltip"
          {...popoverProps}
        >
          <div className="at-tooltip__arrow" />
          <div className="at-tooltip__content">{content}</div>
        </div>
      )}
    </div>
  )
})

Tooltip.displayName = 'AtTooltip'

export default Tooltip
