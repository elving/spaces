import send from './send'
import text from './text/welcome'
import html from './templates/welcome'

export default to => (
  send({
    to,
    text: text(),
    html: html(),
    subject: 'Welcome to Spaces!'
  })
)
