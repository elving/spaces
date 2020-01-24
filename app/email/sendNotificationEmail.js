import get from 'lodash/get'

import send from './send'
import text from '../api/notification/renderText'
import html from './templates/notification'

export default notification => (
  send({
    to: get(notification, 'recipient.email'),
    text: text(notification),
    html: html(notification),
    subject: 'Here’s what you missed…'
  })
)
