import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

const ColorSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  hex: { type: String, trim: true, default: '' },
  name: { type: String, trim: true, default: '', unique: true },
  slug: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true })

applyHooks(ColorSchema)
applyVirtuals(ColorSchema)
applyValidations(ColorSchema)

ColorSchema.set('toJSON', {
  getters: true
})

ColorSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Color', ColorSchema)
