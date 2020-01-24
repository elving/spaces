import get from 'lodash/get'
import Mailchimp from 'mailchimp-api-v3'

let mailchimp = null

export const initMailchimp = apiKey => {
  mailchimp = new Mailchimp(apiKey)
}

export const susbscribeToNewsletter = user => (
  new Promise((resolve, reject) => {
    mailchimp.post('/lists/54d2fc201c/members', {
      status: 'subscribed',
      email_address: get(user, 'email'),

      merge_fields: {
        FNAME: get(user, 'firstName'),
        LNAME: get(user, 'lastName')
      }
    })
    .then(resp => resolve(resp))
    .catch(err => reject(err))
  })
)
