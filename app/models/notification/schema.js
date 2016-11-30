import shortid from 'shortid'
import mongoose from 'mongoose'

import applyVirtuals from './virtuals'
import applyValidations from './validations'

const NotificationSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  unread: { type: Boolean, default: true },
  action: { type: String, trim: true, default: '' },
  context: { type: mongoose.Schema.ObjectId },
  recipient: { type: mongoose.Schema.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  contextType: { type: String, trim: true, default: '' }
}, { timestamps: true })

applyVirtuals(NotificationSchema)
applyValidations(NotificationSchema)

NotificationSchema.set('toJSON', {
  getters: true
})

NotificationSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Notification', NotificationSchema)
