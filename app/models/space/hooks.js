import deleteImage from '../../utils/image/deleteImage'

export default schema => {
  schema.pre('remove', async function(next) {
    await deleteImage('spaces', this.get('image'))
    await deleteImage('spaces', this.get('coverImage'))
    next()
  })

  return schema
}
