import React from 'react'
import { render } from '@testing-library/react'
import AtUI, * as Named from '../src'

const EXPECTED = [
  'Button', 'ButtonGroup', 'Tag', 'Radio', 'RadioGroup', 'RadioButton', 'Checkbox', 'CheckboxGroup',
  'Input', 'InputNumber', 'Textarea', 'Badge', 'Switch', 'Alert', 'Card', 'Slider', 'Tooltip', 'Popover',
  'Progress', 'Rate', 'Breadcrumb', 'BreadcrumbItem', 'Pagination', 'Collapse', 'CollapseItem', 'Steps',
  'Step', 'Tabs', 'TabPane', 'Timeline', 'TimelineItem', 'LoadingBar', 'Modal', 'Dialog', 'Select',
  'Option', 'OptionGroup', 'Dropdown', 'DropdownMenu', 'DropdownItem', 'Message', 'Notification', 'Menu',
  'MenuItem', 'MenuItemGroup', 'Submenu', 'Table', 'Form', 'FormItem'
]

describe('package exports', () => {
  it.each(EXPECTED)('exports %s both as a named and a default-object member', (name) => {
    expect(Named[name]).toBeDefined()
    expect(AtUI[name]).toBe(Named[name])
  })

  it('does not export anything unexpected', () => {
    const names = Object.keys(Named).filter(key => key !== 'default').sort()
    expect(names).toEqual([...EXPECTED].sort())
  })

  it('exposes Form.Item', () => {
    expect(Named.Form.Item).toBe(Named.FormItem)
  })

  it('exposes the imperative APIs', () => {
    expect(typeof Named.Message.success).toBe('function')
    expect(typeof Named.Notification.error).toBe('function')
    expect(typeof Named.Dialog.confirm).toBe('function')
    expect(typeof Named.LoadingBar.start).toBe('function')
  })
})

describe('simple components render', () => {
  it('renders Button, Card, Tag, Badge and Alert content', () => {
    const { container, getByText } = render(
      <div>
        <Named.Button type="primary">Go</Named.Button>
        <Named.Card title="Title">Body</Named.Card>
        <Named.Tag color="success">Tagged</Named.Tag>
        <Named.Badge value={120} maxNum={99} />
        <Named.Alert message="Careful" type="warning" showIcon />
      </div>
    )
    expect(getByText('Go').closest('button')).toHaveClass('at-btn', 'at-btn--primary')
    expect(getByText('Title')).toBeInTheDocument()
    expect(getByText('Tagged').closest('.at-tag')).toHaveClass('at-tag--success')
    expect(container.querySelector('.at-badge__content').textContent).toBe('99+')
    expect(container.querySelector('.at-alert')).toHaveClass('at-alert--warning')
  })

  it('positions the Badge bubble in the corner only when it wraps something', () => {
    const { container } = render(
      <div>
        <Named.Badge value={1}><span>child</span></Named.Badge>
        <Named.Badge value={2} />
      </div>
    )
    const [wrapped, alone] = container.querySelectorAll('.at-badge')
    expect(wrapped).not.toHaveClass('at-badge--corner')
    expect(wrapped.querySelector('.at-badge__content')).toHaveClass('at-badge--corner')
    expect(alone).toHaveClass('at-badge--alone')
    expect(alone.querySelector('.at-badge__content')).not.toHaveClass('at-badge--corner')
  })

  it('lets a custom Alert icon win over the type icon', () => {
    const { container } = render(<Named.Alert message="x" type="success" showIcon icon="icon-star" />)
    expect(container.querySelector('.icon-star')).toBeInTheDocument()
    expect(container.querySelector('.icon-check-circle')).toBeNull()
  })
})
