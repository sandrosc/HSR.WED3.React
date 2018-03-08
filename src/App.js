// @flow

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

import PrivateRoute from './components/PrivateRoute';

import * as api from './api';

import type { User } from './api';

// TODO: Move to own files
const AllTransactions = () => <div />;
const Dashboard = () => <div />;

type State = {
  isAuthenticated: boolean,
  token: ?string,
  user: ?User
};

class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    if (token && user) {
      this.state = {
        isAuthenticated: true,
        token,
        user: JSON.parse(user)
      };
    } else {
      this.state = {
        isAuthenticated: false,
        token: undefined,
        user: undefined
      };
    }
  }

  authenticate = (
    login: string,
    password: string,
    cb: (error: ?Error) => void
  ) => {
    api
      .login(login, password)
      .then(({ token, owner }) => {
        this.setState({ isAuthenticated: true, token, user: owner });
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(owner));
        cb(null);
      })
      .catch(error => cb(error));
  };

  signout = (callback: () => void) => {
    this.setState({
      isAuthenticated: false,
      token: undefined,
      user: undefined
    });
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    callback();
  };

  render() {
    const { isAuthenticated, user, token } = this.state;

    const MenuBar = withRouter(({ history, location: { pathname } }) => {
      if (isAuthenticated && user) {
        return (
          <nav>
            <span>
              {user.firstname} {user.lastname} &ndash; {user.accountNr}
            </span>
            {/* Links inside the App are created using the react-router's Link component */}
            <Link to="/">Home</Link>
            <Link to="/dashboard">Kontoübersicht</Link>
            <Link to="/transactions">Zahlungen</Link>
            <a
              href="/logout"
              onClick={event => {
                event.preventDefault();
                this.signout(() => history.push('/'));
              }}
            >
              Logout {user.firstname} {user.lastname}
            </a>
          </nav>
        );
      } else {
        return null;
      }
    });

    return (
      <Router>
        <div>
          <MenuBar />
          <Route
            exact
            path="/"
            render={props => (
              <Home {...props} isAuthenticated={isAuthenticated} />
            )}
          />
          <Route
            path="/login"
            render={props => (
              <Login {...props} authenticate={this.authenticate} />
            )}
          />
          <Route path="/signup" component={Signup} />
          {/* 
            The following are protected routes that are only available for logged-in users. We also pass the user and token so 
            these components can do API calls. PrivateRoute is not part of react-router but our own implementation.
          */}
          <PrivateRoute
            path="/dashboard"
            isAuthenticated={isAuthenticated}
            token={token}
            component={Dashboard}
          />
          <PrivateRoute
            path="/transactions"
            isAuthenticated={isAuthenticated}
            token={token}
            user={user}
            component={AllTransactions}
          />
        </div>
      </Router>
    );
  }
}

export default App;
