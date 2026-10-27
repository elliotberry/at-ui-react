import React from 'react'
import MessageItem from './Message'
import { createStack } from '../../../utils/createStack'

const LEAVE_DURATION = 300
const TYPES = ['info', 'success', 'warning', 'error', 'loading']

const HOST_STYLE = {
  position: 'fixed',
  top: 16,
  left: 0,
  width: '100%',
  pointerEvents: 'none',
  zIndex: 1010
}

// The stylesheet positions each wrapper with `position: fixed`; inside the host
// they are stacked in normal flow instead, so no measuring is required.
const WRAPPER_STYLE = { position: 'relative', top: 'auto', marginBottom: 8 }

const Host = ({ items }) => (
  <div className="at-message__host" style={HOST_STYLE}>
    {items.map(({ id, onClose, ...item }) => (
      <MessageItem
        key={id}
        {...item}
        style={WRAPPER_STYLE}
        onClose={() => Message.close(id)}
      />
    ))}
  </div>
)

const stack = createStack(Host)
let seed = 1

/**
 * Shows a message. Accepts a string or `{ message, type, duration, icon, onClose }`
 * and returns a function that closes it.
 */
const Message = (options) => {
  if (typeof document === 'undefined') return () => {}

  const config = typeof options === 'string' ? { message: options } : { ...options }
  const id = `message_${seed++}`

  stack.add({ ...config, id, closing: false })
  return () => Message.close(id)
}

Message.close = (id) => {
  const item = stack.find(id)
  if (!item || item.closing) return

  stack.patch(id, { closing: true })
  if (typeof item.onClose === 'function') item.onClose(item)
  setTimeout(() => stack.remove(id), LEAVE_DURATION)
}

Message.closeAll = () => {
  stack.items.forEach(item => Message.close(item.id))
}

TYPES.forEach((type) => {
  Message[type] = (options) => {
    const config = typeof options === 'string' ? { message: options } : { ...options }
    return Message({ ...config, type })
  }
})

export default Message
