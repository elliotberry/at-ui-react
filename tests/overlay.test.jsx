import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Message, Notification, Dialog, LoadingBar, Modal, Tooltip, Popover } from '../src'

const flush = () => act(async () => { await vi.advanceTimersByTimeAsync(0) })
const advance = (ms) => act(async () => { await vi.advanceTimersByTimeAsync(ms) })

describe('Message', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(async () => {
    await act(async () => { Message.closeAll() })
    await advance(1000)
    vi.useRealTimers()
  })

  it('shows a message and removes it after its duration', async () => {
    await act(async () => { Message.success('Saved!') })
    await flush()
    expect(screen.getByText('Saved!')).toBeInTheDocument()
    expect(document.querySelector('.at-message--success')).toBeInTheDocument()

    await advance(3000)
    await advance(500)
    expect(screen.queryByText('Saved!')).toBeNull()
  })

  it('stacks several messages and can close one by hand', async () => {
    let close
    await act(async () => {
      close = Message({ message: 'first', duration: 0 })
      Message({ message: 'second', duration: 0 })
    })
    await flush()
    expect(document.querySelectorAll('.at-message')).toHaveLength(2)
    await act(async () => { close() })
    await advance(500)
    expect(document.querySelectorAll('.at-message')).toHaveLength(1)
    expect(screen.getByText('second')).toBeInTheDocument()
  })

  it('calls onClose once', async () => {
    const onClose = vi.fn()
    await act(async () => { Message({ message: 'bye', duration: 100, onClose }) })
    await flush()
    await advance(1000)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('Notification', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(async () => {
    await act(async () => { Notification.closeAll() })
    await advance(1000)
    vi.useRealTimers()
  })

  it('shows a titled notification and closes it', async () => {
    await act(async () => { Notification.warning({ title: 'Heads up', message: 'Details', duration: 0 }) })
    await flush()
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
    await act(async () => { Notification.closeAll() })
    await advance(500)
    expect(screen.queryByText('Heads up')).toBeNull()
  })
})

describe('Dialog', () => {
  afterEach(async () => {
    await act(async () => { Dialog.close() })
  })

  it('resolves a confirm dialog on OK', async () => {
    let promise
    await act(async () => { promise = Dialog.confirm('Really?', 'Confirm') })
    const ok = await screen.findByText('OK')
    await userEvent.click(ok)
    await expect(promise).resolves.toBe('confirm')
  })

  it('rejects a confirm dialog on cancel', async () => {
    let promise
    await act(async () => { promise = Dialog.confirm('Really?', 'Confirm') })
    const assertion = expect(promise).rejects.toBe('cancel')
    await userEvent.click(await screen.findByText('Cancel'))
    await assertion
  })

  it('returns the typed text from a prompt', async () => {
    let promise
    await act(async () => { promise = Dialog.prompt('Name?', 'Prompt') })
    const input = await screen.findByRole('textbox')
    await userEvent.type(input, 'Ada')
    await userEvent.click(screen.getByText('OK'))
    await expect(promise).resolves.toEqual({ value: 'Ada', action: 'confirm' })
  })

  it('shows dialogs one at a time', async () => {
    let first
    await act(async () => {
      first = Dialog.alert('one', 'First')
      Dialog.alert('two', 'Second')
    })
    expect(await screen.findByText('First')).toBeInTheDocument()
    expect(screen.queryByText('Second')).toBeNull()
    await userEvent.click(screen.getByText('OK'))
    await first
    expect(await screen.findByText('Second')).toBeInTheDocument()
  })
})

describe('LoadingBar', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(async () => {
    await advance(5000)
    vi.useRealTimers()
  })

  it('creeps forward while loading and removes itself after finish()', async () => {
    await act(async () => { LoadingBar.start() })
    await flush()
    expect(document.querySelector('.at-loading-bar')).toBeInTheDocument()
    await advance(1000)
    const percent = Number(document.querySelector('.at-loading-bar').getAttribute('aria-valuenow'))
    expect(percent).toBeGreaterThan(0)
    expect(percent).toBeLessThanOrEqual(100)

    await act(async () => { LoadingBar.finish() })
    expect(Number(document.querySelector('.at-loading-bar').getAttribute('aria-valuenow'))).toBe(100)
    await advance(3000)
    expect(document.querySelector('.at-loading-bar')).toBeNull()
  })

  it('uses the error status', async () => {
    await act(async () => { LoadingBar.error() })
    await flush()
    expect(document.querySelector('.at-loading-bar--error')).toBeInTheDocument()
  })
})

describe('LoadingBar component', () => {
  it('renders as a normal component too', () => {
    const { container } = render(<LoadingBar show percent={40} />)
    expect(container.querySelector('.at-loading-bar__inner')).toHaveStyle({ width: '40%' })
  })
})

describe('Modal', () => {
  it('is hidden until value is true and closes with the buttons', async () => {
    const onChange = vi.fn()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const { rerender } = render(<Modal title="Hello" onChange={onChange} onConfirm={onConfirm} onCancel={onCancel}>Body</Modal>)
    expect(screen.queryByText('Hello')).toBeNull()

    rerender(<Modal value title="Hello" onChange={onChange} onConfirm={onConfirm} onCancel={onCancel}>Body</Modal>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()

    await userEvent.click(screen.getByText('OK'))
    expect(onConfirm).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('cancels on Escape', () => {
    const onCancel = vi.fn()
    render(<Modal value title="Esc" onCancel={onCancel}>x</Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalled()
  })

  it('does not close on Escape when disabled', () => {
    const onCancel = vi.fn()
    render(<Modal value closeOnPressEsc={false} title="Esc" onCancel={onCancel}>x</Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).not.toHaveBeenCalled()
  })
})

describe('Tooltip and Popover', () => {
  it('shows tooltip content on hover', async () => {
    const { container } = render(<Tooltip content="Tip text"><button>hover me</button></Tooltip>)
    expect(screen.queryByText('Tip text')).toBeNull()
    await userEvent.hover(container.querySelector('.at-tooltip__trigger'))
    expect(await screen.findByText('Tip text')).toBeInTheDocument()
  })

  it('renders popover content as React, never as HTML', async () => {
    const { container } = render(
      <Popover trigger="click" title="Title" content="<img src=x onerror=alert(1)>">
        <button>open</button>
      </Popover>
    )
    await userEvent.click(container.querySelector('.at-popover__trigger'))
    const content = await screen.findByText('<img src=x onerror=alert(1)>')
    expect(content.querySelector('img')).toBeNull()
  })

  it('toggles a click popover', async () => {
    const { container } = render(<Popover trigger="click" content="Body"><button>open</button></Popover>)
    const trigger = container.querySelector('.at-popover__trigger')
    await userEvent.click(trigger)
    expect(await screen.findByText('Body')).toBeInTheDocument()
    await userEvent.click(document.body)
    await waitFor(() => expect(screen.queryByText('Body')).toBeNull())
  })
})
