import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

const FollowSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  parent: { type: mongoose.Schema.ObjectId },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  parentType: { type: String, trim: true, default: '' }
}, { timestamps: true })

applyHooks(FollowSchema)
applyVirtuals(FollowSchema)
applyValidations(FollowSchema)

FollowSchema.set('toJSON', {
  getters: true
})

FollowSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Follow', FollowSchema)
