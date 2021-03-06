// @flow

import React from 'react';
import { Redirect, Link } from 'react-router-dom';

import FormElement from './FormElement';

export type Props = {
  /* Callback to submit an authentication request to the server */
  authenticate: (
    login: string,
    password: string,
    callback: (error: ?Error) => void
  ) => void,
  /* We need to know what page the user tried to access so we can 
     redirect after logging in */
  location: {
    state?: {
      from: string
    }
  }
};

type State = {
  login: string,
  password: string,
  error?: Error,
  redirectToReferrer: boolean
};

class Login extends React.Component<Props, State> {
  state = {
    login: '',
    password: '',
    error: undefined,
    redirectToReferrer: false
  };

  handleInputChanged = (field: string) => (value: string | number) => {
    this.setState((state: State) => ({ ...state, [field]: value }));
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();
    const { login, password } = this.state;
    this.props.authenticate(login, password, error => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ redirectToReferrer: true, error: undefined });
      }
    });
  };

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: '/dashboard' }
    };
    const { redirectToReferrer, error, login, password } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    const minLength = 3;

    const mayLogin = [login, password].every(
      value => value.length >= minLength
    );

    return (
      <div>
        <h1>Login</h1>
        <form>
          <FormElement
            label="Username"
            value={login}
            onChange={this.handleInputChanged('login')}
            minLength={minLength}
          />
          <FormElement
            label="Passwort"
            value={password}
            onChange={this.handleInputChanged('password')}
            type="password"
            minLength={minLength}
          />
          <div>
            <button onClick={this.handleSubmit} disabled={!mayLogin}>
              Log-in
            </button>
          </div>
        </form>
        {error && <p>Es ist ein Fehler aufgetreten!</p>}
        <Link to="/signup">Noch keinen Account?</Link>
      </div>
    );
  }
}

export default Login;
