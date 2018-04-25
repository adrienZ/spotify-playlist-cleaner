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
    let playlistDetectedCount = 0
    let playlistDetectedMessage = {
      label: 'playlists founded',
      value: playlistDetectedCount,
      status: 'pending',
    }

    this.setState({
      messages: this.state.messages.concat([playlistDetectedMessage]),
      status: 'scraping',
      results: [],
    })

    getUserPlaylistsFull().then(playlists_full => {
      const detectedPlaylists = playlists_full.filter(p => {
        const detected = p.tracks.items.filter(t => {
          if (!t.track) return false
          return t.track.id === this.song_id
        })

        if (detected.length > 0) {
          playlistDetectedCount = playlistDetectedCount + 1
          playlistDetectedMessage.value = playlistDetectedCount
          return true
        }
      })

      playlistDetectedMessage.status = 'done'
      this.setState({
        results: detectedPlaylists,
        status: 'ready',
        messages: this.state.messages
          .slice(0, -1)
          .concat([playlistDetectedMessage]),
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
          {
            label: 'playlists to check',
            value: playlists.length,
            status: 'done',
          },
          {
            label: ' tracks to check',
            value: totalTracks,
            status: 'done',
          },
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
    const HeroSongLayoutClasses = 'col-md-4 offset-md-1 ' + headerRowSpacing

    return (
      <div className="songmatchResults">
        <Header />

        <section className="container pb-5">
          <div className="row">
            <div className={`col-md-7 jumbotron row ${headerRowSpacing}`}>
              {this.state.messages.length ? (
                <div className="col-5 pl-0">
                  <ul className="list-group">
                    {this.state.messages.map((message, i) => (
                      <li
                        key={i}
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          message.status !== 'done' ? 'disabled pending' : ''
                        }`}>
                        {message.label}
                        <span className="badge badge-primary badge-pill">
                          {message.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Loading height="20vh" />
              )}
              <div className="col-7 pr-0">
                <p>This operation may take some time (more than a minute)</p>
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

          <div className="row">
            {this.state.results.map((p, i) => (
              <div key={p.id} className="col-md-4 mb-3">
                <div className="card text-white bg-secondary">
                  <div className="card-header">match #{i + 1}</div>
                  <div className="card-body row">
                    <div className="col-md-6">
                      <img className="img-fluid" src={p.images[1].url} />
                    </div>
                    <div className="col-md-6">
                      <p className="card-text">
                        <h5 className="card-title mb-0">{p.name}</h5>
                        <p>from {p.owner.id}</p>
                        <button type="button" className="btn btn-danger">
                          Danger
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="card-footer text-white">
                    <p className="my-0 pending">{p.tracks.total} tracks</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }
}
