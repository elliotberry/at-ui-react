import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Pagination, Tabs, TabPane, Steps, Step, Timeline, TimelineItem, Collapse, CollapseItem,
  Breadcrumb, BreadcrumbItem
} from '../src'

describe('Pagination', () => {
  it('moves between pages and reports changes', async () => {
    const onChange = vi.fn()
    const { container } = render(<Pagination total={50} pageSize={10} onChange={onChange} />)
    expect(container.querySelector('.at-pagination__item--active')).toHaveTextContent('1')
    await userEvent.click(container.querySelector('.at-pagination__next'))
    expect(onChange).toHaveBeenLastCalledWith(2)
    expect(container.querySelector('.at-pagination__item--active')).toHaveTextContent('2')
    await userEvent.click(screen.getByText('5'))
    expect(onChange).toHaveBeenLastCalledWith(5)
    await userEvent.click(container.querySelector('.at-pagination__prev'))
    expect(onChange).toHaveBeenLastCalledWith(4)
  })

  it('does not go past the first page', async () => {
    const onChange = vi.fn()
    const { container } = render(<Pagination total={30} onChange={onChange} />)
    await userEvent.click(container.querySelector('.at-pagination__prev'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows jump buttons for many pages', () => {
    const { container } = render(<Pagination total={500} current={25} />)
    expect(container.querySelector('.at-pagination__item--jump-prev')).toBeInTheDocument()
    expect(container.querySelector('.at-pagination__item--jump-next')).toBeInTheDocument()
  })

  it('renders total, quick jump and page-size picker without crashing', () => {
    const { container } = render(<Pagination total={95} showTotal showQuickjump showSizer />)
    expect(container.querySelector('.at-pagination__total')).toHaveTextContent('95')
    expect(container.querySelector('.at-pagination__quickjump')).toBeInTheDocument()
    expect(container.querySelector('.at-pagination__sizer')).toBeInTheDocument()
  })

  it('quick-jumps on Enter and clamps to the last page', () => {
    const onChange = vi.fn()
    const { container } = render(<Pagination total={50} showQuickjump onChange={onChange} />)
    const input = container.querySelector('.at-pagination__quickjump input')
    fireEvent.change(input, { target: { value: '99' } })
    fireEvent.keyUp(input, { key: 'Enter' })
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it('renders the simple variant', () => {
    const { container } = render(<Pagination simple total={50} />)
    expect(container.querySelector('.at-pagination')).toHaveClass('at-pagination--simple')
  })
})

describe('Tabs', () => {
  const renderTabs = (props) => render(
    <Tabs {...props}>
      <TabPane label="One" name="one">First</TabPane>
      <TabPane label="Two" name="two">Second</TabPane>
      <TabPane label="Three" name="three" disabled>Third</TabPane>
    </Tabs>
  )

  it('activates the first pane by default and switches on click', async () => {
    const onChange = vi.fn()
    const { container } = renderTabs({ onChange })
    expect(container.querySelector('.at-tabs-nav__item--active')).toHaveTextContent('One')
    await userEvent.click(screen.getByText('Two'))
    expect(onChange).toHaveBeenCalledWith({ index: 1, name: 'two' })
    expect(container.querySelector('.at-tabs-nav__item--active')).toHaveTextContent('Two')
    expect(container.querySelector('.at-tabs__pane--active')).toHaveTextContent('Second')
  })

  it('ignores disabled tabs', async () => {
    const onChange = vi.fn()
    renderTabs({ onChange })
    await userEvent.click(screen.getByText('Three'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('follows a controlled value', () => {
    const { container } = renderTabs({ value: 'two' })
    expect(container.querySelector('.at-tabs-nav__item--active')).toHaveTextContent('Two')
  })

  it('closes closable tabs', async () => {
    const onTabRemove = vi.fn()
    const Wrapper = () => {
      const [tabs, setTabs] = useState(['a', 'b'])
      return (
        <Tabs closable onTabRemove={({ name }) => { onTabRemove(name); setTabs(tabs.filter(t => t !== name)) }}>
          {tabs.map(name => <TabPane key={name} name={name} label={name.toUpperCase()}>{name} body</TabPane>)}
        </Tabs>
      )
    }
    const { container } = render(<Wrapper />)
    await userEvent.click(container.querySelectorAll('.at-tabs-nav__item .icon-x')[1])
    expect(onTabRemove).toHaveBeenCalledWith('b')
    expect(screen.queryByText('B')).toBeNull()
  })
})

describe('Steps', () => {
  it('gives every step its own index and status', () => {
    const { container } = render(
      <Steps current={1}>
        <Step title="One" />
        <Step title="Two" />
        <Step title="Three" />
      </Steps>
    )
    const steps = container.querySelectorAll('.at-step')
    expect(steps[0]).toHaveClass('at-step--finish')
    expect(steps[1]).toHaveClass('at-step--process')
    expect(steps[2]).toHaveClass('at-step--wait')
    expect(steps[0].querySelector('.icon-check')).toBeInTheDocument()
    expect(steps[1].querySelector('.at-step__order')).toHaveTextContent('2')
    expect(steps[2].querySelector('.at-step__order')).toHaveTextContent('3')
  })

  it('marks the current step as an error', () => {
    const { container } = render(
      <Steps current={1} status="error">
        <Step title="One" />
        <Step title="Two" />
      </Steps>
    )
    expect(container.querySelectorAll('.at-step')[1]).toHaveClass('at-step--error')
  })
})

describe('Timeline', () => {
  it('renders its items', () => {
    const { container } = render(
      <Timeline>
        <TimelineItem color="green">A</TimelineItem>
        <TimelineItem color="red">B</TimelineItem>
      </Timeline>
    )
    expect(container.querySelectorAll('.at-timeline__item')).toHaveLength(2)
    expect(container.querySelector('.at-timeline__item--success')).toBeInTheDocument()
  })
})

describe('Collapse', () => {
  const items = [
    <CollapseItem key="a" name="a" title="Alpha">Body A</CollapseItem>,
    <CollapseItem key="b" name="b" title="Beta">Body B</CollapseItem>
  ]

  it('expands and collapses items independently', async () => {
    const onChange = vi.fn()
    const { container } = render(<Collapse onChange={onChange}>{items}</Collapse>)
    await userEvent.click(screen.getByText('Alpha'))
    await userEvent.click(screen.getByText('Beta'))
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b'])
    expect(container.querySelectorAll('.at-collapse__item--active')).toHaveLength(2)
    await userEvent.click(screen.getByText('Alpha'))
    expect(onChange).toHaveBeenLastCalledWith(['b'])
  })

  it('keeps one item open in accordion mode', async () => {
    const { container } = render(<Collapse accordion>{items}</Collapse>)
    await userEvent.click(screen.getByText('Alpha'))
    await userEvent.click(screen.getByText('Beta'))
    const active = container.querySelectorAll('.at-collapse__item--active')
    expect(active).toHaveLength(1)
    expect(active[0]).toHaveTextContent('Beta')
  })

  it('works for items without a name', async () => {
    const { container } = render(
      <Collapse>
        <CollapseItem title="One">1</CollapseItem>
        <CollapseItem title="Two">2</CollapseItem>
      </Collapse>
    )
    await userEvent.click(screen.getByText('Two'))
    const active = container.querySelectorAll('.at-collapse__item--active')
    expect(active).toHaveLength(1)
    expect(active[0]).toHaveTextContent('Two')
  })
})

describe('Breadcrumb', () => {
  it('renders items with separators', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Page</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(container.querySelectorAll('.at-breadcrumb__item')).toHaveLength(2)
  })
})
