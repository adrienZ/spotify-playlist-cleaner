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
              <Link to="/songmatch">
                Song matcher ( Find if you have this song in one of your
                playlists)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
