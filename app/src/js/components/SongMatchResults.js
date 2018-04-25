import React, { Component } from 'react'
import axios from 'axios'

import Header from '@components/Header'
import Loading from '@components/Loading'
import HeroSong from '@components/HeroSong'

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
    const headerRowSpacing = 'my-4'
    const HeroSongLayoutClasses = 'col-md-5 offset-md-2 ' + headerRowSpacing

    return (
      <div className="songmatchResults">
        <Header />

        <section className="container">
          <div className="row">
            <div className={`col-md-5 ${headerRowSpacing}`}>
              {this.state.messages.length ? (
                this.state.messages.map((message, i) => (
                  <p className="my-2" key={i}>
                    {' '}
                    {message}{' '}
                  </p>
                ))
              ) : (
                <Loading height="20vh" />
              )}
              {this.state.status === 'ready' ? (
                <button
                  onClick={this.compare.bind(this)}
                  className="btn btn-primary">
                  Compare
                </button>
              ) : (
                <Loading height={25} width={200} text="fetching data" />
              )}
            </div>

            {this.state.trackToCheck ? (
              <HeroSong
                song={this.state.trackToCheck}
                bootstrapClasses={HeroSongLayoutClasses}
              />
            ) : (
              <Loading height="45vh" className={HeroSongLayoutClasses} />
            )}
          </div>

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
