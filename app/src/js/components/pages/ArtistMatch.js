// libs
import React, { Component } from 'react'

// api
import { searchArtist } from '@js/api/Track'

// components
import Search from '@components/partials/Search'

// local vars
const resultsLabels = ['Artists']

export default class TrackMatch extends Component {
  renderRowResult(artist) {
    return (
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
      </span>
    )
  }

  render() {
    return (
      <div className="artist-match">
        <Search
          resultsLabels={resultsLabels}
          searchCallback={searchArtist}
          searchPlaceholderText="Megadeth, Slayer..."
          placeholderCallback="getRecentArtists"
          placeholderContext="Based on your favorites"
          placeholderRowHeight={40}
          redirectUrl={artistId => `/artist-match/results/${artistId}`}
          apiTargetKey="artists"
          resultRow={this.renderRowResult}
        />
      </div>
    )
  }
}
