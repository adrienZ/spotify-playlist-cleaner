// libs
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from '@js/lib/axios'

// api
import { searchArtist } from '@js/api/Track'
import User from '@js/api/User'

// components
import ListCompact from '@components/ListCompact'
import Loading from '@components/Loading'

// local vars
const user = new User()
const tableLabels = ['Artists']

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
      ? () => searchArtist(this.state.query, CancelToken)
      : () => new user.getRecentArtists(CancelToken)

    const request = searchPromise().then(matches => {
      const results = matches.data.hasOwnProperty('artists')
        ? matches.data.artists.items
        : [matches.data]

      this.setState({
        results,
        request: null,
      })
    })

    this.setState({ request })
  }

  selectArtist(artist) {
    this.setState({
      resultRedirect: (
        <Redirect push to={`/artist-match/results/${artist.id}`} />
      ),
    })
  }

  componentDidMount() {
    this.search()
  }

  render() {
    return (
      <div className="artist-match">
        {this.state.resultRedirect}

        <section className="container jumbotron">
          <div className="form-group">
            <label className="control-label col-form-label-lg">
              Search a track {this.state.request && ' - searching...'}
            </label>
            <div className="form-group">
              <div className="input-group mb-3">
                <input
                  onChange={this.onQueryChange.bind(this)}
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Megadeth, Slayer..."
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
                  <i>Based on what your favorites</i>
                </p>
              ) : (
                ''
              )}
              <ListCompact
                labels={['Artist']}
                rows={artist => [
                  <span key={artist.id}>
                    {artist.images.length ? (
                      <img
                        className="img_rounded mr-3"
                        alt={artist.name}
                        src={artist.images.slice(-1)[0].url}
                        height={50}
                      />
                    ) : (
                      <div
                        className="img_rounded mr-3"
                        style={{
                          height: 50,
                          width: 50,
                          background: 'lightgrey',
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}
                      />
                    )}
                    {artist.name}
                  </span>,
                ]}
                results={this.state.results}
                onClickHandler={this.selectArtist.bind(this)}
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
const PlaceholderRow = () => <Loading key height={40} text="" />
const PlaceholderResults = () => (
  <ListCompact
    noIndex={true}
    labels={tableLabels}
    rows={() => [0].map(() => <PlaceholderRow key />)}
    results={[0, 1, 2, 3, 4]}
  />
)
