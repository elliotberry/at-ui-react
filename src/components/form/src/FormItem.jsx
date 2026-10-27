import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import Schema from 'async-validator'
import { FormContext, getPropByPath } from './context'
import { FormItemContext } from '../../../hooks/useFormItem'

const toArray = (rules) => (rules === undefined || rules === null ? [] : [].concat(rules))

/**
 * One labelled field. Set `prop` to the key of the value in the form's
 * `model` to enable validation; controls inside report their changes and
 * blurs automatically.
 */
const FormItem = (props) => {
  const {
    label = '',
    labelWidth: labelWidthProp,
    prop,
    required = false,
    rules: rulesProp,
    error,
    validateStatus,
    showMessage = true,
    className,
    children,
    ...restProps
  } = props

  const form = useContext(FormContext)
  const [validateState, setValidateState] = useState('')
  const [validateMessage, setValidateMessage] = useState('')
  const runRef = useRef(0)
  const initialValueRef = useRef(form && prop ? getPropByPath(form.model, prop) : undefined)

  const getRules = useCallback(() => {
    const own = toArray(rulesProp)
    if (own.length) return own
    return toArray(form && form.rules && prop ? form.rules[prop] : undefined)
  }, [rulesProp, form, prop])

  const isRequired = required || getRules().some(rule => rule.required)

  // Keep the latest model/rules reachable from the stable field object.
  const latest = useRef({})
  latest.current = { form, getRules, prop }

  const validate = useCallback((trigger, valueOverride) => {
    const { form, getRules, prop } = latest.current
    const rules = getRules().filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1)

    if (!prop || !rules.length) return Promise.resolve('')

    const run = ++runRef.current
    setValidateState('validating')

    const value = valueOverride !== undefined ? valueOverride : getPropByPath(form && form.model, prop)
    const validator = new Schema({ [prop]: rules })

    return validator.validate({ [prop]: value }, { firstFields: true })
      .then(() => '')
      .catch(({ errors }) => (errors && errors[0] ? errors[0].message : 'Validation failed'))
      .then((message) => {
        // Ignore results that were superseded by a newer validation.
        if (run === runRef.current) {
          setValidateState(message ? 'error' : 'success')
          setValidateMessage(message)
        }
        return message
      })
  }, [])

  useEffect(() => {
    if (!form || !prop) return

    const field = {
      prop,
      get initialValue () { return initialValueRef.current },
      validate: (trigger) => validate(trigger),
      resetField () {
        runRef.current++
        setValidateState('')
        setValidateMessage('')
      }
    }
    return form.register(field)
  }, [form && form.register, prop, validate]) // eslint-disable-line react-hooks/exhaustive-deps

  // Externally controlled status / message
  useEffect(() => {
    if (error) {
      setValidateMessage(error)
      setValidateState('error')
    }
  }, [error])

  useEffect(() => {
    if (validateStatus) setValidateState(validateStatus)
  }, [validateStatus])

  const itemContext = useMemo(() => ({
    onChange: (value) => { validate('change', value) },
    onBlur: (value) => { validate('blur', value) }
  }), [validate])

  const labelWidth = labelWidthProp || (form && form.labelWidth)
  const formShowMessage = form ? form.showMessage : true

  return (
    <div
      className={classNames(
        'at-form-item',
        {
          'at-form-item--required': isRequired,
          'at-form-item--error': validateState === 'error',
          'at-form-item--validating': validateState === 'validating'
        },
        className
      )}
      {...restProps}
    >
      {label && (
        <label className="at-form-item__label" style={labelWidth ? { width: `${labelWidth}px` } : undefined}>
          {label}
        </label>
      )}
      <div
        className="at-form-item__content"
        style={labelWidth ? { marginLeft: `${labelWidth}px` } : undefined}
      >
        <FormItemContext.Provider value={prop ? itemContext : null}>
          {children}
        </FormItemContext.Provider>
        {validateState === 'error' && showMessage && formShowMessage && (
          <div className="at-form-item__error-tip">{validateMessage}</div>
        )}
      </div>
    </div>
  )
}

FormItem.displayName = 'AtFormItem'

export default FormItem
