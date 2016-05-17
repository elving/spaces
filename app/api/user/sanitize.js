import omit from 'lodash/omit'

export default (props) => {
  return omit(props, [
    'salt', 'isAdmin', 'createdAt',
    'updatedAt', 'hashedPassword', 'confirmPassword'
  ])
}
