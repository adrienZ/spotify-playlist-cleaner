import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import store from '@js/Store'

import Loading from '@components/Loading'
import HeroSong from '@components/HeroSong'
import HeroPlaylist from '@components/HeroPlaylist'

import { getUserPlaylists, getUserPlaylistsFull, searchSong } from '@js/api/api'
import { diffArrays } from '@js/api/utilities'

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
      finished: false,
      resultsBackup: [],
      resultsModified: false,
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
        resultsBackup: detectedPlaylists,
        status: 'ready',
        finished: true,
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

  hideOneResult(index) {
    const newRes = [...this.state.results]

    newRes.splice(index, 1)

    this.setState({
      results: newRes,
      resultsModified: true,
    })
  }

  restoreResults() {
    const fromTrash = diffArrays(this.state.resultsBackup, this.state.results)
    let newRes = [...this.state.resultsBackup]
    newRes = newRes.map(p => {
      if (fromTrash.indexOf(p) > -1) p.fromCache = true
      return p
    })

    this.setState({
      results: newRes,
      resultsModified: false,
    })
  }

  render() {
    const headerRowSpacing = 'my-4'
    const HeroSongLayoutClasses = 'col-md-4 offset-md-1 ' + headerRowSpacing

    return (
      <div className="songmatchResults">
        <section className="container pb-5">
          <Link to="/songmatch">-- Search an other track</Link>
          <div className="row">
            <div className={`col-md-7 jumbotron row ${headerRowSpacing}`}>
              {this.state.messages.length ? (
                <ul className="list-group mb-3" style={{ width: '100%' }}>
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
              ) : (
                <Loading height="20vh" />
              )}
              {!this.state.finished ? (
                <div>
                  <p>This operation may take some time (more than a minute)</p>

                  {this.state.status === 'ready' ? (
                    <button
                      onClick={this.compare.bind(this)}
                      className="btn btn-primary btn-lg">
                      Search
                    </button>
                  ) : (
                    <Loading height={25} width={200} text="fetching data" />
                  )}
                </div>
              ) : null}
              {this.state.finished && !this.state.results.length ? (
                <p className="h4 container">
                  You dont have this track in any of your playlists !
                </p>
              ) : null}
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

          {this.state.resultsModified ? (
            <button
              onClick={this.restoreResults.bind(this)}
              className="btn btn-link">
              restore results
            </button>
          ) : (
            ''
          )}
          {this.state.finished && this.state.results.length ? (
            <h2 className="text-center my-5">
              {this.state.results.length} matches found for{' '}
              <mark>{this.state.trackToCheck.name}</mark> ({this.state.trackToCheck.artists
                .map(a => a.name)
                .join(', ')})
            </h2>
          ) : null}
          <div ref={zone => (this.resZone = zone)} className="row">
            {this.state.results.map((p, i) => (
              <div key={p.id} className={`col-md-4 mb-3`}>
                <HeroPlaylist
                  index={i}
                  playlist={p}
                  track={this.state.trackToCheck}
                  hideOneResult={() => this.hideOneResult(i)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }
}
