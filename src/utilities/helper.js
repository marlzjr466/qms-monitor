import moment from 'moment'

function formatQueueNumber (number) {
  return String(number).padStart(4, '0')
}

function getDate (format) {
  return moment().format(format)
}

export {
  formatQueueNumber,
  getDate
}