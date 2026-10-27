import React from 'react'
import NotificationItem from './Notification'
import { createStack } from '../../../utils/createStack'

const LEAVE_DURATION = 300
const TYPES = ['success', 'error', 'warning', 'info']

const HOST_STYLE = {
  position: 'fixed',
  top: 16,
  right: 16,
  pointerEvents: 'none',
  zIndex: 1010
}

// Stacked in normal flow inside the host instead of each being fixed.
const ITEM_STYLE = { position: 'relative', right: 'auto', marginBottom: 16, pointerEvents: 'auto' }

const Host = ({ items }) => (
  <div className="at-notification__host" style={HOST_STYLE}>
    {items.map(({ id, onClose, ...item }) => (
      <NotificationItem
        key={id}
        {...item}
        style={ITEM_STYLE}
        onClose={() => Notification.close(id)}
      />
    ))}
  </div>
)

const stack = createStack(Host)
let seed = 1

/**
 * Shows a notification. Accepts `{ title, message, type, duration, icon,
 * showClose, onClose }` and returns a function that closes it.
 */
const Notification = (options = {}) => {
  if (typeof document === 'undefined') return () => {}

  const config = typeof options === 'string' ? { message: options } : { ...options }
  const id = `notification_${seed++}`

  stack.add({ ...config, id, closing: false })
  return () => Notification.close(id)
}

Notification.close = (id) => {
  const item = stack.find(id)
  if (!item || item.closing) return

  stack.patch(id, { closing: true })
  if (typeof item.onClose === 'function') item.onClose(item)
  setTimeout(() => stack.remove(id), LEAVE_DURATION)
}

Notification.closeAll = () => {
  stack.items.forEach(item => Notification.close(item.id))
}

TYPES.forEach((type) => {
  Notification[type] = (options) => {
    const config = typeof options === 'string' ? { message: options } : { ...options }
    return Notification({ ...config, type })
  }
})

export default Notification
