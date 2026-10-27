import { useContext, createContext } from 'react'

/**
 * Provided by <FormItem>. Form controls call `onChange(value)` and
 * `onBlur(value)` so the item can run its validation rules.
 */
export const FormItemContext = createContext(null)

export const useFormItem = () => useContext(FormItemContext)
