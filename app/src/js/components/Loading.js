import React from 'react'

export default props => (
  <div
    className={`app__placeholder ${props.className}`}
    style={{ height: props.height, width: props.width }}>
    {props.hasOwnProperty('text') ? props.text : 'Loading...'}
  </div>
)
