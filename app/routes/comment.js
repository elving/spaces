import express from 'express'
import * as controller from '../controllers/comment'

const router = express.Router()
const ajaxRoot = '/ajax/comments'

router.get(`${ajaxRoot}/space/:space/`, controller.getSpaceComments)
router.post(`${ajaxRoot}/`, controller.comment)
router.delete(`${ajaxRoot}/:id/`, controller.deleteComment)

export default router
