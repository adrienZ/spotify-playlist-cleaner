import React from 'react'

export default props => (
  <table className="table table-hover">
    <thead>
      <tr>
        <th scope="col">Type</th>
        <th scope="col">Column heading</th>
        <th scope="col">Column heading</th>
        <th scope="col">Column heading</th>
      </tr>
    </thead>
    <tbody>
      {props.results.map((song, i) => (
        <tr key={i} onClick={() => props.onClickHandler(props.results[i])}>
          <th scope="row">#{i}</th>
          <td>{song.name}</td>
          <td>{song.artists[0].name}</td>
          <td>{song.album.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
