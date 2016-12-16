import registerUserModel from '../models/user/schema'
import registerLikeModel from '../models/like/schema'
import registerGuideModel from '../models/guide/schema'
import registerBrandModel from '../models/brand/schema'
import registerColorModel from '../models/color/schema'
import registerSpaceModel from '../models/space/schema'
import registerFollowModel from '../models/follow/schema'
import registerCommentModel from '../models/comment/schema'
import registerProductModel from '../models/product/schema'
import registerCategoryModel from '../models/category/schema'
import registerSpaceTypeModel from '../models/spaceType/schema'
import registerNotificationModel from '../models/notification/schema'
import registerPasswordResetModel from '../models/passwordReset/schema'

const configModels = () => {
  registerUserModel()
  registerLikeModel()
  registerGuideModel()
  registerFollowModel()
  registerBrandModel()
  registerColorModel()
  registerSpaceModel()
  registerCommentModel()
  registerProductModel()
  registerCategoryModel()
  registerSpaceTypeModel()
  registerNotificationModel()
  registerPasswordResetModel()
}

export default configModels
