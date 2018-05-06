// libs
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

// api
import User, { logout } from '@js/api/User'

// components
import Loading from '@components/partials/Loading'

export default class Header extends Component {
  constructor() {
    super()
    this.state = {
      user: {},
    }
  }

  componentDidMount() {
    new User().me().then(user => this.setState({ user }))
  }

  render() {
    return (
      <header className="app__header mb-3">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              SPL
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarColor03"
              aria-controls="navbarColor03"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarColor03">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <NavLink className="nav-link" to="/track-match">
                    track-match <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
                <li className="nav-item active">
                  <NavLink className="nav-link" to="/artist-match">
                    artist-match <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
                <li className="nav-item active">
                  <NavLink className="nav-link" to="/all-duplicates">
                    all-duplicates <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
                <li className="nav-item active">
                  <NavLink className="nav-link" to="/playlist-comparator">
                    playlist-comparator{' '}
                    <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
              </ul>
              <div className="my-2 my-lg-0">
                {this.state.user.id ? (
                  <div>
                    {this.state.user.id}
                    <button onClick={logout} className="btn btn-link">
                      logout
                    </button>
                    <img
                      style={{ width: 50 }}
                      src={this.state.user.images[0].url}
                      className="ml-2 rounded"
                    />
                  </div>
                ) : (
                  <Loading height={30} text="" />
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    )
  }
}
