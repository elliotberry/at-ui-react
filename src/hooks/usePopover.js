import { useState, useEffect, useRef, useCallback } from 'react'

export const usePopover = ({
  trigger = 'hover',
  placement = 'top',
  value: valueProp = false,
  onToggle
}) => {
  const [show, setShow] = useState(valueProp)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const popoverRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    setShow(valueProp)
  }, [valueProp])

  const setPopoverPosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return

    const trigger = triggerRef.current
    const popover = popoverRef.current

    let newPosition = { top: 0, left: 0 }

    switch (placement) {
      case 'top':
        newPosition.left = trigger.offsetLeft - (popover.offsetWidth / 2) + (trigger.offsetWidth / 2)
        newPosition.top = trigger.offsetTop - popover.offsetHeight
        break
      case 'top-left':
        newPosition.left = trigger.offsetLeft
        newPosition.top = trigger.offsetTop - popover.offsetHeight
        break
      case 'top-right':
        newPosition.left = trigger.offsetLeft + trigger.offsetWidth - popover.offsetWidth
        newPosition.top = trigger.offsetTop - popover.offsetHeight
        break
      case 'left':
        newPosition.left = trigger.offsetLeft - popover.offsetWidth
        newPosition.top = trigger.offsetTop + (trigger.offsetHeight / 2) - (popover.offsetHeight / 2)
        break
      case 'left-top':
        newPosition.left = trigger.offsetLeft - popover.offsetWidth
        newPosition.top = trigger.offsetTop
        break
      case 'left-bottom':
        newPosition.left = trigger.offsetLeft - popover.offsetWidth
        newPosition.top = trigger.offsetTop + trigger.offsetHeight - popover.offsetHeight
        break
      case 'right':
        newPosition.left = trigger.offsetLeft + trigger.offsetWidth
        newPosition.top = trigger.offsetTop + (trigger.offsetHeight / 2) - (popover.offsetHeight / 2)
        break
      case 'right-top':
        newPosition.left = trigger.offsetLeft + trigger.offsetWidth
        newPosition.top = trigger.offsetTop
        break
      case 'right-bottom':
        newPosition.left = trigger.offsetLeft + trigger.offsetWidth
        newPosition.top = trigger.offsetTop + trigger.offsetHeight - popover.offsetHeight
        break
      case 'bottom':
        newPosition.left = trigger.offsetLeft - (popover.offsetWidth / 2) + (trigger.offsetWidth / 2)
        newPosition.top = trigger.offsetTop + trigger.offsetHeight
        break
      case 'bottom-left':
        newPosition.left = trigger.offsetLeft
        newPosition.top = trigger.offsetTop + trigger.offsetHeight
        break
      case 'bottom-right':
        newPosition.left = trigger.offsetLeft + trigger.offsetWidth - popover.offsetWidth
        newPosition.top = trigger.offsetTop + trigger.offsetHeight
        break
      default:
        newPosition.left = trigger.offsetLeft - (popover.offsetWidth / 2) + (trigger.offsetWidth / 2)
        newPosition.top = trigger.offsetTop - popover.offsetHeight
    }

    setPosition(newPosition)
    if (popover) {
      popover.style.top = `${newPosition.top}px`
      popover.style.left = `${newPosition.left}px`
    }
  }, [placement])

  const toggle = useCallback(() => {
    const newShow = !show
    setShow(newShow)
    if (onToggle) {
      onToggle(newShow)
    }
    if (newShow) {
      setTimeout(setPopoverPosition, 0)
    }
  }, [show, onToggle, setPopoverPosition])

  const showPopover = useCallback(() => {
    setShow(true)
    setTimeout(setPopoverPosition, 0)
  }, [setPopoverPosition])

  const hidePopover = useCallback(() => {
    setShow(false)
  }, [])

  const handleMouseEnter = useCallback(() => {
    showPopover()
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [showPopover])

  const handleMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => {
      hidePopover()
    }, 200)
  }, [hidePopover])

  useEffect(() => {
    const triggerEl = triggerRef.current
    if (!triggerEl) return

    if (trigger === 'click') {
      triggerEl.addEventListener('click', toggle)
    } else if (trigger === 'hover') {
      triggerEl.addEventListener('mouseenter', handleMouseEnter)
      triggerEl.addEventListener('mouseleave', handleMouseLeave)
    } else if (trigger === 'focus') {
      triggerEl.addEventListener('focus', showPopover)
      triggerEl.addEventListener('blur', hidePopover)
    }

    return () => {
      if (trigger === 'click') {
        triggerEl.removeEventListener('click', toggle)
      } else if (trigger === 'hover') {
        triggerEl.removeEventListener('mouseenter', handleMouseEnter)
        triggerEl.removeEventListener('mouseleave', handleMouseLeave)
      } else if (trigger === 'focus') {
        triggerEl.removeEventListener('focus', showPopover)
        triggerEl.removeEventListener('blur', hidePopover)
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [trigger, toggle, handleMouseEnter, handleMouseLeave, showPopover, hidePopover])

  return {
    show,
    position,
    triggerRef,
    popoverRef,
    toggle,
    showPopover,
    hidePopover,
    handleMouseEnter,
    handleMouseLeave
  }
}

