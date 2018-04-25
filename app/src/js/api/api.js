import axios from 'axios'

import {
  getApiheaders,
  parseUserPlaylists,
  trackifyPlaylists,
  getUrlVars,
  isSpotifyTrackUrl,
  isSpotifyTrackUri,
} from './utilities'

import store from '@js/Store'

const headers = getApiheaders()

const logout = () => {
  window.localStorage.clear()
  window.location.reload()
}

export const getUserToken = () => {
  let accessToken = null
  const UrlParamToken = getUrlVars(window.location.hash.substr(1)).access_token

  if (window.localStorage.getItem('userToken')) {
    accessToken = window.localStorage.getItem('userToken')
  } else {
    accessToken = UrlParamToken
  }

  // if (UrlParamToken)
  //   window.location.replace(
  //     window.location.href.replace(window.location.hash, '')
  //   )

  if (accessToken) window.localStorage.setItem('userToken', accessToken)

  return accessToken
}

store.dispatch({ type: 'USER_LOGIN', user: null })

export const getUser = () => {
  // cache
  if (store.getState().user) return Promise.resolve(store.getState().user)

  return (
    axios
      .get('https://api.spotify.com/v1/me', headers)
      .then(userData => {
        const user = Object.assign({}, userData.data, { token: getUserToken() })
        // send to store
        store.dispatch({ type: 'USER_LOGIN', user })
        return user
      })
      // handle token expired
      .catch(error => {
        if (error.response.status === 401) {
          // return logout()
        }
      })
  )
}

export const getUserPlaylists = () => {
  // cache
  if (store.getState().playlists)
    return Promise.resolve(store.getState().playlists)

  return getUser().then(() =>
    axios
      .get('https://api.spotify.com/v1/me/playlists?limit=50', headers)
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

// export const getDuplicateSongsFromPLaylists = (playlists, specifiedTracks) => {
//   const allPlaylists = playlists
//     .map(tracks => tracks.tracklist.map(track => (track ? track.id : null)));
//   const tracksOccrenceCounter = {};
//   const duplicatedTracks = [];
//   const allPlaylistsLength = allPlaylists.length;
//   for (let i = 0; i < allPlaylistsLength; i++) {
//     const tracks = specifiedTracks ? specifiedTracks.map( t => t.id) : allPlaylists[i];
//     tracks.map((track, index) => {
//       const hasPlaylist = allPlaylists[i].indexOf(track) > -1;
//       if (!track || !hasPlaylist) return false;
//       if (track && !tracksOccrenceCounter[track]) {
//         tracksOccrenceCounter[track] = {
//           data: specifiedTracks ? specifiedTracks[index] : playlists[i].tracklist[index],
//           count: 1,
//           playlists: [playlists[i].playlist],
//         };
//       } else {
//         tracksOccrenceCounter[track].count++;
//         tracksOccrenceCounter[track].playlists.push(playlists[i].playlist);
//       }
//     });
//   }
//   for (const k in tracksOccrenceCounter) {
//     const showAt = specifiedTracks ? 0 : 1;
//     if (tracksOccrenceCounter[k].count > showAt) {
//       duplicatedTracks.push(tracksOccrenceCounter[k]);
//     }
//   }

//   return duplicatedTracks.sort((a, b) => b.count - a.count);
// };

/* eslint-disable */
export const searchSong = (str, cancelToken) => {
  const query = isSpotifyTrackUri(str) || isSpotifyTrackUrl(str) || str
  return isSpotifyTrackUri(str) || isSpotifyTrackUrl(str)
    ? axios.get(`https://api.spotify.com/v1/tracks/${query}`, headers, {
        cancelToken,
      })
    : axios.get(
        `https://api.spotify.com/v1/search?q=${str}&type=track,artist&limit=5`,
        headers,
        { cancelToken }
      )
}
