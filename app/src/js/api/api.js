import axios from 'axios'

import {
  getApiheaders,
  parseUserPlaylists,
  trackifyPlaylists,
  getUrlVars,
  isSpotifyTrackUrl,
  isSpotifyTrackUri,
} from './utilities'

// Add a response interceptor
axios.interceptors.response.use(null, error => {
  // Do something with response error
  if (error.response.status === 401) {
    logout()
    console.log('ERROR', error.response, getUserToken())
  }
  return Promise.reject(error.responce)
})

import store from '@js/Store'

const headers = getApiheaders()
axios.defaults.headers.common = headers.headers

const logout = () => {
  window.localStorage.clear()
  window.location.reload()
}
window.logout = logout

export const getUserToken = () => {
  let accessToken = null
  const UrlParamToken = getUrlVars(window.location.hash.substr(1)).access_token

  if (window.localStorage.getItem('userToken')) {
    accessToken = window.localStorage.getItem('userToken')
  } else {
    accessToken = UrlParamToken
  }

  if (UrlParamToken)
    window.location.replace(
      window.location.href.replace(window.location.hash, '')
    )

  if (accessToken) window.localStorage.setItem('userToken', accessToken)

  return accessToken
}

store.dispatch({ type: 'USER_LOGIN', user: null })

export const getUser = () => {
  // cache
  if (store.getState().user) return Promise.resolve(store.getState().user)

  return axios.get('https://api.spotify.com/v1/me').then(userData => {
    const user = Object.assign({}, userData.data, { token: getUserToken() })
    // send to store
    store.dispatch({ type: 'USER_LOGIN', user })
    return user
  })
}

export const getUserPlaylists = () => {
  // cache
  if (store.getState().playlists)
    return Promise.resolve(store.getState().playlists)

  return getUser().then(() =>
    axios
      .get('https://api.spotify.com/v1/me/playlists?limit=50')
      // get remaining playlists
      .then(responsePlaylists => parseUserPlaylists([], responsePlaylists.data))
      // send to store
      .then(rawPlaylists => {
        const playlists = rawPlaylists.filter(
          d => d.owner.id === store.getState().user.id
        )

        store.dispatch({ type: 'USER_PLAYLIST_LISTING', playlists })
        return playlists
      })
  )
}

export const getUserPlaylistsFull = () => {
  // cache
  if (store.getState().playlists_full)
    return Promise.resolve(store.getState().playlists_full)

  return getUserPlaylists().then(userPlaylists => {
    return trackifyPlaylists(userPlaylists).then(playlists_full => {
      store.dispatch({
        type: 'USER_PLAYLIST_FULL',
        playlists_full,
      })
      return playlists_full
    })
  })
}

export const deleteTrackFromPlaylist = (playlist_id, track_uri) => {
  return getUser().then(user => {
    return axios.delete(
      `https://api.spotify.com/v1/users/${
        user.id
      }/playlists/${playlist_id}/tracks`,
      {
        data: {
          tracks: [
            {
              uri: track_uri,
            },
          ],
        },
      }
    )
  })
}

export const addTrackToPlaylist = (playlist_id, track_uri) => {
  return getUser().then(user => {
    return axios.post(
      `https://api.spotify.com/v1/users/${
        user.id
      }/playlists/${playlist_id}/tracks?uris=${track_uri}`
    )
  })
}

export const getUserRecentTracks = (cancelToken, limit = 10) => {
  return getUser().then(() => {
    return (
      axios
        .get(
          `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
          null,
          { cancelToken }
        )
        // oooopsie
        .then(recentPlays => ({
          data: { tracks: { items: recentPlays.data.items.map(i => i.track) } },
        }))
    )
  })
}

/* eslint-disable */
export const searchSong = (str, cancelToken) => {
  const query = isSpotifyTrackUri(str) || isSpotifyTrackUrl(str) || str
  return isSpotifyTrackUri(str) || isSpotifyTrackUrl(str)
    ? axios.get(`https://api.spotify.com/v1/tracks/${query}`, null, {
        cancelToken,
      })
    : axios.get(
        `https://api.spotify.com/v1/search?q=${str}&type=track,artist&limit=10`,
        null,
        { cancelToken }
      )
}
