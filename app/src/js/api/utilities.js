import axios from '@js/lib/axios'

export const getApiheaders = () => ({
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem('userToken')}`,
  },
})
const headers = getApiheaders()

export const getPlaylistTracks = (tracksAccumulator = [], playlist) => {
  const allTracks = tracksAccumulator.id ? tracksAccumulator : playlist
  allTracks.tracks.items = tracksAccumulator.id ? allTracks.tracks.items : []

  return axios
    .get(
      allTracks.tracks.next ? allTracks.tracks.next : allTracks.tracks.href,
      headers
    )
    .then(tracks => {
      const previousTracks = [...allTracks.tracks.items]
      allTracks.tracks = tracks.data
      allTracks.tracks.items = previousTracks.concat(tracks.data.items)

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
  axios.all(playlists.map(playlist => getPlaylistTracks([], playlist)))

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

export const diffArrays = (arr1, arr2) => arr1.filter(x => !arr2.includes(x))
