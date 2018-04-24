import axios from 'axios'

export const getApiheaders = () => ({
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem('userToken')}`,
  },
})
const headers = getApiheaders()

export const getPlaylistTracks = (tracksAccumulator = [], playlist) => {
  const allTracks = tracksAccumulator.id ? tracksAccumulator : playlist

  return axios
    .get(
      tracksAccumulator.id
        ? tracksAccumulator.tracks.next
        : playlist.tracks.href,
      headers
    )
    .then(tracks => {
      allTracks.tracks = Object.assign(allTracks.tracks, tracks.data)
      return tracks.data.next
        ? getPlaylistTracks(allTracks, tracks.data)
        : allTracks
    })
}

export const parseUserPlaylists = (
  playlistAccumulator = [],
  playlistsBuffer
) => {
  let allPlaylists = playlistAccumulator.length
    ? playlistAccumulator
    : playlistsBuffer.items
  return axios.get(playlistsBuffer.next, headers).then(nextParsing => {
    allPlaylists = allPlaylists.concat(nextParsing.data.items)
    return nextParsing.data.next
      ? parseUserPlaylists(allPlaylists, nextParsing.data)
      : allPlaylists
  })
}

export const trackifyPlaylists = playlists =>
  Promise.all(playlists.map(playlist => getPlaylistTracks([], playlist)))

export const getUrlVars = url => {
  let hash
  const myJson = {}
  const hashes = url.slice(url.indexOf('?') + 1).split('&')
  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=')
    myJson[hash[0]] = hash[1]
  }
  return myJson
}

export const isSpotifyTrackUri = str => {
  const isUri = /^(spotify:track:)/.test(str)
  return isUri ? str.split('spotify:track:')[1] : false
}

export const isSpotifyTrackUrl = str => {
  const isUrl = /^(https:\/\/open.spotify.com\/track\/)/.test(str)
  return isUrl ? str.split('https://open.spotify.com/track/')[1] : false
}
