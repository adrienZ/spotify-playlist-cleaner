// libs
import React, { Component } from 'react'

// api
import { searchTrack } from '@js/api/Track'

// components
import Search from '@components/partials/Search'

// local vars
const resultsLabels = ['Name', 'Artists(s)', 'Album']

export default class TrackMatch extends Component {
  renderRowResult(track) {
    return [
      track.name,
      track.artists.map(a => a.name).join(', '),
      track.album.name,
    ]
  }

  render() {
    return (
      <div className="track-match">
        <Search
          resultsLabels={resultsLabels}
          searchCallback={searchTrack}
          searchPlaceholderText="Megadeth, Slayer..."
          placeholderCallback="getRecentTracks"
          placeholderContext="Based on what you recently played"
          placeholderRowHeight={13}
          redirectUrl={trackId => `/track-match/results/${trackId}`}
          apiTargetKey="tracks"
          resultRow={this.renderRowResult}
        />
      </div>
    )
  }
}
