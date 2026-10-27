import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select, Option, OptionGroup } from '../src'

const renderSelect = (props = {}) => render(
  <Select {...props}>
    <Option value="a" label="Alpha" />
    <Option value="b" label="Beta" />
    <Option value="c" label="Gamma" disabled />
  </Select>
)

describe('Select', () => {
  it('shows the placeholder and opens on click', async () => {
    const { container } = renderSelect({ placeholder: 'Pick one' })
    expect(screen.getByText('Pick one')).toBeInTheDocument()
    await userEvent.click(container.querySelector('.at-select__selection'))
    expect(container.querySelector('.at-select')).toHaveClass('at-select--visible')
    expect(screen.getAllByRole('option').length).toBeGreaterThanOrEqual(3)
  })

  it('selects an option, closes and reports the value', async () => {
    const onChange = vi.fn()
    const { container } = renderSelect({ onChange })
    await userEvent.click(container.querySelector('.at-select__selection'))
    await userEvent.click(screen.getByText('Beta'))
    expect(onChange).toHaveBeenCalledWith('b')
    expect(container.querySelector('.at-select__selected')).toHaveTextContent('Beta')
    expect(container.querySelector('.at-select')).not.toHaveClass('at-select--visible')
  })

  it('does not select disabled options', async () => {
    const onChange = vi.fn()
    const { container } = renderSelect({ onChange })
    await userEvent.click(container.querySelector('.at-select__selection'))
    await userEvent.click(screen.getByText('Gamma'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('follows a controlled value', () => {
    const { container, rerender } = render(
      <Select value="a"><Option value="a" label="Alpha" /><Option value="b" label="Beta" /></Select>
    )
    expect(container.querySelector('.at-select__selected')).toHaveTextContent('Alpha')
    rerender(<Select value="b"><Option value="a" label="Alpha" /><Option value="b" label="Beta" /></Select>)
    expect(container.querySelector('.at-select__selected')).toHaveTextContent('Beta')
  })

  it('supports multiple selection', async () => {
    const onChange = vi.fn()
    const { container } = renderSelect({ multiple: true, onChange })
    await userEvent.click(container.querySelector('.at-select__selection'))
    await userEvent.click(screen.getByText('Alpha'))
    await userEvent.click(screen.getByText('Beta'))
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b'])
    expect(container.querySelectorAll('.at-select__selection .at-tag')).toHaveLength(2)
    await userEvent.click(screen.getAllByRole('option')[0])
    expect(onChange).toHaveBeenLastCalledWith(['b'])
  })

  it('clears the value when clearable', async () => {
    const onChange = vi.fn()
    const { container } = renderSelect({ clearable: true, defaultValue: 'a', onChange })
    expect(container.querySelector('.at-select')).toHaveClass('at-select--show-clear')
    await userEvent.click(container.querySelector('.at-select__clear'))
    expect(onChange).toHaveBeenLastCalledWith('')
  })

  it('filters options while typing', async () => {
    const { container } = renderSelect({ filterable: true })
    await userEvent.click(container.querySelector('.at-select__selection'))
    await userEvent.type(container.querySelector('.at-select__input'), 'bet')
    const visible = Array.from(container.querySelectorAll('.at-select__option'))
      .filter(el => el.style.display !== 'none')
    expect(visible.map(el => el.textContent)).toEqual(['Beta'])
  })

  it('reports value with label when requested', async () => {
    const onChange = vi.fn()
    const { container } = renderSelect({ valueWithLabel: true, onChange })
    await userEvent.click(container.querySelector('.at-select__selection'))
    await userEvent.click(screen.getByText('Alpha'))
    expect(onChange).toHaveBeenCalledWith({ value: 'a', label: 'Alpha' })
  })

  it('opens and picks with the keyboard', async () => {
    const onChange = vi.fn()
    const { container } = renderSelect({ filterable: true, onChange })
    const input = container.querySelector('.at-select__input')
    await userEvent.click(container.querySelector('.at-select__selection'))
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('does not open when disabled', async () => {
    const { container } = renderSelect({ disabled: true })
    await userEvent.click(container.querySelector('.at-select__selection'))
    expect(container.querySelector('.at-select')).not.toHaveClass('at-select--visible')
  })

  it('renders grouped options', async () => {
    const { container } = render(
      <Select>
        <OptionGroup label="Letters">
          <Option value="a" label="Alpha" />
        </OptionGroup>
      </Select>
    )
    await userEvent.click(container.querySelector('.at-select__selection'))
    expect(screen.getByText('Letters')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Alpha'))
    expect(container.querySelector('.at-select__selected')).toHaveTextContent('Alpha')
  })
})
