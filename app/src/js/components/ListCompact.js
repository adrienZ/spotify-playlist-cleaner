import React from 'react'

export default props => (
  <table className="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Title</th>
        <th scope="col">Artist(s)</th>
        <th scope="col">Album</th>
      </tr>
    </thead>
    <tbody>
      {props.results.map((song, i) => (
        <tr key={i} onClick={() => props.onClickHandler(props.results[i])}>
          <th scope="row">#{i}</th>
          <td>{song.name}</td>
          <td>{song.artists.map(a => a.name).join(', ')}</td>
          <td>{song.album.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
