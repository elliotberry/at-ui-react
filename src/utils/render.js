import { createRoot } from 'react-dom/client'

/**
 * Mounts a React element into a fresh container appended to <body> and returns
 * a handle that can re-render or tear it down. Used by the imperative APIs
 * (Message, Notification, LoadingBar, Dialog).
 */
export const mount = (element, { container: parent = document.body, className } = {}) => {
  const container = document.createElement('div')
  if (className) container.className = className
  parent.appendChild(container)

  const root = createRoot(container)
  let destroyed = false

  root.render(element)

  return {
    container,
    render (next) {
      if (!destroyed) root.render(next)
    },
    destroy () {
      if (destroyed) return
      destroyed = true
      // Unmount outside of any in-flight React render.
      setTimeout(() => {
        root.unmount()
        if (container.parentNode) container.parentNode.removeChild(container)
      }, 0)
    }
  }
}
