// libs
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

// api
import { getUserToken } from '@js/api/User'

// components
import Home from '@components/pages/Home'
import Login from '@components/pages/Login'
import TrackMatch from '@components/pages/TrackMatch'
import ArtistMatch from '@components/pages/ArtistMatch'
import TrackMatchResults from '@components/pages/TrackMatchResults'
import ArtistMatchResults from '@components/pages/ArtistMatchResults'
import AppWrapper from '@components/partials/AppWrapper'

// local vars
const authToken = getUserToken()

const PrivateRoute = ({ component: Component }, ...props) => (
  <Route
    {...props}
    render={props => {
      return authToken ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }}
  />
)

export default () => (
  <Router>
    <Route>
      <AppWrapper>
        <Switch location={location}>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/track-match" component={TrackMatch} />
          <PrivateRoute exact path="/artist-match" component={ArtistMatch} />
          <PrivateRoute
            path="/track-match/results/:id"
            component={TrackMatchResults}
          />
          <PrivateRoute
            path="/artist-match/results/:id"
            component={ArtistMatchResults}
          />
          <Route exact path="/login" component={Login} />
        </Switch>
      </AppWrapper>
    </Route>
  </Router>
)
