import shortid from 'shortid'
import mongoose from 'mongoose'

import applyHooks from './hooks'
import applyVirtuals from './virtuals'
import applyValidations from './validations'

const ProductRecommendationSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  url: { type: String, trim: true, default: '', unique: true },
  note: { type: String, trim: true, default: '' },
  status: { type: String, trim: true, default: 'pending' },
  product: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true })

applyHooks(ProductRecommendationSchema)
applyVirtuals(ProductRecommendationSchema)
applyValidations(ProductRecommendationSchema)

ProductRecommendationSchema.set('toJSON', {
  getters: true
})

ProductRecommendationSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model(
  'ProductRecommendation', ProductRecommendationSchema
)
