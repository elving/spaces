import express from 'express'
import * as controller from '../controllers/like'

const router = express.Router()
const ajaxRoot = '/ajax/likes'

router.get(`${ajaxRoot}/user/:user/`, controller.getUserLikes)
router.get(`${ajaxRoot}/space/:space/`, controller.getSpaceLikes)
router.get(`${ajaxRoot}/product/:product/`, controller.getProductLikes)
router.get(`${ajaxRoot}/comment/:comment/`, controller.getCommentLikes)
router.post(`${ajaxRoot}/`, controller.like)
router.delete(`${ajaxRoot}/:parentType/:parent/:createdBy/`, controller.unlike)

export default router
