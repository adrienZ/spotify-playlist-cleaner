import React from 'react'

export default props => (
  <table className="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        {props.labels.map((l, i) => (
          <th key={i} scope="col">
            {l}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {props.results.map((result, i) => (
        <tr key={i} onClick={() => props.onClickHandler(props.results[i])}>
          {props.noIndex ? (
            <th scope="row">{props.rows()[0]}</th>
          ) : (
            <th scope="row">{`#${i + 1}`}</th>
          )}
          {props.rows(result).map((r, r_i) => <td key={r_i}>{r}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
)
