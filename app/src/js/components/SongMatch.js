import React, { Component } from 'react'
import axios from 'axios'

import { searchSong } from '@js/api/api'

import Header from '@components/Header'
import ListCompact from '@components/ListCompact'

export default class SongMatch extends Component {
  constructor() {
    super()
    this.state = {
      query: '',
      request: null,
      results: [],
    }
  }

  onQueryChange(event) {
    const query = event.target.value

    // setState is async, so we search as callback
    this.setState({ query }, () => query && this.search(query))
  }

  search() {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    // cancel previous request
    if (this.state.request) {
      source.cancel()
    }

    const request = searchSong(this.state.query, CancelToken).then(matches => {
      this.setState({
        results: matches.data.tracks.items,
        request: null,
      })
    })

    this.setState({ request })
  }

  selectSong(song) {
    console.log(song.id, store.getState())
  }

  render() {
    return (
      <div className="songmatch">
        <Header />

        <section className="container jumbotron">
          <div className="form-group">
            <label className="control-label">
              Search a song {this.state.request && ' - searching...'}
            </label>
            <div className="form-group">
              <div className="input-group mb-3">
                <input
                  onChange={this.onQueryChange.bind(this)}
                  type="text"
                  className="form-control"
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
            <ListCompact
              results={this.state.results}
              onClickHandler={this.selectSong.bind(this)}
            />
          )) ||
            ''}
        </section>
      </div>
    )
  }
}
