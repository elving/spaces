import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

const BrandSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  url: { type: String, trim: true, default: '' },
  logo: { type: String, trim: true, default: '' },
  name: { type: String, trim: true, default: '', unique: true },
  slug: { type: String, trim: true, default: '', unique: true },
  description: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true })

applyHooks(BrandSchema)
applyVirtuals(BrandSchema)
applyValidations(BrandSchema)

BrandSchema.set('toJSON', {
  getters: true
})

BrandSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Brand', BrandSchema)
