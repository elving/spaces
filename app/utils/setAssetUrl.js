export default (url) => {
  if (process.env.NODE_ENV === 'production') {
    return url.replace(
      /^(.*?)joinspaces.co\//gim,
      `https://${process.env.CLOUDFRONT_DOMAIN_NAME}.cloudfront.net/`
    )
  } else {
    return url.replace(/http\:\/\//gim, 'https://')
  }
}
