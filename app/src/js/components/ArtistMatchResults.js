// libs
import React, { Component } from 'react'
import axios from '@js/lib/axios'
import { Link } from 'react-router-dom'

// api
import User from '@js/api/User'
import { searchArtist, getArtistTracks } from '@js/api/Track'
import { diffArrays } from '@js/api/utilities'

// components
import Loading from '@components/Loading'
import HeroArtist from '@components/HeroArtist'
// import HeroPlaylist from '@components/HeroPlaylist'

// local vars
const user = new User()

export default class ArtistMatchResults extends Component {
  constructor(props) {
    super(props)
    this.props = props
    // fucking broken router
    this.artist_id = props.location.pathname.split('/').slice(-1)[0]

    this.state = {
      playlists: [],
      messages: [],
      artistToCheck: null,
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

    const results = []

    user
      .getPlaylistsFull()
      .then(() =>
        getArtistTracks(this.state.artistToCheck).then(tracks =>
          axios
            .all(
              tracks.map(t => ({
                track: t,
                matches: user
                  .detectTrack(t.id)
                  .then(matches => results.push({ track: t, matches })),
              }))
            )
            .then(() =>
              results.filter(r => {
                return r.matches.length
              })
            )
        )
      )
      .then(res => {
        console.log(res)

        this.setState({
          results: res,
        })
      })
  }

  componentDidMount() {
    // spotify uri
    const getArtist = searchArtist('spotify:artist:' + this.artist_id).then(
      artist =>
        this.setState({
          artistToCheck: artist.data,
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

    axios.all([showMessages, getArtist]).then(() => {
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
    const HeroArtistLayoutClasses = 'col-md-4 offset-md-1 ' + headerRowSpacing

    return (
      <div className="artist-matchResults">
        <section className="container pb-5">
          <Link to="/artist-match">-- Search an other artist</Link>
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
                  You dont have this artist in any of your playlists !
                  <Link className="btn btn-warning mt-2" to="/artist-match">
                    Return to search
                  </Link>
                </p>
              ) : null}
            </div>

            {this.state.artistToCheck ? (
              <HeroArtist
                artist={this.state.artistToCheck}
                bootstrapClasses={HeroArtistLayoutClasses}
              />
            ) : (
              <Loading height="45vh" className={HeroArtistLayoutClasses} />
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
              <mark>{this.state.artistToCheck.name}</mark> ({this.state.artistToCheck.artists
                .map(a => a.name)
                .join(', ')})
            </h2>
          ) : null}
          <div ref={zone => (this.resZone = zone)} className="row">
            {this.state.results.map(p => (
              <div key={p.id} className={`col-md-4 mb-3`}>
                {/* <HeroPlaylist
                  index={i}
                  playlist={p}
                  track={this.state.artistToCheck}
                  hideOneResult={() => this.hideOneResult(i)}
                /> */}
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }
}
