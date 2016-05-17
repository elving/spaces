import deleteImageFromUrl from '../../utils/deleteImageFromUrl'

export default (schema) => {
  schema.pre('remove', function(next) {
    deleteImageFromUrl('products', this.get('image'))
      .then(next)
      .catch(next)
  })

  return schema
}
