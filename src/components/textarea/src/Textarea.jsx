import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import styles from './Textarea.module.scss'

const Textarea = React.forwardRef((props, ref) => {
  const {
    value: valueProp,
    name,
    placeholder,
    readonly = false,
    disabled = false,
    rows = 2,
    minlength,
    maxlength,
    autofocus = false,
    autosize = false,
    minRows,
    maxRows,
    resize = 'vertical',
    onChange,
    onFocus,
    onBlur,
    className,
    ...restProps
  } = props

  const [store, setStore] = useState(valueProp || '')
  const [calculateStyle, setCalculateStyle] = useState({})
  const textareaRef = ref || useRef(null)
  const formItem = useFormItem()

  useEffect(() => {
    if (valueProp !== store) {
      setStore(valueProp || '')
    }
  }, [valueProp])

  useEffect(() => {
    resizeTextarea()
  }, [store, autosize, minRows, maxRows])

  const resizeTextarea = () => {
    if (!autosize && !minRows && !maxRows) return
    if (!textareaRef.current) return

    // Simplified resize logic - can be enhanced later
    const textarea = textareaRef.current
    const style = {
      resize: resize
    }

    if (autosize || minRows || maxRows) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight, 10) || 20

      if (minRows) {
        style.minHeight = `${lineHeight * minRows}px`
      }
      if (maxRows) {
        style.maxHeight = `${lineHeight * maxRows}px`
      }
      if (autosize && !maxRows) {
        style.height = `${scrollHeight}px`
      }
    }

    setCalculateStyle(style)
  }

  const textareaStyle = {
    ...calculateStyle,
    resize: resize
  }

  const textareaClasses = classNames(
    'at-textarea',
    {
      'at-textarea--disabled': disabled
    },
    className
  )

  const handleFocus = (evt) => {
    if (onFocus) {
      onFocus(evt)
    }
  }

  const handleBlur = (evt) => {
    if (onBlur) {
      onBlur(evt)
    }
    if (formItem && formItem.onBlur) {
      formItem.onBlur(store)
    }
  }

  const handleInput = (evt) => {
    const newValue = evt.target.value
    setStore(newValue)

    if (onChange) {
      // Support both React standard (event) and custom (value) onChange signatures
      if (onChange.length === 1) {
        onChange(evt)
      } else {
        onChange(newValue, evt)
      }
    }

    if (formItem && formItem.onChange) {
      formItem.onChange(newValue)
    }
  }

  return (
    <div className={textareaClasses}>
      <textarea
        ref={textareaRef}
        className="at-textarea__original"
        value={store}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        style={textareaStyle}
        readOnly={readonly}
        rows={rows}
        autoFocus={autofocus}
        maxLength={maxlength}
        minLength={minlength}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...restProps}
      />
    </div>
  )
})

Textarea.displayName = 'AtTextarea'

export default Textarea

