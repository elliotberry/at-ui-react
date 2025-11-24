import { useContext, createContext } from 'react'

export const FormItemContext = createContext(null)

export const useFormItem = () => {
  const context = useContext(FormItemContext)
  return context
}

