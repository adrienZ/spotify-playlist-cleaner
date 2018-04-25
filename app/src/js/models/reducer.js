/* eslint-disable */

export default (state = {}, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return Object.assign({}, state, { user: action.user })
    case 'USER_PLAYLIST_LISTING':
      return Object.assign({}, state, { playlists: action.playlists })
    case 'USER_PLAYLIST_FULL':
      return Object.assign({}, state, { playlists_full: action.playlists_full })
    default:
      return state
  }
}
