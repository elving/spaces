export default (value) => (
  (/auth|join|register|signup|login|signin|logout|reset-password|set-password/gim).test(value)
)
