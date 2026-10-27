import React, { useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'
import { calcTextareaHeight } from './utils'

/**
 * Multi-line input. `onChange` receives the native change event.
 */
const Textarea = React.forwardRef((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
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

  const [store, setStore] = useSyncedState(valueProp, defaultValue !== undefined ? defaultValue : '')
  const [calculateStyle, setCalculateStyle] = useState({})
  const textareaRef = useRef(null)
  const formItem = useFormItem()

  useImperativeHandle(ref, () => textareaRef.current)

  const resizeTextarea = useCallback(() => {
    if (!autosize && !minRows && !maxRows) return
    if (!textareaRef.current) return

    setCalculateStyle(calcTextareaHeight(
      textareaRef.current,
      minRows ? Number(minRows) : 1,
      maxRows ? Number(maxRows) : null
    ))
  }, [autosize, minRows, maxRows])

  useLayoutEffect(() => {
    resizeTextarea()
  }, [store, resizeTextarea])

  const textareaClasses = classNames(
    'at-textarea',
    { 'at-textarea--disabled': disabled },
    className
  )

  const handleBlur = (evt) => {
    if (onBlur) onBlur(evt)
    if (formItem) formItem.onBlur(store)
  }

  const handleChange = (evt) => {
    const newValue = evt.target.value
    setStore(newValue)
    if (onChange) onChange(evt)
    if (formItem) formItem.onChange(newValue)
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
        style={{ ...calculateStyle, resize }}
        readOnly={readonly}
        rows={rows}
        autoFocus={autofocus}
        maxLength={maxlength}
        minLength={minlength}
        {...restProps}
        onFocus={onFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  )
})

Textarea.displayName = 'AtTextarea'

export default Textarea
