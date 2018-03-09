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

  handleInputChanged = (field: string, value: string | number) => {
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
    const { redirectToReferrer, error } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <h1>Login</h1>
        <form>
          <FormElement
            label="Username"
            field="login"
            value={this.state.login}
            onChange={this.handleInputChanged}
          />
          <FormElement
            label="Passwort"
            field="password"
            value={this.state.password}
            onChange={this.handleInputChanged}
            type="password"
          />
          <div>
            <button onClick={this.handleSubmit}>Log-in</button>
          </div>
        </form>
        {error && <p>Es ist ein Fehler aufgetreten!</p>}
        <Link to="/signup">Noch keinen Account?</Link>
      </div>
    );
  }
}

export default Login;
