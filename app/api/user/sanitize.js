import omit from 'lodash/omit'

export default props => (
  omit(props, [
    '_csrf', '_method', 'salt', 'isAdmin', 'createdAt',
    'updatedAt', 'hashedPassword', 'newPassword',
    'confirmPassword'
  ])
)
