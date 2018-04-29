// libs
import axios from '@js/lib/axios'

// api
import User from '@js/api/User'
import { isSpotifyTrackUrl, isSpotifyTrackUri } from '@js/api/utilities'
import { apiUrl } from '@js/api/config'

// local vars
const user = new User()

export const deleteTrackFromPlaylist = (playlist_id, track_uri) => {
  return user.me().then(user => {
    return axios.delete(
      `${apiUrl}users/${user.id}/playlists/${playlist_id}/tracks`,
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
  return user.me().then(user => {
    return axios.post(
      `${apiUrl}users/${
        user.id
      }/playlists/${playlist_id}/tracks?uris=${track_uri}`
    )
  })
}

/* eslint-disable */
export const searchSong = (str, cancelToken) => {
  const query = isSpotifyTrackUri(str) || isSpotifyTrackUrl(str) || str
  return isSpotifyTrackUri(str) || isSpotifyTrackUrl(str)
    ? axios.get(`${apiUrl}tracks/${query}`, null, {
        cancelToken,
      })
    : axios.get(`${apiUrl}search?q=${str}&type=track,artist&limit=10`, null, {
        cancelToken,
      })
}
