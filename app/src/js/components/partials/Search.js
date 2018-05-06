// libs
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from '@js/lib/axios'
import PropTypes from 'prop-types' // ES6

// api
import User from '@js/api/User'

// components
import ListCompact from '@components/partials/ListCompact'
import Loading from '@components/partials/Loading'

// local vars
const user = new User()

export default class Search extends Component {
  constructor() {
    super()

    this.state = {
      query: '',
      request: null,
      results: [],
      resultRedirect: false,
    }

    // placeholders
    this.PlaceholderResults = () => (
      <ListCompact
        noIndex={true}
        labels={this.props.resultsLabels}
        rows={() =>
          [0].map(() => (
            <Loading key height={this.props.placeholderRowHeight} text="" />
          ))
        }
        results={[0, 1, 2, 3, 4]}
      />
    )
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
      ? () => this.props.searchCallback(this.state.query, CancelToken)
      : () => new user[this.props.placeholderCallback](CancelToken)

    const request = searchPromise().then(matches => {
      const results = matches.data.hasOwnProperty(this.props.apiTargetKey)
        ? matches.data[this.props.apiTargetKey].items
        : [matches.data]

      this.setState({
        results,
        request: null,
      })
    })

    this.setState({ request })
  }

  selectItem(obj) {
    this.setState({
      resultRedirect: (
        <Redirect
          push
          to={this.props.redirectUrl(obj.id)}
          itemLabel={this.props.apiTargetKey}
        />
      ),
    })
  }

  componentDidMount() {
    this.search()
  }

  render() {
    if (this.state.resultRedirect) return this.state.resultRedirect

    return (
      <div className="search-match">
        <section className="container jumbotron">
          <div className="form-group">
            <label className="control-label col-form-label-lg">
              Search {this.props.apiTargetKey}{' '}
              {this.state.request && ' - searching...'}
            </label>
            <div className="form-group">
              <div className="input-group mb-3">
                <input
                  onChange={this.onQueryChange.bind(this)}
                  type="text"
                  className="form-control form-control-lg"
                  placeholder={this.props.searchPlaceholderText}
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
                  <i>{this.props.placeholderContext}</i>
                </p>
              ) : (
                ''
              )}
              <ListCompact
                labels={this.props.resultsLabels}
                rows={item => [this.props.resultRow(item)]}
                results={this.state.results}
                onClickHandler={this.selectItem.bind(this)}
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
              <this.PlaceholderResults />
            ))}
        </section>
      </div>
    )
  }
}

Search.propTypes = {
  searchCallback: PropTypes.func.isRequired,
  resultsLabels: PropTypes.array.isRequired,
  searchPlaceholderText: PropTypes.string.isRequired,
  placeholderContext: PropTypes.string.isRequired,
  apiTargetKey: PropTypes.string.isRequired,
  placeholderRowHeight: PropTypes.number.isRequired,
  redirectUrl: PropTypes.func.isRequired,
  resultRow: PropTypes.func.isRequired,
  placeholderCallback: (props, propName, componentName) => {
    const error = new Error(
      'Invalid prop `' +
        propName +
        '` supplied to' +
        ' `' +
        componentName +
        '`. Validation failed.'
    )

    if (typeof props[propName] !== 'string') {
      return error
    }

    if (typeof new User()[props[propName]] !== 'function') {
      return error
    }
  },
}
