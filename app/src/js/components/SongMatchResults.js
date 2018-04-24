import React, { Component } from 'react'

import Header from '@components/Header'
import { getUserPlaylists, getUserPlaylistsFull, searchSong } from '@js/api/api'

export default class SongMatchResults extends Component {
  constructor(props) {
    super(props)
    this.props = props
    // fucking broken router
    this.song_id = props.location.pathname.split('/').slice(-1)[0]

    this.state = {
      playlists: [],
      messages: [],
    }
  }

  componentDidMount() {
    getUserPlaylists().then(playlists => {
      const totalTracks = playlists.reduce((acc, playlist) => {
        return acc + playlist.tracks.total
      }, 0)

      this.setState({
        playlists,
        messages: this.state.messages.concat([
          `${playlists.length} playlists found`,
          `${totalTracks} tracks to check`,
          `This operation may take some time (more than a minute)`,
        ]),
      })
    })
    // .then(() => {
    //   getUserPlaylistsFull().then(test =>
    //     console.log('TEST', store.getState())
    //   )
    // })
  }

  render() {
    return (
      <div className="songmatchResults">
        <Header />

        {this.state.messages.map((message, i) => <p key={i}>{message}</p>)}

        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    )
  }
}
