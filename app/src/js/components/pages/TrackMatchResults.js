// libs
import React, { Component } from 'react'
import axios from '@js/lib/axios'
import { Link } from 'react-router-dom'

// api
import User from '@js/api/User'
import { searchTrack } from '@js/api/Track'
import { diffArrays } from '@js/api/utilities'

// components
import Loading from '@components/partials/Loading'
import HeroTrack from '@components/partials/HeroTrack'
import HeroPlaylist from '@components/partials/HeroPlaylist'

// local vars
const user = new User()

export default class TrackMatchResults extends Component {
  constructor(props) {
    super(props)
    this.props = props
    // fucking broken router
    this.track_id = props.location.pathname.split('/').slice(-1)[0]

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
    let playlistDetectedMessage = {
      label: 'playlists founded',
      value: 0,
      status: 'pending',
    }

    this.setState({
      messages: this.state.messages.concat([playlistDetectedMessage]),
      status: 'scraping',
      results: [],
    })

    user.detectTrack(this.track_id).then(detectedPlaylists => {
      playlistDetectedMessage = Object.assign({}, playlistDetectedMessage, {
        value: detectedPlaylists.length,
        status: 'done',
      })

      this.setState(
        {
          results: detectedPlaylists,
          resultsBackup: detectedPlaylists,
          status: 'ready',
          finished: true,
          messages: this.state.messages
            .slice(0, -1)
            .concat([playlistDetectedMessage]),
        },
        () =>
          detectedPlaylists.length &&
          this.resZone.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start',
          })
      )
    })
  }

  componentDidMount() {
    // spotify uri
    const getTrack = searchTrack('spotify:track:' + this.track_id).then(track =>
      this.setState({
        trackToCheck: track.data,
      })
    )

    const showMessages = user.getPlaylists().then(playlists => {
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
    const HeroTrackLayoutClasses = 'col-md-4 offset-md-1 ' + headerRowSpacing

    return (
      <div className="track-matchResults">
        <section className="container pb-5">
          <Link to="/track-match">-- Search an other track</Link>
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
                      Localize
                    </button>
                  ) : (
                    <Loading height={25} width={200} text="fetching data" />
                  )}
                </div>
              ) : null}
              {this.state.finished && !this.state.results.length ? (
                <p className="h4 container">
                  You dont have this track in any of your playlists !
                  <Link className="btn btn-warning mt-2" to="/track-match">
                    Return to search
                  </Link>
                </p>
              ) : null}
            </div>

            {this.state.trackToCheck ? (
              <HeroTrack
                track={this.state.trackToCheck}
                bootstrapClasses={HeroTrackLayoutClasses}
              />
            ) : (
              <Loading height="45vh" className={HeroTrackLayoutClasses} />
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
