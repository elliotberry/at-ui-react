import Modal from '../../modal/src/Modal'

// Dialog is an alias for Modal with some preset configurations
const Dialog = Modal

Dialog.alert = (config) => {
  console.log('Dialog.alert', config)
  // Would render Modal with alert configuration
}

Dialog.confirm = (config) => {
  console.log('Dialog.confirm', config)
  // Would render Modal with confirm configuration
}

export default Dialog

