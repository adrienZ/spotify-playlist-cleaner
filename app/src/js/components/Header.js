import React, { Component } from 'react'
import { createStore } from 'redux'
import { Link } from 'react-router-dom'

import { getUser, getUserToken } from '@js/api/api'
import userReducer from '@reducers/userReducer'

const store = createStore(userReducer)
store.dispatch({ type: 'USER_LOGIN', user: null })

export default class Header extends Component {
  constructor() {
    super()
    this.state = {
      user: {},
    }
  }

  componentDidMount() {
    getUser().then(userData => {
      const user = Object.assign({}, userData.data, { token: getUserToken() })

      store.dispatch({ type: 'USER_LOGIN', user })
      this.setState({ user })
    })
  }

  render() {
    return (
      <header className="app__header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">
            Sptfy
          </a>
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
                <Link className="nav-link" to="/songmatch">
                  song-match <span className="sr-only">(current)</span>
                </Link>
              </li>
            </ul>
            <div className=" my-2 my-lg-0">
              {this.state.user.id ? (
                <div>
                  <span>Welcome {this.state.user.id}</span>
                  <img
                    style={{ width: 50 }}
                    src={this.state.user.images[0].url}
                  />
                </div>
              ) : (
                <div className="app__placeholder" />
              )}
            </div>
          </div>
        </nav>
      </header>
    )
  }
}
