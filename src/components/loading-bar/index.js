import { createElement } from 'react'
import LoadingBar from './src/LoadingBar'
import { mount } from '../../utils/render'

let handle = null
let state = { show: false, status: 'success', percent: 0 }
let width = 2
let timer = null
let hideTimer = null

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const render = () => {
  if (typeof document === 'undefined') return
  const element = createElement(LoadingBar, { ...state, width })
  if (!handle) handle = mount(element)
  else handle.render(element)
}

const update = (next) => {
  clearTimeout(hideTimer)
  state = { ...state, ...next }
  render()
}

// Fade out, then remove the bar from the page.
const hide = () => {
  hideTimer = setTimeout(() => {
    state = { ...state, show: false }
    render()

    hideTimer = setTimeout(() => {
      state = { show: false, status: 'success', percent: 0 }
      if (handle) {
        handle.destroy()
        handle = null
      }
    }, 400)
  }, 800)
}

const LoadingBarAPI = {
  /** Starts a bar that creeps towards ~95% until finish()/error() is called. */
  start () {
    if (timer) return

    let percent = 0
    update({ percent, status: 'success', show: true })

    timer = setInterval(() => {
      percent += Math.floor((Math.random() * 3) + 5)
      if (percent > 95) clearTimer()
      update({ percent: Math.min(percent, 100), status: 'success', show: true })
    }, 200)
  },
  update (percent) {
    clearTimer()
    update({ percent, status: 'success', show: true })
  },
  finish () {
    clearTimer()
    update({ percent: 100, status: 'success', show: true })
    hide()
  },
  error () {
    clearTimer()
    update({ percent: 100, status: 'error', show: true })
    hide()
  },
  config (options = {}) {
    if (options.width) width = options.width
  }
}

Object.assign(LoadingBar, LoadingBarAPI)

export default LoadingBar
