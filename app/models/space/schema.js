import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

// Schema
const SpaceSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  name: { type: String, trim: true, default: '' },
  slug: { type: String, trim: true, default: '' },
  products: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  redesigns: [{ type: mongoose.Schema.ObjectId, ref: 'Space' }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  spaceType: { type: mongoose.Schema.ObjectId, ref: 'SpaceType' },
  description: { type: String, trim: true, default: '' },
  isRedesigned: { type: Boolean, default: false },
  originalSpace: { type: mongoose.Schema.ObjectId, ref: 'Space' },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  redesignsCount: { type: Number, default: 0 }
}, { timestamps: true })

applyVirtuals(SpaceSchema)
applyValidations(SpaceSchema)

SpaceSchema.set('toJSON', {
  getters: true
})

SpaceSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Space', SpaceSchema)
