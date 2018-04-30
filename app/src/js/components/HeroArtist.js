import React, { Component } from 'react'

export default class HeroArtist extends Component {
  render() {
    const artist = this.props.artist

    return (
      <div className={`card p-0 sticky-top ${this.props.bootstrapClasses}`}>
        <div className="card-header">Artist to check</div>
        <iframe
          src={`https://open.spotify.com/embed/artist/${artist.id}`}
          width="100%"
          height="290"
          frameBorder="0"
          allow="encrypted-media"
        />

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <b>Followers:</b> {artist.followers.total}
          </li>
          <li className="list-group-item">
            <b>Genres:</b> {artist.genres.join(', ')}
          </li>
          <li className="list-group-item">
            <b>Popularité:</b>
            <div className="progress my-1">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${artist.popularity}%` }}
                aria-valuenow={artist.popularity}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </li>
        </ul>
      </div>
    )
  }
}
