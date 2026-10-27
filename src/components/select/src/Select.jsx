import React, { useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { SelectContext, collectOptions } from './context'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { useFormItem } from '../../../hooks/useFormItem'
import { useSyncedState } from '../../../hooks/useSyncedState'

const isEmpty = (model) =>
  model === '' || model === undefined || model === null || (Array.isArray(model) && model.length === 0)

/**
 * Single and multiple select. `onChange` receives the new value (or an array
 * of values for `multiple`); with `valueWithLabel` it receives `{ value, label }`
 * objects instead.
 */
const Select = (props) => {
  const {
    value: valueProp,
    defaultValue,
    multiple = false,
    disabled = false,
    clearable = false,
    placeholder = 'Please select',
    filterable = false,
    size = 'normal',
    valueWithLabel = false,
    notFoundText = 'No matching data',
    placement = 'bottom',
    onChange,
    className,
    style,
    children,
    ...restProps
  } = props

  const [model, setModel] = useSyncedState(
    valueProp,
    defaultValue !== undefined ? defaultValue : (multiple ? [] : '')
  )
  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState('')
  const [typing, setTyping] = useState(false)
  const [focusValue, setFocusValue] = useState(undefined)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const formItem = useFormItem()

  const options = useMemo(() => collectOptions(children), [children])
  const modelArray = multiple ? (Array.isArray(model) ? model : []) : []

  const labelOf = (value) => {
    const found = options.find(option => option.value === value)
    return found ? found.label : String(value)
  }

  const selectedLabel = !multiple && !isEmpty(model) ? labelOf(model) : ''
  const showPlaceholder = isEmpty(model)
  const showClear = !multiple && clearable && !showPlaceholder && !disabled

  const activeQuery = filterable && typing ? query.trim().toLowerCase() : ''
  const isHidden = (value) => {
    if (!activeQuery) return false
    const option = options.find(item => item.value === value)
    return !!option && !option.label.toLowerCase().includes(activeQuery)
  }

  const visibleOptions = options.filter(option => !isHidden(option.value))
  const navigable = visibleOptions.filter(option => !option.disabled)
  const notFound = visibleOptions.length === 0

  const emitChange = (next) => {
    setModel(next)

    if (onChange) {
      if (valueWithLabel) {
        onChange(multiple
          ? next.map(value => ({ value, label: labelOf(value) }))
          : { value: next, label: labelOf(next) })
      } else {
        onChange(next)
      }
    }
    if (formItem) formItem.onChange(next)
  }

  const closeMenu = () => {
    if (visible && formItem) formItem.onBlur(model)
    setVisible(false)
    setTyping(false)
    setQuery('')
    setFocusValue(undefined)
  }

  const rootRef = useClickOutside(() => {
    if (visible) closeMenu()
  })

  const openMenu = () => {
    if (disabled) return
    setVisible(true)
  }

  const toggleMenu = () => {
    if (disabled) return
    if (visible) closeMenu()
    else openMenu()
  }

  const select = (value) => {
    if (disabled) return

    if (multiple) {
      const next = modelArray.includes(value)
        ? modelArray.filter(item => item !== value)
        : [...modelArray, value]
      emitChange(next)
      setQuery('')
      setTyping(false)
      if (inputRef.current) inputRef.current.focus()
    } else {
      if (value !== model) emitChange(value)
      closeMenu()
    }
  }

  const removeTag = (value) => {
    if (disabled) return
    emitChange(modelArray.filter(item => item !== value))
  }

  const clearSelect = (evt) => {
    evt.stopPropagation()
    emitChange('')
    setQuery('')
    setTyping(false)
  }

  const moveFocus = (direction) => {
    if (!navigable.length) return
    const current = navigable.findIndex(option => option.value === focusValue)
    let next
    if (current === -1) {
      next = direction === 'next' ? 0 : navigable.length - 1
    } else {
      next = (current + (direction === 'next' ? 1 : -1) + navigable.length) % navigable.length
    }
    setFocusValue(navigable[next].value)
  }

  const handleKeyDown = (evt) => {
    if (disabled) return

    if (!visible) {
      if (evt.key === 'ArrowDown' || evt.key === 'Enter') {
        evt.preventDefault()
        openMenu()
      }
      return
    }

    if (evt.key === 'Escape') {
      evt.preventDefault()
      closeMenu()
    } else if (evt.key === 'ArrowDown') {
      evt.preventDefault()
      moveFocus('next')
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault()
      moveFocus('prev')
    } else if (evt.key === 'Enter') {
      evt.preventDefault()
      const target = navigable.find(option => option.value === focusValue) || navigable[0]
      if (target) select(target.value)
    } else if (evt.key === 'Backspace' && multiple && filterable && query === '' && modelArray.length) {
      removeTag(modelArray[modelArray.length - 1])
    }
  }

  const handleInputChange = (evt) => {
    setQuery(evt.target.value)
    setTyping(true)
    setFocusValue(undefined)
    if (!visible) openMenu()
  }

  // Keep the keyboard-focused option in view.
  useEffect(() => {
    if (!visible || !dropdownRef.current) return
    const el = dropdownRef.current.querySelector('.at-select__option--focus')
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' })
  }, [focusValue, visible])

  // Focus the search input when the menu opens.
  useEffect(() => {
    if (visible && filterable && inputRef.current) inputRef.current.focus()
  }, [visible, filterable])

  const selectClasses = classNames(
    'at-select',
    {
      'at-select--visible': visible,
      'at-select--disabled': disabled,
      'at-select--multiple': multiple,
      'at-select--single': !multiple,
      'at-select--show-clear': showClear,
      [`at-select--${size}`]: !!size
    },
    className
  )

  const dropdownStyle = placement === 'top'
    ? { bottom: '100%', left: 0 }
    : { top: '100%', left: 0 }

  const contextValue = {
    isSelected: (value) => (multiple ? modelArray.includes(value) : model === value),
    isHidden,
    focusValue,
    setFocusValue,
    select
  }

  return (
    <SelectContext.Provider value={contextValue}>
      <div
        className={selectClasses}
        style={style}
        ref={rootRef}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        <div
          className="at-select__selection"
          role="combobox"
          aria-expanded={visible}
          aria-disabled={disabled}
          tabIndex={disabled || filterable ? -1 : 0}
          onClick={toggleMenu}
        >
          {multiple && modelArray.map(value => (
            <span className="at-tag" key={String(value)}>
              <span className="at-tag__text">{labelOf(value)}</span>
              <i
                className="icon icon-x at-tag__close"
                onClick={(evt) => {
                  evt.stopPropagation()
                  removeTag(value)
                }}
              />
            </span>
          ))}

          {showPlaceholder && !filterable && (
            <span className="at-select__placeholder">{placeholder}</span>
          )}
          {!showPlaceholder && !multiple && !filterable && (
            <span className="at-select__selected">{selectedLabel}</span>
          )}
          {filterable && (
            <input
              ref={inputRef}
              type="text"
              className="at-select__input"
              disabled={disabled}
              placeholder={showPlaceholder ? placeholder : ''}
              value={typing || multiple ? query : selectedLabel}
              onChange={handleInputChange}
            />
          )}

          <i className="icon icon-chevron-down at-select__arrow" />
          {showClear && (
            <i className="icon icon-x at-select__clear" onClick={clearSelect} />
          )}
        </div>

        {visible && (
          <div
            ref={dropdownRef}
            className={classNames('at-select__dropdown', `at-select__dropdown--${placement}`)}
            style={dropdownStyle}
          >
            {notFound && (
              <ul className="at-select__not-found">
                <li>{notFoundText}</li>
              </ul>
            )}
            <ul className="at-select__list" role="listbox" style={notFound ? { display: 'none' } : undefined}>
              {children}
            </ul>
          </div>
        )}
      </div>
    </SelectContext.Provider>
  )
}

Select.displayName = 'AtSelect'

export default Select
