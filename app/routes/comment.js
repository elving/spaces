import express from 'express'
import * as controller from '../controllers/comment'

const router = express.Router()
const ajaxRoot = '/ajax/comments'

router.get(`${ajaxRoot}/space/:space/`, controller.getSpaceComments)
router.get(`${ajaxRoot}/product/:product/`, controller.getProductComments)
router.post(`${ajaxRoot}/`, controller.postComment)
router.delete(`${ajaxRoot}/:id/`, controller.deleteComment)

export default router
