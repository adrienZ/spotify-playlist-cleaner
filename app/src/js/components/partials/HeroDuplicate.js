// libs
import React, { Component } from 'react'

// api
import { deleteTrackFromPlaylist, addTrackToPlaylist } from '@js/api/Track'

export default class HeroDuplicate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasDeleted: props.fromCache,
    }
  }

  addSongToPlaylist(playlist_id, track_uri) {
    addTrackToPlaylist(playlist_id, track_uri).then(() => {
      this.setState({
        hasDeleted: false,
        lazyload: false,
      })
    })
  }

  removeSongFromPlaylist(playlist_id, track_uri) {
    deleteTrackFromPlaylist(playlist_id, track_uri).then(() => {
      this.setState({
        hasDeleted: true,
      })
    })
  }

  componentDidMount() {
    this.lazyload = () => {
      if (this.dom.getBoundingClientRect().top - window.pageYOffset <= 0) {
        this.setState({
          lazyload: true,
        })
        window.removeEventListener('scroll', this.lazyload)
      }
    }
    window.addEventListener('scroll', this.lazyload)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.lazyload)
  }

  render() {
    const track = this.props.track

    return (
      <div
        className="card text-white bg-dark text-center"
        ref={d => (this.dom = d)}>
        <iframe
          src={
            this.state.lazyload &&
            `https://open.spotify.com/embed/track/${track.id}`
          }
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
        />
        <ul className="list-group list-group-flush">
          {this.props.matches.map((p, i) => (
            <li
              key={p.id}
              className="list-group-item border-secondary text-left"
              style={{ backgroundColor: 'inherit' }}>
              <p>
                {i + 1}. {p.name}
              </p>
              {this.state.hasDeleted ? (
                <div>
                  <button
                    type="button"
                    className="btn btn-info btn-sm"
                    onClick={() => this.addSongToPlaylist(p.id, track.uri)}>
                    Undo
                  </button>
                  <button
                    type="button"
                    className="btn btn-link btn-sm"
                    onClick={this.props.hideOneResult}>
                    Hide result
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => this.removeSongFromPlaylist(p.id, track.uri)}>
                  Remove track
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="card-footer">
          <p className="my-0 pending">{this.props.matches.length} matches</p>
        </div>
      </div>
    )
  }
}
