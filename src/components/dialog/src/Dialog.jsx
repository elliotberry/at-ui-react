import React, { useEffect, useState } from 'react'
import Modal from '../../modal/src/Modal'
import { mount } from '../../../utils/render'

const LEAVE_DURATION = 300

const defaults = { title: '', content: '', type: '' }

let queue = []
let current = null

/** Renders one dialog and reports how it was closed. */
const DialogView = ({ options, onDone }) => {
  const [visible, setVisible] = useState(false)

  // Mount hidden, then open on the next tick so the enter animation plays.
  useEffect(() => {
    setVisible(true)
  }, [])

  const finish = (action, value) => {
    setVisible(false)
    setTimeout(() => onDone(action, value), LEAVE_DURATION)
  }

  const { callback, resolve, reject, ...modalProps } = options

  return (
    <Modal
      {...modalProps}
      value={visible}
      onConfirm={(inputValue) => finish('confirm', inputValue)}
      onCancel={() => finish('cancel')}
    />
  )
}

const showNext = () => {
  if (current || !queue.length) return

  current = queue.shift()
  const { options, callback, resolve, reject } = current

  const handle = mount(
    <DialogView
      options={options}
      onDone={(action, inputValue) => {
        handle.destroy()
        current = null

        if (typeof callback === 'function') {
          if (options.showInput) callback(inputValue, action)
          else callback(action)
        }

        if (resolve) {
          const needsAnswer = options.type === 'confirm' || options.type === 'prompt'
          if (needsAnswer && action === 'cancel') {
            reject(action)
          } else if (needsAnswer && options.showInput) {
            resolve({ value: inputValue, action })
          } else {
            resolve(action)
          }
        }

        showNext()
      }}
    />
  )
  current.handle = handle
}

/**
 * Shows a dialog and returns a Promise. `confirm`/`prompt` dialogs resolve on
 * OK (`prompt` with `{ value, action }`) and reject with 'cancel' otherwise;
 * every other dialog resolves with the action. Dialogs are shown one at a time.
 */
const Dialog = (options = {}, callback) => {
  if (typeof document === 'undefined') return undefined
  if (options.callback && !callback) callback = options.callback

  return new Promise((resolve, reject) => {
    queue.push({
      options: { ...defaults, ...options },
      callback,
      resolve,
      reject
    })
    showNext()
  })
}

/** Closes the open dialog and discards any that are waiting. */
Dialog.close = () => {
  queue = []
  if (current && current.handle) {
    current.handle.destroy()
    if (current.resolve) current.resolve('cancel')
  }
  current = null
}

const withArgs = (base) => (content, title, options) => {
  if (content && typeof content === 'object' && !React.isValidElement(content)) {
    options = content
    content = options.content
    title = options.title || ''
  }
  return Dialog({ title, content, ...base, ...options })
}

/** Like window.alert */
Dialog.alert = withArgs({ type: 'alert', maskClosable: false, showCancelButton: false })

/** Like window.confirm */
Dialog.confirm = withArgs({ type: 'confirm' })

/** Like window.prompt */
Dialog.prompt = withArgs({ type: 'prompt', showInput: true })

const STATUS_TITLES = { info: 'Info', success: 'Success', warning: 'Warning', error: 'Error' }

Object.keys(STATUS_TITLES).forEach((type) => {
  Dialog[type] = (content, title, options) => {
    if (content && typeof content === 'object' && !React.isValidElement(content)) {
      options = content
      content = options.content
      title = options.title || STATUS_TITLES[type]
    }
    return Dialog({
      title: title || STATUS_TITLES[type],
      content,
      type,
      maskClosable: false,
      showCancelButton: false,
      showClose: false,
      ...options
    })
  }
})

export default Dialog
