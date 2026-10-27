import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import Button from '../../button/src/Button'
import Input from '../../input/src/Input'
import { useSyncedState } from '../../../hooks/useSyncedState'
import { transitionClass, usePresence } from '../../../utils/transition'

const ICONS = {
  success: 'icon-check-circle',
  error: 'icon-x-circle',
  warning: 'icon-alert-circle',
  info: 'icon-info'
}

/**
 * `value` controls visibility and `onChange(false)` fires when the modal
 * closes itself. `onConfirm(inputValue)` fires for the OK button and
 * `onCancel()` for the cancel button, the close icon, the mask and Esc.
 */
const Modal = (props) => {
  const {
    title,
    content,
    value: valueProp = false,
    cancelText = 'Cancel',
    okText = 'OK',
    maskClosable = true,
    showHead = true,
    showClose = true,
    showFooter = true,
    showInput = false,
    showCancelButton = true,
    showConfirmButton = true,
    inputPlaceholder = '',
    width = 520,
    closeOnPressEsc = true,
    styles,
    type,
    header,
    footer,
    onCancel,
    onConfirm,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const [visible, setVisible] = useSyncedState(valueProp, false)
  const [inputValue, setInputValue] = useState('')
  const { mounted, phase } = usePresence(visible)
  const handlersRef = useRef({})

  const isIconType = Object.prototype.hasOwnProperty.call(ICONS, type)

  const close = (action) => {
    setVisible(false)
    if (onChange) onChange(false)
    if (action === 'confirm') {
      if (onConfirm) onConfirm(showInput ? inputValue : undefined)
    } else if (onCancel) {
      onCancel()
    }
  }

  // Always call the latest closure from the global key handler.
  handlersRef.current.close = close

  useEffect(() => {
    if (visible) setInputValue('')
  }, [visible])

  useEffect(() => {
    if (!visible || !closeOnPressEsc) return

    const handleKeyDown = (evt) => {
      if (evt.key === 'Escape') handlersRef.current.close('cancel')
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible, closeOnPressEsc])

  if (!mounted) return null

  const handleWrapperClick = (evt) => {
    if (maskClosable && evt.target === evt.currentTarget) close('cancel')
  }

  const hasHeader = showHead && (header || title)

  return (
    <div {...restProps}>
      <div
        className={classNames('at-modal__mask', transitionClass('fade', phase))}
        onClick={() => maskClosable && close('cancel')}
      />
      <div
        className={classNames('at-modal__wrapper', {
          'at-modal--confirm': isIconType,
          [`at-modal--confirm-${type}`]: isIconType
        })}
        onClick={handleWrapperClick}
      >
        <div
          className={classNames('at-modal', transitionClass('fade', phase), className)}
          style={{ width: typeof width === 'number' ? `${width}px` : width, ...styles }}
          role="dialog"
          aria-modal="true"
        >
          {hasHeader && (
            <div className="at-modal__header">
              <div className="at-modal__title">
                {header || <p>{title}</p>}
              </div>
            </div>
          )}
          <div className="at-modal__body">
            {children !== undefined ? children : (
              <>
                {content && <p>{content}</p>}
                {showInput && (
                  <div className="at-modal__input">
                    <Input
                      autofocus
                      value={inputValue}
                      placeholder={inputPlaceholder}
                      onChange={(evt) => setInputValue(evt.target.value)}
                      onKeyUp={(evt) => evt.key === 'Enter' && close('confirm')}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {showFooter && (
            <div className="at-modal__footer">
              {footer || (
                <>
                  {showCancelButton && (
                    <Button onClick={() => close('cancel')}>{cancelText}</Button>
                  )}
                  {showConfirmButton && (
                    <Button type="primary" onClick={() => close('confirm')}>{okText}</Button>
                  )}
                </>
              )}
            </div>
          )}
          {isIconType && <i className={`icon at-modal__icon ${ICONS[type]}`} />}
          {showClose && (
            <span className="at-modal__close" onClick={() => close('cancel')}>
              <i className="icon icon-x" />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

Modal.displayName = 'AtModal'

export default Modal
