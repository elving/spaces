import mongoose from 'mongoose'

const PasswordRequestSchema = new mongoose.Schema({
  code: { type: String, trim: true, unique: true },
  email: { type: String, trim: true },
  claimed: { type: Boolean, default: false }
}, { timestamps: true })

PasswordRequestSchema.set('toJSON', {
  getters: true
})

PasswordRequestSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('PasswordRequest', PasswordRequestSchema)
