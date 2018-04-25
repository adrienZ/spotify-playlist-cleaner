import React, { Component } from 'react'

import Header from '@components/Header'
import Footer from '@components/Footer'

import { getUserToken } from '@js/api/api'

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
