import LoadingBar from './src/LoadingBar'

// Static API wrapper
let loadingBarInstance = null
let width = 2
let timer = null

const LoadingBarAPI = {
  start () {
    if (timer) return
    // Implementation would create instance and start progress
    console.log('LoadingBar.start')
  },
  update (percent) {
    console.log('LoadingBar.update', percent)
  },
  finish () {
    console.log('LoadingBar.finish')
  },
  error () {
    console.log('LoadingBar.error')
  },
  config (options) {
    if (options.width) {
      width = options.width
    }
  }
}

LoadingBar.start = LoadingBarAPI.start
LoadingBar.finish = LoadingBarAPI.finish
LoadingBar.error = LoadingBarAPI.error
LoadingBar.update = LoadingBarAPI.update
LoadingBar.config = LoadingBarAPI.config

export default LoadingBar
