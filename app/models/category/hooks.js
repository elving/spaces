import deleteImage from '../../utils/image/deleteImage'

export default (schema) => {
  schema.pre('remove', function(next) {
    deleteImage('categories', this.get('image'))
      .then(next)
      .catch(next)
  })

  return schema
}
