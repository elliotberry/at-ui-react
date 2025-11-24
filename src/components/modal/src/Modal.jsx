import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import Button from '../../button/src/Button'
import Input from '../../input/src/Input'
import styles from './Modal.module.scss'

const Modal = (props) => {
  const {
    title,
    content,
    value: valueProp = false,
    cancelText,
    okText,
    maskClosable = true,
    showHead = true,
    showClose = true,
    showFooter = true,
    showInput = false,
    width = 520,
    closeOnPressEsc = true,
    styles = {},
    type,
    onCancel,
    onConfirm,
    onChange,
    className,
    children,
    ...restProps
  } = props

  const [visible, setVisible] = useState(valueProp)
  const [wrapShow, setWrapShow] = useState(valueProp)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setVisible(valueProp)
    if (valueProp) {
      setWrapShow(true)
    }
  }, [valueProp])

  useEffect(() => {
    const handleKeyCode = (evt) => {
      if (visible && showClose && evt.keyCode === 27) {
        doClose()
      }
    }

    if (closeOnPressEsc) {
      document.addEventListener('keydown', handleKeyCode)
      return () => {
        document.removeEventListener('keydown', handleKeyCode)
      }
    }
  }, [visible, showClose, closeOnPressEsc])

  const iconClassMap = {
    'success': 'icon-check-circle',
    'error': 'icon-x-circle',
    'warning': 'icon-alert-circle',
    'info': 'icon-info'
  }

  const iconClass = iconClassMap[type] || ''
  const isIconType = ['success', 'error', 'warning', 'info'].includes(type)
  const localeOKText = okText !== undefined ? okText : 'OK'
  const localeCancelText = cancelText !== undefined ? cancelText : 'Cancel'

  const modalStyle = {
    width: `${width}px`,
    ...styles
  }

  const doClose = () => {
    setVisible(false)
    if (onChange) {
      onChange(false)
    }
    if (onCancel) {
      onCancel()
    }
    setTimeout(() => {
      setWrapShow(false)
    }, 300)
  }

  const handleMaskClick = () => {
    if (maskClosable) {
      doClose()
    }
  }

  const handleAction = (action) => {
    if (action === 'confirm') {
      if (onConfirm) {
        onConfirm(inputValue)
      }
      if (onChange) {
        onChange(false)
      }
    }
    doClose()
  }

  const modalWrapperClasses = classNames(
    'at-modal__wrapper',
    {
      'at-modal--hidden': !wrapShow,
      'at-modal--confirm': isIconType,
      [`at-modal--confirm-${type}`]: isIconType
    }
  )

  if (!wrapShow) return null

  return (
    <div {...restProps}>
      {visible && (
        <div className="at-modal__mask" onClick={handleMaskClick} />
      )}
      <div className={modalWrapperClasses} onClick={maskClosable ? handleMaskClick : undefined}>
        {visible && (
          <div className={classNames('at-modal', className)} style={modalStyle}>
            {showHead && (
              <div className="at-modal__header">
                <div className="at-modal__title">
                  {title && <p>{title}</p>}
                </div>
              </div>
            )}
            <div className="at-modal__body">
              {children || (
                <>
                  {content && <p>{content}</p>}
                  {showInput && (
                    <div className="at-modal__input">
                      <Input
                        value={inputValue}
                        onChange={(val) => setInputValue(val)}
                        onKeyUp={(e) => {
                          if (e.keyCode === 13) {
                            handleAction('confirm')
                          }
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            {showFooter && (
              <div className="at-modal__footer">
                <Button onClick={() => handleAction('cancel')}>
                  {localeCancelText}
                </Button>
                <Button type="primary" onClick={() => handleAction('confirm')}>
                  {localeOKText}
                </Button>
              </div>
            )}
            {isIconType && <i className={`icon at-modal__icon ${iconClass}`} />}
            {showClose && (
              <span className="at-modal__close" onClick={() => handleAction('cancel')}>
                <i className="icon icon-x" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

Modal.displayName = 'AtModal'

export default Modal

