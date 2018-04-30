// libs
import axios from '@js/lib/axios'
import store from '@js/lib/store'

// api
import User from '@js/api/User'
import {
  isSpotifyTrackUrl,
  isSpotifyTrackUri,
  isSpotifyArtistUrl,
  parseArtistTracks,
  isSpotifyArtistUri,
} from '@js/api/utilities'
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
export const searchTrack = (str, cancelToken) => {
  const query = isSpotifyTrackUri(str) || isSpotifyTrackUrl(str) || str
  return isSpotifyTrackUri(str) || isSpotifyTrackUrl(str)
    ? axios.get(`${apiUrl}tracks/${query}`, null, {
        cancelToken,
      })
    : axios.get(`${apiUrl}search?q=${str}&type=track&limit=10`, null, {
        cancelToken,
      })
}

export const searchArtist = (str, cancelToken) => {
  const query = isSpotifyArtistUri(str) || isSpotifyArtistUrl(str) || str
  return isSpotifyArtistUri(str) || isSpotifyArtistUrl(str)
    ? axios.get(`${apiUrl}artists/${query}`, null, {
        cancelToken,
      })
    : axios.get(`${apiUrl}search?q=${str}&type=artist&limit=5`, null, {
        cancelToken,
      })
}

export const getArtistTracks = artist => {
  if (
    store.getState().artist_tracklist &&
    store.getState().artist_tracklist.id === artist.id
  ) {
    return Promise.resolve(
      store.getState().artist_tracklist.tracklist.tracks.items
    )
  }

  return axios
    .get(`${apiUrl}search?type=track&q=artist:${artist.name}&limit=50`)
    .then(responsePlaylists => {
      return parseArtistTracks([], responsePlaylists.data)
    })
    .then(tracklist => {
      store.dispatch({ type: 'ARTIST_TRACKLIST', artist, tracklist })
      return tracklist.tracks.items
    })
}
