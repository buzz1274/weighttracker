import moment from 'moment/moment'

const formatDate = (date: string, frequency: string): string => {
  frequency = frequency.toLowerCase()

  if (frequency === 'daily' || frequency == 'weekly') {
    return moment(date).format('MMM Do, YYYY')
  } else if (frequency == 'monthly') {
    return moment(date).format('MMM, YYYY')
  } else if (frequency == 'yearly') {
    return moment(date).format('YYYY')
  }
}

export { formatDate }
