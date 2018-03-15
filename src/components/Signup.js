// @flow

import React from 'react';
import { Redirect } from 'react-router-dom';

import { signup } from '../api';

import FormElement from './FormElement';

type State = {
  login: string,
  firstname: string,
  lastname: string,
  password: string,
  error?: Error,
  redirectToReferrer: boolean
};

class Signup extends React.Component<{}, State> {
  state = {
    login: '',
    firstname: '',
    lastname: '',
    password: '',
    error: undefined,
    redirectToReferrer: false
  };

  handleInputChanged = (field: string) => (value: string | number) => {
    this.setState(state => ({ ...state, [field]: value }));
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();
    const { login, firstname, lastname, password } = this.state;
    signup(login, firstname, lastname, password)
      .then(result => {
        console.log('Signup result ', result);
        this.setState({ redirectToReferrer: true, error: undefined });
      })
      .catch((error: Error) => this.setState({ error }));
  };

  render() {
    const {
      redirectToReferrer,
      error,
      login,
      firstname,
      lastname,
      password
    } = this.state;

    if (redirectToReferrer) {
      return <Redirect to="/login" />;
    }
    const maySignup = [login, firstname, lastname, password].every(
      value => value.length >= 3
    );
    return (
      <div>
        <h1>Registrieren</h1>
        <form>
          <FormElement
            label="Username"
            value={login}
            onChange={this.handleInputChanged('login')}
            minLength={3}
          />
          <FormElement
            label="Vorname"
            value={firstname}
            onChange={this.handleInputChanged('firstname')}
            minLength={3}
          />
          <FormElement
            label="Nachname"
            value={lastname}
            onChange={this.handleInputChanged('lastname')}
            minLength={3}
          />
          <FormElement
            label="Passwort"
            value={password}
            onChange={this.handleInputChanged('password')}
            type="password"
            minLength={3}
          />
          <div>
            <button onClick={this.handleSubmit} disabled={!maySignup}>
              Account eröffnen
            </button>
          </div>
        </form>
        {error && <p>Es ist ein Fehler aufgetreten!</p>}
      </div>
    );
  }
}

export default Signup;
