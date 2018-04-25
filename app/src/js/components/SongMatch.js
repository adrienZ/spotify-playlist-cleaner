import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import { searchSong, getUserRecentTracks } from '@js/api/api'

import Header from '@components/Header'
import ListCompact from '@components/ListCompact'
import Loading from '@components/Loading'

export default class SongMatch extends Component {
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
      ? () => searchSong(this.state.query, CancelToken)
      : () => getUserRecentTracks(CancelToken)

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

  selectSong(song) {
    this.setState({
      resultRedirect: <Redirect push to={`/songmatch/results/${song.id}`} />,
    })
  }

  componentDidMount() {
    this.search()
  }

  render() {
    return (
      <div className="songmatch">
        <Header />

        {this.state.resultRedirect}

        <section className="container jumbotron">
          <div className="form-group">
            <label className="control-label col-form-label-lg">
              Search a song {this.state.request && ' - searching...'}
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
                results={this.state.results}
                onClickHandler={this.selectSong.bind(this)}
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

const PlaceholderRow = () => (
  <td>
    <Loading height={13} text="" />
  </td>
)

const PlaceholderResults = () => (
  <table className="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Title</th>
        <th scope="col">Artist(s)</th>
        <th scope="col">Album</th>
      </tr>
    </thead>
    <tbody>
      {[0, 1, 2, 3, 4].map(i => (
        <tr key={i}>
          <PlaceholderRow />
          <PlaceholderRow />
          <PlaceholderRow />
          <PlaceholderRow />
        </tr>
      ))}
    </tbody>
  </table>
)
