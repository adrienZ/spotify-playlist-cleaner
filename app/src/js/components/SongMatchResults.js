import React, { Component } from 'react'
import axios from 'axios'

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
      trackToCheck: null,
      status: 'pending',
      results: [],
    }
  }

  compare() {
    getUserPlaylistsFull().then(playlists_full => {
      const detectedPlaylists = playlists_full.filter(p => {
        const detected = p.tracks.items.filter(t => {
          if (!t.track) return false
          return t.track.id === this.song_id
        })
        return detected.length > 0
      })

      this.setState({
        results: detectedPlaylists,
      })
    })
  }

  componentDidMount() {
    // spotify uri
    const getTrack = searchSong('spotify:track:' + this.song_id).then(track =>
      this.setState({
        trackToCheck: track.data,
      })
    )

    const showMessages = getUserPlaylists().then(playlists => {
      const totalTracks = playlists.reduce(
        (acc, playlist) => acc + playlist.tracks.total,
        0
      )

      this.setState({
        playlists,
        messages: this.state.messages.concat([
          `${playlists.length} playlists found`,
          `${totalTracks} tracks to check`,
          `This operation may take some time (more than a minute)`,
        ]),
      })
    })

    axios.all([showMessages, getTrack]).then(() => {
      this.setState({
        status: 'ready',
      })
    })
  }

  render() {
    return (
      <div className="songmatchResults">
        <Header />

        <section className="container">
          <div className="row">
            <div className="col-md-6">
              {this.state.messages.length
                ? this.state.messages.map((message, i) => (
                    <p key={i}> {message} </p>
                  ))
                : 'loading...'}
            </div>

            {this.state.trackToCheck ? (
              <div
                className="card text-white bg-secondary col-md-6"
                style={{ maxWidth: '20rem' }}>
                <div className="card-header">Song to check</div>
                <div className="card-body">
                  <h4 className="card-title">{this.state.trackToCheck.name}</h4>
                  <img src={this.state.trackToCheck.album.images[1].url} />
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the cards content.
                  </p>
                </div>
              </div>
            ) : (
              'loading...'
            )}
          </div>

          {this.state.status === 'ready' ? (
            <button
              onClick={this.compare.bind(this)}
              className="btn btn-primary">
              {' '}
              test !!!{' '}
            </button>
          ) : (
            'collecting your playlists informations'
          )}

          <pre>
            {JSON.stringify(
              this.state.results.map(p => ({
                name: p.name,
              })),
              null,
              2
            )}
          </pre>
        </section>
      </div>
    )
  }
}
