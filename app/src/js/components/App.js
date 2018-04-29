import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="container">
          <h3>Tasks available</h3>
          <ul>
            <li>
              <Link to="/track-match">
                Track matcher ( Find if you have this track in one of your
                playlists)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
