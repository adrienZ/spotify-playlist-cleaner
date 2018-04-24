import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { getUserToken } from '@js/api/api'

import App from '@components/App'
import Login from '@components/Login'
import Songmatch from '@components/Songmatch'
import SongmatchResults from '@components/SongmatchResults'

const authToken = getUserToken()

const PrivateRoute = ({ component: Component }, ...props) => (
  <Route
    {...props}
    render={props =>
      authToken ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
)

export default () => (
  <Router>
    <Route>
      <Switch location={location}>
        <PrivateRoute exact path="/" component={App} />
        <PrivateRoute exact path="/songmatch" component={Songmatch} />
        <PrivateRoute
          path="/songmatch/results/:id"
          component={SongmatchResults}
        />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Route>
  </Router>
)
