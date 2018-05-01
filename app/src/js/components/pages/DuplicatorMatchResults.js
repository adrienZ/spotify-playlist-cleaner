// libs
import React, { Component } from 'react'

// api
import User from '@js/api/User'
// import { searchTrack } from '@js/api/Track'
import { diffArrays } from '@js/api/utilities'

// components
import Loading from '@components/partials/Loading'

// local vars
const user = new User()

export default class DuplicatorMatchResults extends Component {
  constructor(props) {
    super(props)
    this.props = props

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

    user.getDuplicates({ delay: 200 }).then(detectedDuplicates => {
      playlistDetectedMessage = Object.assign({}, playlistDetectedMessage, {
        value: detectedDuplicates.length,
        status: 'done',
      })

      this.setState(
        {
          results: detectedDuplicates,
          resultsBackup: detectedDuplicates,
          status: 'ready',
          finished: true,
          messages: this.state.messages
            .slice(0, -1)
            .concat([playlistDetectedMessage]),
        },
        () =>
          detectedDuplicates.length &&
          this.resZone.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start',
          })
      )
    })
  }

  componentDidMount() {
    user
      .getPlaylists()
      .then(playlists => {
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
              label: 'tracks to check',
              value: totalTracks,
              status: 'done',
            },
          ]),
        })
      })
      .then(() => {
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
    newRes = newRes.map(d => {
      if (fromTrash.indexOf(d) > -1) d.track.fromCache = true
      return d
    })

    this.setState({
      results: newRes,
      resultsModified: false,
    })
  }

  render() {
    const headerRowSpacing = 'my-4'

    return (
      <div className="duplicator-matchResults">
        <section className="container pb-5">
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
                  {/* <Link className="btn btn-warning mt-2" to="/track-match">
                    Return to search
                  </Link> */}
                </p>
              ) : null}
            </div>
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
            </h2>
          ) : null}
          <div ref={zone => (this.resZone = zone)} className="row">
            {this.state.results.map((d, i) => (
              <div key={i} className={`col-md-4 mb-3`}>
                <h4>{d.track.name}</h4>
                <ul>{d.matches.map(p => <li key={p.id}>{p.name}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }
}
