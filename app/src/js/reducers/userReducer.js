/* eslint-disable */

export default (state = {}, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return { user: action.user }
    default:
      return state
  }
}
