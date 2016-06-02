import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

const LikeSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  parent: { type: mongoose.Schema.ObjectId },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  parentType: { type: String, trim: true, default: '' }
}, { timestamps: true })

applyVirtuals(LikeSchema)
applyValidations(LikeSchema)

LikeSchema.set('toJSON', {
  getters: true
})

LikeSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Like', LikeSchema)
