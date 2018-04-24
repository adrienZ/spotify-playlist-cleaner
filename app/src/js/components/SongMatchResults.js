import React, { Component } from 'react'

import Header from '@components/Header'

export default class SongMatchResults extends Component {
  constructor(props) {
    super(props)
    this.props = props
    // fucking broken router
    this.song_id = props.location.pathname.split('/').slice(-1)[0]
  }

  render() {
    return (
      <div className="songmatchResults">
        <Header />

        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    )
  }
}
