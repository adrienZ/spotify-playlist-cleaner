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
        <Route exact path="/login" component={Login} />
      </Switch>
    </Route>
  </Router>
)
