import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSyncedState } from './useSyncedState'

export const PLACEMENTS = [
  'top', 'top-left', 'top-right',
  'left', 'left-top', 'left-bottom',
  'right', 'right-top', 'right-bottom',
  'bottom', 'bottom-left', 'bottom-right'
]

/**
 * Computes the popper position (relative to the trigger's offset parent).
 */
export const computePosition = (placement, trigger, popover) => {
  const left = trigger.offsetLeft
  const top = trigger.offsetTop
  const tw = trigger.offsetWidth
  const th = trigger.offsetHeight
  const pw = popover.offsetWidth
  const ph = popover.offsetHeight

  switch (placement) {
    case 'top-left': return { left, top: top - ph }
    case 'top-right': return { left: left + tw - pw, top: top - ph }
    case 'left': return { left: left - pw, top: top + th / 2 - ph / 2 }
    case 'left-top': return { left: left - pw, top }
    case 'left-bottom': return { left: left - pw, top: top + th - ph }
    case 'right': return { left: left + tw, top: top + th / 2 - ph / 2 }
    case 'right-top': return { left: left + tw, top }
    case 'right-bottom': return { left: left + tw, top: top + th - ph }
    case 'bottom': return { left: left - pw / 2 + tw / 2, top: top + th }
    case 'bottom-left': return { left, top: top + th }
    case 'bottom-right': return { left: left + tw - pw, top: top + th }
    case 'top':
    default:
      return { left: left - pw / 2 + tw / 2, top: top - ph }
  }
}

/**
 * Shared behaviour of Tooltip, Popover and Dropdown.
 *
 * Attach `triggerRef` to the element the popper is anchored to, `popoverRef`
 * to the popper, and spread `triggerProps` (and `popoverProps`) on the
 * elements that should react to the trigger event. `trigger` may be
 * 'hover', 'click', 'focus' or 'manual' (only the `value` prop controls it).
 */
export const usePopover = ({
  trigger = 'hover',
  placement = 'top',
  value,
  onToggle,
  hideDelay = 200
} = {}) => {
  const [show, setShow] = useSyncedState(value, false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const popoverRef = useRef(null)
  const timerRef = useRef(null)
  const onToggleRef = useRef(onToggle)

  useEffect(() => {
    onToggleRef.current = onToggle
  })

  const update = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return
    setPosition(computePosition(placement, triggerRef.current, popoverRef.current))
  }, [placement])

  // Measure after the popper is in the DOM but before the browser paints.
  useLayoutEffect(() => {
    if (show) update()
  }, [show, update])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const showRef = useRef(show)
  useEffect(() => {
    showRef.current = show
  })

  const setVisible = useCallback((next) => {
    clearTimeout(timerRef.current)
    if (showRef.current === next) return
    showRef.current = next
    setShow(next)
    if (onToggleRef.current) onToggleRef.current(next)
  }, [setShow])

  const showPopover = useCallback(() => setVisible(true), [setVisible])
  const hidePopover = useCallback(() => setVisible(false), [setVisible])
  const toggle = useCallback(() => setVisible(!showRef.current), [setVisible])

  const scheduleHide = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), hideDelay)
  }, [setVisible, hideDelay])

  const cancelHide = useCallback(() => clearTimeout(timerRef.current), [])

  const triggerProps = {}
  const popoverProps = {}

  if (trigger === 'click') {
    triggerProps.onClick = toggle
  } else if (trigger === 'hover') {
    triggerProps.onMouseEnter = showPopover
    triggerProps.onMouseLeave = scheduleHide
    popoverProps.onMouseEnter = cancelHide
    popoverProps.onMouseLeave = scheduleHide
  } else if (trigger === 'focus') {
    triggerProps.onFocus = showPopover
    triggerProps.onBlur = hidePopover
  }

  return {
    show,
    position,
    triggerRef,
    popoverRef,
    triggerProps,
    popoverProps,
    toggle,
    showPopover,
    hidePopover,
    update
  }
}
