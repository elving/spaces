import express from 'express'
import * as controller from '../controllers/follow'

const router = express.Router()
const ajaxRoot = '/ajax/follows'

router.get(`${ajaxRoot}/user/:user/`, controller.getUserFollowers)
router.get(`${ajaxRoot}/room/:room/`, controller.getRoomFollowers)
router.get(`${ajaxRoot}/category/:category/`, controller.getCategoryFollowers)
router.post(`${ajaxRoot}/`, controller.follow)
router.delete(
  `${ajaxRoot}/:parentType/:parent/:createdBy/`, controller.unfollow
)

export default router
