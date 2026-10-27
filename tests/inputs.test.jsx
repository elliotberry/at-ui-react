import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Input, Textarea, InputNumber, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Slider, Rate
} from '../src'

describe('Input', () => {
  it('calls onChange with the event and supports controlled use', async () => {
    const seen = []
    const Controlled = () => {
      const [value, setValue] = useState('')
      return <Input value={value} onChange={(evt) => { seen.push(evt.target.value); setValue(evt.target.value) }} />
    }
    render(<Controlled />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'abc')
    expect(input).toHaveValue('abc')
    expect(seen).toEqual(['a', 'ab', 'abc'])
  })

  it('works without an onChange handler and respects defaultValue', async () => {
    render(<Input defaultValue="hi" />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '!')
    expect(input).toHaveValue('hi!')
  })

  it('does not take input while disabled', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})

describe('Textarea', () => {
  it('calls onChange with the event', async () => {
    const onChange = vi.fn()
    render(<Textarea onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'x')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].target.value).toBe('x')
  })
})

describe('InputNumber', () => {
  it('steps within min/max and avoids float artefacts', async () => {
    const onChange = vi.fn()
    const { container } = render(<InputNumber defaultValue={0.1} step={0.2} min={0} max={0.5} onChange={onChange} />)
    const up = container.querySelector('.at-input-number__up')
    const down = container.querySelector('.at-input-number__down')
    await userEvent.click(up)
    expect(onChange).toHaveBeenLastCalledWith(0.3)
    await userEvent.click(up)
    expect(onChange).toHaveBeenLastCalledWith(0.5)
    await userEvent.click(up)
    expect(screen.getByRole('spinbutton')).toHaveValue(0.5)
    await userEvent.click(down)
    expect(onChange).toHaveBeenLastCalledWith(0.3)
  })

  it('clamps typed values on blur', async () => {
    const onChange = vi.fn()
    render(<InputNumber defaultValue={1} min={0} max={10} onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    await userEvent.clear(input)
    await userEvent.type(input, '50')
    fireEvent.blur(input)
    expect(input).toHaveValue(10)
  })
})

describe('Checkbox and CheckboxGroup', () => {
  it('toggles a single checkbox', async () => {
    const onChange = vi.fn()
    render(<Checkbox label="a" onChange={onChange}>Apple</Checkbox>)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalled()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('collects values in a group', async () => {
    const onChange = vi.fn()
    render(
      <CheckboxGroup defaultValue={['a']} onChange={onChange}>
        <Checkbox label="a">A</Checkbox>
        <Checkbox label="b">B</Checkbox>
      </CheckboxGroup>
    )
    const [a, b] = screen.getAllByRole('checkbox')
    expect(a).toBeChecked()
    expect(b).not.toBeChecked()
    await userEvent.click(b)
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b'])
    await userEvent.click(a)
    expect(onChange).toHaveBeenLastCalledWith(['b'])
  })
})

describe('Radio and RadioGroup', () => {
  it('selects one value at a time', async () => {
    const onChange = vi.fn()
    render(
      <RadioGroup defaultValue="a" onChange={onChange}>
        <Radio label="a">A</Radio>
        <Radio label="b">B</Radio>
      </RadioGroup>
    )
    const [a, b] = screen.getAllByRole('radio')
    expect(a).toBeChecked()
    await userEvent.click(b)
    expect(onChange).toHaveBeenLastCalledWith('b')
    expect(b).toBeChecked()
    expect(a).not.toBeChecked()
  })
})

describe('Switch', () => {
  it('toggles and reports the new value', async () => {
    const onChange = vi.fn()
    const { container } = render(<Switch onChange={onChange} />)
    await userEvent.click(container.querySelector('.at-switch'))
    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(container.querySelector('.at-switch')).toHaveClass('at-switch--checked')
  })

  it('ignores clicks when disabled', async () => {
    const onChange = vi.fn()
    const { container } = render(<Switch disabled onChange={onChange} />)
    await userEvent.click(container.querySelector('.at-switch'))
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('Slider', () => {
  it('moves with the keyboard and stays inside its bounds', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={99} min={0} max={100} step={1} onChange={onChange} />)
    const handle = container.querySelector('.at-slider__dot')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith(100)
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenLastCalledWith(99)
  })
})

describe('Rate', () => {
  it('reports the clicked star', async () => {
    const onChange = vi.fn()
    const { container } = render(<Rate onChange={onChange} />)
    expect(container.querySelectorAll('.at-rate__item')).toHaveLength(5)
    const icons = container.querySelectorAll('.at-rate__icon')
    await userEvent.click(icons[2])
    expect(onChange).toHaveBeenLastCalledWith(3)
    expect(container.querySelectorAll('.at-rate__item--on')).toHaveLength(3)
  })

  it('supports half stars', async () => {
    const onChange = vi.fn()
    const { container } = render(<Rate allowHalf onChange={onChange} />)
    await userEvent.click(container.querySelectorAll('.at-rate__left')[1])
    expect(onChange).toHaveBeenLastCalledWith(1.5)
  })
})
