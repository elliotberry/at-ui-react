import { createElement } from 'react'
import { mount } from './render'

/**
 * A list of imperatively managed items (messages, notifications) rendered by
 * one `Host` component that is mounted on demand and removed when empty.
 */
export const createStack = (Host) => {
  let items = []
  let handle = null

  const sync = () => {
    if (!items.length) {
      if (handle) {
        handle.destroy()
        handle = null
      }
      return
    }

    const element = createElement(Host, { items })
    if (!handle) handle = mount(element)
    else handle.render(element)
  }

  return {
    get items () { return items },
    add (item) {
      items = [...items, item]
      sync()
    },
    patch (id, partial) {
      items = items.map(item => (item.id === id ? { ...item, ...partial } : item))
      sync()
    },
    remove (id) {
      items = items.filter(item => item.id !== id)
      sync()
    },
    find (id) {
      return items.find(item => item.id === id)
    }
  }
}
