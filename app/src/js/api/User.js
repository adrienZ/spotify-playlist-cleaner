// libs
import store from '@js/lib/store'
import axios from '@js/lib/axios'

// api
import {
  parseUserPlaylists,
  trackifyPlaylists,
  getUrlVars,
} from '@js/api/utilities'
import { apiUrl } from '@js/api/config'

// local vars
store.dispatch({ type: 'USER_LOGIN', user: null })
store.subscribe(() => {
  // console.log(store.getState())
})

export default class User {
  me() {
    // cache
    if (store.getState().user) return Promise.resolve(store.getState().user)

    return axios.get(`${apiUrl}me`).then(userData => {
      const user = Object.assign({}, userData.data, { token: getUserToken() })
      // send to store
      store.dispatch({ type: 'USER_LOGIN', user })
      return user
    })
  }

  getRecentTracks(cancelToken, limit = 10) {
    return new User().me().then(() =>
      axios
        .get(`${apiUrl}me/player/recently-played?limit=${limit}`, null, {
          cancelToken,
        })
        // oooopsie
        .then(recentPlays => ({
          data: { tracks: { items: recentPlays.data.items.map(i => i.track) } },
        }))
    )
  }

  getRecentArtists(cancelToken, limit = 5) {
    return new User().me().then(() =>
      axios
        .get(
          `${apiUrl}me/top/artists?limit=${limit}&time_range=short_term`,
          null,
          {
            cancelToken,
          }
        )
        // oooopsie
        .then(recentArtists => ({
          data: { artists: { items: recentArtists.data.items } },
        }))
    )
  }

  getPlaylists() {
    // cache
    if (store.getState().playlists)
      return Promise.resolve(store.getState().playlists)

    return new User().me().then(() =>
      axios
        .get(`${apiUrl}me/playlists?limit=50`)
        // get remaining playlists
        .then(responsePlaylists =>
          parseUserPlaylists([], responsePlaylists.data)
        )
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

  getPlaylistsFull() {
    // cache
    if (store.getState().playlists_full)
      return Promise.resolve(store.getState().playlists_full)

    return this.getPlaylists().then(userPlaylists =>
      trackifyPlaylists(userPlaylists).then(playlists_full => {
        store.dispatch({
          type: 'USER_PLAYLIST_FULL',
          playlists_full,
        })
        return playlists_full
      })
    )
  }

  detectTrack(track_id) {
    return this.getPlaylistsFull().then(playlists_full =>
      playlists_full.filter(p => {
        const detected = p.tracks.items.filter(t => {
          if (!t.track) return false
          return t.track.id === track_id
        })

        if (detected.length > 0) {
          return true
        }
      })
    )
  }

  detectArtist(track_id) {
    return this.getPlaylistsFull().then(playlists_full =>
      playlists_full.filter(p => {
        const detected = p.tracks.items.filter(t => {
          if (!t.track) return false
          return t.track.id === track_id
        })

        if (detected.length > 0) {
          return true
        }
      })
    )
  }

  logout() {
    logout()
  }
}

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

export const logout = () => {
  window.localStorage.clear()
  window.location.reload()
}
window.logout = logout
