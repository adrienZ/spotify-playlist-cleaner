// libs
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from '@js/lib/axios'

// api
import { searchTrack } from '@js/api/Track'
import User from '@js/api/User'

// components
import ListCompact from '@components/ListCompact'
import Loading from '@components/Loading'

// local vars
const user = new User()
const tableLabels = ['Name', 'Artists(s)', 'Album']

export default class TrackMatch extends Component {
  constructor() {
    super()
    this.state = {
      query: '',
      request: null,
      results: [],
      resultRedirect: false,
    }
  }

  onQueryChange(event) {
    const query = event.target.value

    // setState is async, so we search as callback
    this.setState({ query }, () => this.search(query))
  }

  search() {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    // cancel previous request
    if (this.state.request) {
      source.cancel()
    }

    const searchPromise = this.state.query
      ? () => searchTrack(this.state.query, CancelToken)
      : () => new user.getRecentTracks(CancelToken)

    const request = searchPromise().then(matches => {
      const results = matches.data.hasOwnProperty('tracks')
        ? matches.data.tracks.items
        : [matches.data]

      this.setState({
        results,
        request: null,
      })
    })

    this.setState({ request })
  }

  selectTrack(track) {
    this.setState({
      resultRedirect: <Redirect push to={`/track-match/results/${track.id}`} />,
    })
  }

  componentDidMount() {
    this.search()
  }

  render() {
    return (
      <div className="track-match">
        {this.state.resultRedirect}

        <section className="container jumbotron">
          <div className="form-group">
            <label className="control-label col-form-label-lg">
              Search a Track {this.state.request && ' - searching...'}
            </label>
            <div className="form-group">
              <div className="input-group mb-3">
                <input
                  onChange={this.onQueryChange.bind(this)}
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Master of puppets"
                  value={this.state.query}
                />
                <div className="input-group-append">
                  <button className="input-group-text btn btn-primary">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          {(this.state.results.length && (
            <React.Fragment>
              {!this.state.query ? (
                <p className="text-muted">
                  <i>Based on what you recently played</i>
                </p>
              ) : (
                ''
              )}
              <ListCompact
                labels={tableLabels}
                rows={track => [
                  track.name,
                  track.artists.map(a => a.name).join(', '),
                  track.album.name,
                ]}
                results={this.state.results}
                onClickHandler={this.selectTrack.bind(this)}
              />
            </React.Fragment>
          )) ||
            (this.state.query ? (
              <p className="h3 text-center my-5">
                <span>
                  No results found for query : <mark>{this.state.query}</mark>
                </span>
              </p>
            ) : (
              <PlaceholderResults />
            ))}
        </section>
      </div>
    )
  }
}

// placeholders
const PlaceholderRow = () => <Loading key height={13} text="" />
const PlaceholderResults = () => (
  <ListCompact
    noIndex
    labels={tableLabels}
    rows={() => [0, 1, 2].map(() => <PlaceholderRow key />)}
    results={[0, 1, 2, 3, 4]}
  />
)
