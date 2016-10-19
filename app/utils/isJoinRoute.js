export default (value) => (
  (/join|register|signup|login|signin|logout|reset-password|set-password/i).test(value)
)
