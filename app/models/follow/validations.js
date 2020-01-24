export default (schema) => {
  schema
    .path('parent')
    .required(true)

  schema
    .path('parentType')
    .required(true)

  schema
    .path('createdBy')
    .required(true)

  return schema
}
