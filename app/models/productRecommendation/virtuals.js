export default schema => {
  schema
    .virtual('type')
    .get(() => 'productRecommendation')

  return schema
}
