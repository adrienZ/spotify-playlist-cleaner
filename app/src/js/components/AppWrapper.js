// libs
import React, { Component } from 'react'

// api
import { getUserToken } from '@js/api/User'

// components
import Header from '@components/Header'
import Footer from '@components/Footer'

export default class AppWrapper extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="app__wrapper">
        {getUserToken() ? <Header /> : null}
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
