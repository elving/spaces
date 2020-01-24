export default (req) => (
  `https://${req.get('host')}${req.originalUrl}`
)
