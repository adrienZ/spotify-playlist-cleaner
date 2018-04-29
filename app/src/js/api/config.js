export default {
  CLIENT_ID: '6a64f16d6d7e4ea5aebc61f728b6c242',
  CLIENT_SECRET: '51d227575ac24e1e8f2e249ce1e739fa',
  // REDIRECT_URI: 'https://adrienz.github.io/spotify-playlist-manager/',
  REDIRECT_URI: 'http://localhost:3000/',
}

export const scopes = [
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-read-private',
  'user-read-recently-played',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-top-read',
]

export const apiUrl = 'https://api.spotify.com/v1/'
