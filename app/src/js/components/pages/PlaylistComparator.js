import React, { Component } from 'react'

// api
import User from '@js/api/User'

// components
import Loading from '@components/partials/Loading'

export default class PlaylistComparator extends Component {
  constructor() {
    super()
    this.state = { playlists: [], selected: false }
  }

  onSelect(id) {
    const selected = Object.assign({}, this.state.selected)
    selected[id] = !this.state.selected[id]

    this.setState({
      selected,
    })
  }

  componentDidMount() {
    new User().getPlaylists().then(playlists =>
      this.setState({
        playlists,
      })
    )
  }

  render() {
    return (
      <div className="artist-matchResults container">
        <section className="row pb-5">
          <div className="col-md-9 row">
            {this.state.playlists.length
              ? this.state.playlists
                .sort((a, b) => b.tracks.total - a.tracks.total)
                .map(p => (
                  <div key={p.id} className="col-md-4 mb-3">
                    <div
                      className={`card ${this.state.selected[p.id] &&
                          'bg-secondary text-white'}`}
                      onClick={() => this.onSelect(p.id)}>
                      <h3 className="card-header">
                        {p.name.substring(0, 100)}
                      </h3>
                      {p.images.length && (
                        <img
                          className="img-fluid"
                          src={p.images[0].url}
                          alt="Card image"
                        />
                      )}
                    </div>
                  </div>
                ))
              : [0, 1, 2, 3, 5, 6].map(i => (
                <Loading
                  key={i}
                  className="my-3"
                  height={90 * 2}
                  width={160 * 2}
                />
              ))}
          </div>
          <div className="col-md-3">
            {this.state.playlists.length
              ? this.state.playlists
                .sort((a, b) => a.tracks.total - b.tracks.total)
                .map(p => (
                  <div
                    style={{ height: 75 }}
                    key={p.id}
                    className={`${this.state.selected[p.id] &&
                        'bg-secondary text-white'}`}>
                    {p.images.length && (
                      <img
                        className="h-100"
                        src={p.images[0].url}
                        alt="Card image"
                      />
                    )}
                    <span className="w-50 truncate">
                      {p.name.substring(0, 100)}
                    </span>
                    <span className="w-25"> {p.tracks.total}</span>
                  </div>
                ))
              : [0, 1, 2, 3, 5, 6].map(i => (
                <Loading
                  key={i}
                  className="my-3"
                  height={90 * 2}
                  width={160 * 2}
                />
              ))}
          </div>
        </section>
      </div>
    )
  }
}
