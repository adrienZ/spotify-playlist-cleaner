// libs
import React, { Component } from 'react'

// api
import { deleteTrackFromPlaylist, addTrackToPlaylist } from '@js/api/Track'

export default class HeroPlaylist extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasDeleted: props.playlist.fromCache,
    }
  }

  addSongToPlaylist() {
    addTrackToPlaylist(this.props.playlist.id, this.props.track.uri).then(
      () => {
        this.setState({
          hasDeleted: false,
        })
      }
    )
  }

  removeSongFromPlaylist() {
    deleteTrackFromPlaylist(this.props.playlist.id, this.props.track.uri).then(
      () => {
        this.setState({
          hasDeleted: true,
        })
      }
    )
  }

  render() {
    const p = this.props.playlist

    return (
      <div className="card text-white bg-dark">
        {/* <div className="card-header">match #{this.props.index + 1}</div> */}

        <iframe
          src={`https://open.spotify.com/embed/user/${p.owner.id}/playlist/${
            p.id
          }`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
        />
        <div className="card-body">
          <div className="card-text">
            <h5 className="card-title mb-0">{p.name}</h5>
            <p>
              from <i>{p.owner.id}</i>
            </p>
            {this.state.hasDeleted ? (
              <div>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={this.addSongToPlaylist.bind(this)}>
                  Undo
                </button>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={this.props.hideOneResult}>
                  Hide result
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-danger"
                onClick={this.removeSongFromPlaylist.bind(this)}>
                Remove track
              </button>
            )}
          </div>
        </div>
        <div className="card-footer">
          <p className="my-0 pending">{p.tracks.total} tracks</p>
        </div>
      </div>
    )
  }
}
