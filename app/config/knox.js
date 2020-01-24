export default () => {
  return process.env.NODE_ENV === 'production' ? {
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET_PROD
  } : {
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET_DEV
  }
}
