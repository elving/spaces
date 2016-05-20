import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

// Schema
const SpaceSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  name: { type: String, trim: true, default: '', unique: true },
  slug: { type: String, trim: true, default: '', unique: true },
  products: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  redesigns: [{ type: mongoose.Schema.ObjectId, ref: 'Space' }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  description: { type: String, trim: true, default: '' }
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
