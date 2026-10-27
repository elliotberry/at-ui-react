import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Table, Menu, MenuItem, MenuItemGroup, Submenu, Dropdown, DropdownMenu, DropdownItem, Progress
} from '../src'

const columns = [
  { title: 'Name', key: 'name', sortType: 'normal' },
  { title: 'Age', key: 'age', sortType: 'normal', render: (row) => <b>{row.age} y</b> }
]
const data = [
  { name: 'Cara', age: 30 },
  { name: 'Abe', age: 20 },
  { name: 'Bea', age: 25 }
]
const rowsOf = (container) => Array.from(container.querySelectorAll('.at-table__tbody tr'))

describe('Table', () => {
  it('renders headers, rows and custom cells', () => {
    const { container } = render(<Table columns={columns} data={data} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(rowsOf(container)).toHaveLength(3)
    expect(screen.getByText('30 y').tagName).toBe('B')
  })

  it('shows the empty text without data', () => {
    render(<Table columns={columns} data={[]} emptyText="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('sorts by a column: desc on the first click, asc on the second', async () => {
    const onSortChange = vi.fn()
    const { container } = render(<Table columns={columns} data={data} onSortChange={onSortChange} />)
    const names = () => rowsOf(container).map(row => row.querySelector('td').textContent)
    const header = container.querySelectorAll('.at-table__column')[0]

    await userEvent.click(header)
    expect(onSortChange).toHaveBeenLastCalledWith(expect.objectContaining({ order: 'desc', key: 'name' }))
    expect(names()).toEqual(['Cara', 'Bea', 'Abe'])

    await userEvent.click(header)
    expect(onSortChange).toHaveBeenLastCalledWith(expect.objectContaining({ order: 'asc', key: 'name' }))
    expect(names()).toEqual(['Abe', 'Bea', 'Cara'])
  })

  it('selects rows when optional', async () => {
    const onSelectionChange = vi.fn()
    const { container } = render(<Table columns={columns} data={data} optional onSelectionChange={onSelectionChange} />)
    const boxes = container.querySelectorAll('tbody input[type="checkbox"]')
    await userEvent.click(boxes[1])
    expect(onSelectionChange).toHaveBeenLastCalledWith([data[1]])
  })

  it('paginates', async () => {
    const many = Array.from({ length: 25 }, (_, i) => ({ name: `Row ${i}`, age: i }))
    const onPageChange = vi.fn()
    const { container } = render(<Table columns={columns} data={many} pagination pageSize={10} onPageChange={onPageChange} />)
    expect(rowsOf(container)).toHaveLength(10)
    await userEvent.click(container.querySelector('.at-pagination__next'))
    expect(onPageChange).toHaveBeenLastCalledWith(2)
    expect(screen.getByText('Row 10')).toBeInTheDocument()
  })
})

describe('Menu', () => {
  it('selects items and reports the name', async () => {
    const onSelect = vi.fn()
    const { container } = render(
      <Menu defaultActiveName="a" onSelect={onSelect}>
        <MenuItem name="a">A</MenuItem>
        <MenuItem name="b">B</MenuItem>
        <MenuItem name="c" disabled>C</MenuItem>
      </Menu>
    )
    await userEvent.click(screen.getByText('B'))
    expect(onSelect).toHaveBeenCalledWith('b')
    await userEvent.click(screen.getByText('C'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.at-menu__item--active')).toHaveTextContent('B')
  })

  it('opens a submenu on click in inline mode', async () => {
    render(
      <Menu>
        <Submenu title="Group">
          <MenuItem name="inner">Inner</MenuItem>
        </Submenu>
      </Menu>
    )
    expect(screen.queryByText('Inner')).toBeNull()
    await userEvent.click(screen.getByText('Group'))
    expect(screen.getByText('Inner')).toBeInTheDocument()
  })

  it('renders item groups', () => {
    render(
      <Menu>
        <MenuItemGroup title="Section">
          <MenuItem name="a">A</MenuItem>
        </MenuItemGroup>
      </Menu>
    )
    expect(screen.getByText('Section')).toBeInTheDocument()
  })
})

describe('Dropdown', () => {
  it('opens on click and reports the command', async () => {
    const onCommand = vi.fn()
    const { container } = render(
      <Dropdown trigger="click" onCommand={onCommand}>
        <button>menu</button>
        <DropdownMenu>
          <DropdownItem name="one">One</DropdownItem>
          <DropdownItem name="two" disabled>Two</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
    expect(screen.queryByText('One')).toBeNull()
    await userEvent.click(container.querySelector('.at-dropdown__trigger'))
    await userEvent.click(await screen.findByText('One'))
    expect(onCommand).toHaveBeenCalledWith('one')
  })

  it('does not run disabled items', async () => {
    const onCommand = vi.fn()
    const { container } = render(
      <Dropdown trigger="click" onCommand={onCommand}>
        <button>menu</button>
        <DropdownMenu>
          <DropdownItem name="two" disabled>Two</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
    await userEvent.click(container.querySelector('.at-dropdown__trigger'))
    await userEvent.click(await screen.findByText('Two'))
    expect(onCommand).not.toHaveBeenCalled()
  })
})

describe('Progress', () => {
  it('shows the percentage and success status at 100', () => {
    const { container } = render(<Progress percent={100} />)
    expect(container.querySelector('.at-progress')).toHaveClass('at-progress--success')
  })
})
