import React, { useCallback, useImperativeHandle, useRef } from 'react'
import classNames from 'classnames'
import { FormContext } from './context'

/**
 * Wraps <FormItem>s and validates them against `rules` (async-validator
 * format, keyed by each item's `prop`).
 *
 * Via `ref`:
 *  - `validate(callback?)` -> Promise<boolean>
 *  - `validateField(prop, callback?)` -> Promise<string> (error message or '')
 *  - `resetFields()` clears validation state and calls `onReset(initialValues)`
 *    so you can restore your model state.
 */
const Form = React.forwardRef((props, ref) => {
  const {
    model,
    rules,
    labelWidth,
    layout,
    inline = false,
    showMessage = true,
    onReset,
    className,
    children,
    ...restProps
  } = props

  const fieldsRef = useRef([])

  const register = useCallback((field) => {
    fieldsRef.current = [...fieldsRef.current, field]
    return () => {
      fieldsRef.current = fieldsRef.current.filter(item => item !== field)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    validate (callback) {
      const fields = fieldsRef.current

      return Promise.all(fields.map(field => field.validate(''))).then((messages) => {
        const valid = messages.every(message => !message)
        if (typeof callback === 'function') callback(valid)
        return valid
      })
    },
    validateField (prop, callback) {
      const field = fieldsRef.current.find(item => item.prop === prop)
      if (!field) throw new Error('Must call validateField with valid prop string!')

      return field.validate('').then((message) => {
        if (typeof callback === 'function') callback(message)
        return message
      })
    },
    resetFields () {
      const initialValues = {}
      fieldsRef.current.forEach((field) => {
        field.resetField()
        initialValues[field.prop] = field.initialValue
      })
      if (onReset) onReset(initialValues)
    }
  }))

  return (
    <FormContext.Provider value={{ model, rules, labelWidth, showMessage, register }}>
      <form
        className={classNames(
          'at-form',
          {
            [`at-form--label-${layout}`]: layout,
            'at-form--inline': inline || layout === 'inline'
          },
          className
        )}
        {...restProps}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
})

Form.displayName = 'AtForm'

export default Form
