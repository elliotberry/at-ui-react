import React, { useImperativeHandle } from 'react'
import classNames from 'classnames'
import { usePopover } from '../../../hooks/usePopover'
import { useClickOutside } from '../../../hooks/useClickOutside'

/**
 * `title` and `content` are React nodes (strings are rendered as text).
 */
const Popover = React.forwardRef((props, ref) => {
  const {
    trigger = 'click',
    placement = 'top',
    title,
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

  const parentRef = useClickOutside(() => {
    if (show && trigger !== 'manual') hidePopover()
  })

  useImperativeHandle(ref, () => ({
    toggle,
    showPopover,
    hidePopover,
    get show () { return show }
  }), [toggle, showPopover, hidePopover, show])

  return (
    <div className={classNames('at-popover', className)} ref={parentRef} {...restProps}>
      <span className="at-popover__trigger" ref={triggerRef} {...triggerProps}>
        {children}
      </span>

      {show && (
        <div
          className={classNames('at-popover__popper', `at-popover--${placement}`)}
          ref={popoverRef}
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
          {...popoverProps}
        >
          <div className="at-popover__arrow" />
          {title && <div className="at-popover__title">{title}</div>}
          <div className="at-popover__content">{content}</div>
        </div>
      )}
    </div>
  )
})

Popover.displayName = 'AtPopover'

export default Popover
