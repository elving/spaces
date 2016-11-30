export default schema => {
  schema
    .path('action')
    .required(true)

  schema
    .path('context')
    .required(true)

  schema
    .path('recipient')
    .required(true)

  schema
    .path('createdBy')
    .required(true)

  schema
    .path('contextType')
    .required(true)

  return schema
}
