import shortid from 'shortid'
import has from 'lodash/has'
import omit from 'lodash/omit'
import mongoose from 'mongoose'

import applyHooks from './hooks'
import applyMethods from './methods'
import applyVirtuals from './virtuals'
import applyValidations from './validations'

import setAssetUrl from '../../utils/setAssetUrl'

const UserSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  bio: { type: String, trim: true, default: '' },
  fullname: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, unique: true },
  avatar: { type: String, trim: true, default: '' },
  username: { type: String, trim: true, unique: true },
  salt: { type: String, default: '' },
  settings: { type: mongoose.Schema.Types.Mixed },
  hashedPassword: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  provider: { type: String, default: 'local' },
  isCurator: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'Like' }],
  spaces: [{ type: mongoose.Schema.ObjectId, ref: 'Space' }],
  products: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  following: [{ type: mongoose.Schema.ObjectId, ref: 'Follow' }],
  followersCount: { type: Number, default: 0 }
}, { timestamps: true })

applyHooks(UserSchema)
applyMethods(UserSchema)
applyVirtuals(UserSchema)
applyValidations(UserSchema)

UserSchema.set('toJSON', {
  getters: true,
  transform(doc, ret) {
    if (has(ret, 'avatar')) {
      ret.avatar = setAssetUrl(ret.avatar)
    }

    return omit(ret, ['email', 'salt', 'password', 'hashedPassword'])
  }
})

UserSchema.set('toObject', {
  getters: true,
  transform(doc, ret) {
    if (has(ret, 'avatar')) {
      ret.avatar = setAssetUrl(ret.avatar)
    }

    return omit(ret, ['email', 'salt', 'password', 'hashedPassword'])
  }
})

export default () => mongoose.model('User', UserSchema)
