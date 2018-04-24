import axios from 'axios'

import {
  getApiheaders,
  parseUserPlaylists,
  trackifyPlaylists,
  getUrlVars,
  isSpotifyTrackUrl,
  isSpotifyTrackUri,
} from './utilities'

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

  if (UrlParamToken)
    window.location.replace(
      window.location.href.replace(window.location.hash, '')
    )

  if (accessToken) window.localStorage.setItem('userToken', accessToken)

  return accessToken
}

export const getUser = () => {
  if (!getUserToken()) return Promise.reject()
  return axios.get('https://api.spotify.com/v1/me', headers).catch(error => {
    if (error.response.status === 401) {
      return logout()
    }
  })
}

// export const parseUser = () => {
//   if (!getUserToken()) return Promise.reject();

//   let appUser = null;
//   return axios.get(
//     'https://api.spotify.com/v1/me',
//     headers,
//   )
//   // get User
//     .then((user) => {
//       appUser = user;
//       return axios.get(
//         `https://api.spotify.com/v1/users/${user.data.id}/playlists?limit=50`,
//         headers,
//       );
//     })
//     // get remainging user's playlists
//     .then(responsePlaylists => parseUserPlaylists([], responsePlaylists.data))
//     // add tracklists to playlists
//     .then((done) => {
//       const userPlaylists = done.filter(d => d.owner.id === appUser.data.id);
//       return trackifyPlaylists(userPlaylists);
//     })
//     // add playlist instance in tracklists
//     .then(trackifiedPlaylists => Array.from(trackifiedPlaylists)
//       .map(_trackifiedPlaylist => ({
//         tracklist: _trackifiedPlaylist.tracks.items.map(tracks => tracks.track),
//         playlist: _trackifiedPlaylist,
//       })))
//     // handle errors
//     .catch((e) => {
//       // eslint-disable-next-line
//       const errorPopup = new tingle.modal({
//         footer: true,
//         stickyFooter: true,
//       });

//       errorPopup.setContent(`
//       <p>Fail to load url: <code>${e.config.url}</code></p>
//       <p>You have to reconnect to renew your token</p>
//       `);

//       errorPopup.addFooterBtn('Ok, log me out', 'tingle-btn tingle-btn--primary tingle-btn--pull-right', logout);
//       errorPopup.addFooterBtn('show full stacktrace', 'tingle-btn tingle-btn--pull-right', (btn) => {
//         btn.target.remove();
//         errorPopup.setContent(`${errorPopup.getContent().innerHTML}
//       <b>Full stacktrace :</b>
//       <pre>${e.request.responseText}</pre>
//       `);
//       });
//       errorPopup.open();

//       return {
//         error: errorPopup,
//       };
//     });
// };

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
