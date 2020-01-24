import defaults from 'lodash/defaults'
import nodemailer from 'nodemailer'

import makeError from '../utils/makeError'

let smtpTransport
let smtpTransportCreated = false

export default options => (
  new Promise((resolve, reject) => {
    const mailOptions = defaults(options, {
      from: process.env.SUPPORT_EMAIL,
      envelope: {
        to: options.to,
        from: process.env.SUPPORT_EMAIL
      }
    })

    if (!smtpTransportCreated) {
      smtpTransport = nodemailer.createTransport({
        auth: {
          user: process.env.SUPPORT_EMAIL,
          pass: process.env.SUPPORT_EMAIL_PASSWORD
        },
        service: 'zoho'
      })

      smtpTransportCreated = true
    }

    smtpTransport.sendMail(mailOptions, (err, resp) => {
      if (err) {
        reject(makeError(err))
      } else {
        resolve(resp)
      }
    })
  })
)
