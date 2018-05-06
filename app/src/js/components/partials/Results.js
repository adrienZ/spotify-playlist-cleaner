// libs
import React, { Component } from 'react'
import axios from '@js/lib/axios'
import { Link } from 'react-router-dom'

// api
import User from '@js/api/User'
import { diffArrays } from '@js/api/utilities'

// components
import Loading from '@components/partials/Loading'

// local vars
const user = new User()

export default class Results extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playlists: [],
      messages: [],
      ItemToCheck: null,
      status: 'pending',
      results: [],
      finished: false,
      resultsBackup: [],
      resultsModified: false,
    }
  }

  compare() {
    let playlistDetectedMessage = {
      label: 'matches founded',
      value: 0,
      status: 'pending',
    }

    this.setState({
      messages: this.state.messages.concat([playlistDetectedMessage]),
      status: 'scraping',
      results: [],
    })

    this.props.comparePromise(this.state.ItemToCheck).then(res => {
      playlistDetectedMessage = Object.assign({}, playlistDetectedMessage, {
        value: res.length,
        status: 'done',
      })

      this.setState(
        {
          results: res,
          resultsBackup: res,
          status: 'ready',
          finished: true,
          messages: this.state.messages
            .slice(0, -1)
            .concat([playlistDetectedMessage]),
        },
        () =>
          res.length &&
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
    const getItem = this.props.itemPromise().then(item =>
      this.setState({
        ItemToCheck: item.data,
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
            label: 'tracks to check',
            value: totalTracks,
            status: 'done',
          },
        ]),
      })
    })

    axios.all([showMessages, getItem]).then(() => {
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
    newRes = newRes.map(r => {
      if (fromTrash.indexOf(r) > -1) r.fromCache = true
      return r
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
      <div className="results">
        <section className="container pb-5">
          {this.props.returnUrl && (
            <Link to={this.props.returnUrl}>
              -- Search an other {this.props.apiTargetKey}
            </Link>
          )}
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
                  You dont have this {this.props.apiTargetKey} in any of your
                  playlists !
                  {this.props.returnUrl && (
                    <Link
                      className="btn btn-warning mt-2"
                      to={this.props.returnUrl}>
                      Return to search
                    </Link>
                  )}
                </p>
              ) : null}
            </div>

            {this.state.ItemToCheck ? (
              this.props.heroCard(
                this.state.ItemToCheck,
                HeroArtistLayoutClasses
              )
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
              <mark>{this.state.ItemToCheck.name}</mark>
              {this.state.ItemToCheck.images &&
              this.state.ItemToCheck.images.length ? (
                <img
                  className="img_rounded ml-3"
                  alt={this.state.ItemToCheck.name}
                  src={this.state.ItemToCheck.images.slice(-1)[0].url}
                  height={80}
                />
              ) : (
                ''
              )}
            </h2>
          ) : null}
          <div className="row" ref={zone => (this.resZone = zone)}>
            {this.state.results.map((r, i) => (
              <div key={i} className={`col-md-3 mb-4 col-sm-6`}>
                {this.props.resultComponent(r, this.state.ItemToCheck, () =>
                  this.hideOneResult(i)
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }
}
