// libs
import React, { Component } from 'react'

// api
import config, { scopes } from '@js/api/config'

const authUrl = `https://accounts.spotify.com/authorize/?client_id=${
  config.CLIENT_ID
}&response_type=token&redirect_uri=${encodeURIComponent(
  config.REDIRECT_URI
)}&scope=${encodeURIComponent(scopes.join(' '))}`

export default class Login extends Component {
  render() {
    return (
      <div className="login col-2 offset-5">
        <a className="btn btn-success" href={authUrl}>
          Login here
        </a>
      </div>
    )
  }
}
