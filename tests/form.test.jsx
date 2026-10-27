import React, { useState } from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, FormItem, Input, Select, Option } from '../src'

const RULES = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  age: [{ type: 'number', min: 18, message: 'Must be an adult', trigger: 'change' }]
}

const Demo = ({ formRef, initial = { name: '', age: 20 }, onReset }) => {
  const [model, setModel] = useState(initial)
  return (
    <Form ref={formRef} model={model} rules={RULES} onReset={onReset}>
      <FormItem label="Name" prop="name">
        <Input value={model.name} onChange={(e) => setModel({ ...model, name: e.target.value })} />
      </FormItem>
      <FormItem label="City" prop="city" rules={[{ required: true, message: 'City is required' }]}>
        <Select value={model.city} onChange={(city) => setModel({ ...model, city })}>
          <Option value="x" label="Xanadu" />
        </Select>
      </FormItem>
    </Form>
  )
}

describe('Form', () => {
  it('renders labels', () => {
    render(<Demo />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('City')).toBeInTheDocument()
  })

  it('validates on blur and shows the message', async () => {
    render(<Demo />)
    const input = screen.getAllByRole('textbox')[0]
    await userEvent.click(input)
    await userEvent.tab()
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    await userEvent.type(input, 'Ada')
    await userEvent.tab()
    await waitFor(() => expect(screen.queryByText('Name is required')).toBeNull())
  })

  it('validate() reports failures through the callback', async () => {
    const ref = React.createRef()
    render(<Demo formRef={ref} />)

    const callback = vi.fn()
    await act(async () => { await ref.current.validate(callback).catch(() => {}) })
    expect(callback).toHaveBeenCalledWith(false)
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('City is required')).toBeInTheDocument()
  })

  it('validate() succeeds once the model is valid', async () => {
    const ref = React.createRef()
    render(<Demo formRef={ref} initial={{ name: 'Ada', age: 30, city: 'x' }} />)
    const callback = vi.fn()
    await act(async () => { await ref.current.validate(callback) })
    expect(callback).toHaveBeenCalledWith(true)
  })

  it('validateField() validates a single field', async () => {
    const ref = React.createRef()
    render(<Demo formRef={ref} />)
    await act(async () => { ref.current.validateField('name') })
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.queryByText('City is required')).toBeNull()
  })

  it('resetFields() clears errors and reports the initial values', async () => {
    const ref = React.createRef()
    const onReset = vi.fn()
    render(<Demo formRef={ref} onReset={onReset} />)
    await act(async () => { ref.current.validateField('name') })
    await screen.findByText('Name is required')
    await act(async () => { ref.current.resetFields() })
    expect(screen.queryByText('Name is required')).toBeNull()
    expect(onReset).toHaveBeenCalledWith({ name: '', city: undefined })
  })
})
