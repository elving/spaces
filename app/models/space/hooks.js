import { deleteImages } from '../../utils/storage'

export default (schema) => {
  schema.pre('remove', function(next) {
    deleteImages('spaces', this.images)
      .then(next)
      .catch(next)
  })

  return schema
}
