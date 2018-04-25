import React, { Component } from 'react'

export default class HeroSong extends Component {
  constructor() {
    super()
    this.state = { audioPreview: false }
  }

  componentDidMount() {
    this.audioPreview.volume = 0.3
  }

  togglePreview() {
    this.audioPreview.paused
      ? this.audioPreview.play()
      : this.audioPreview.pause()

    this.setState({
      audioPreview: !this.audioPreview.paused || false,
    })
  }

  render() {
    const song = this.props.song

    return (
      <div className={`card p-0 sticky-top ${this.props.bootstrapClasses}`}>
        <div className="card-header">Song to check</div>
        <iframe
          src={`https://open.spotify.com/embed/track/${song.id}`}
          width="100%"
          height="290"
          frameBorder="0"
          allow="encrypted-media"
        />
        <audio
          ref={audio => (this.audioPreview = audio)}
          src={song.preview_url}
        />

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <b>Album:</b> {song.album.name}
          </li>
          <li className="list-group-item">
            <b>Année:</b> {new Date(song.album.release_date).getFullYear()}
          </li>
          <li className="list-group-item">
            <b>Popularité:</b>
            <div className="progress my-1">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${song.popularity}%` }}
                aria-valuenow={song.popularity}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </li>
        </ul>

        <div className="card-body">
          {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
          <button
            type="button"
            onClick={this.togglePreview.bind(this)}
            className="btn btn-outline-success">
            {!this.state.audioPreview ? 'Listen' : 'Pause'} preview
          </button>
        </div>
      </div>
    )
  }
}
