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

  handleInputChanged = (field: string, value: string | number) => {
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
    const { redirectToReferrer, error } = this.state;

    if (redirectToReferrer) {
      return <Redirect to="/login" />;
    }

    return (
      <div>
        <h1>Registrieren</h1>
        <form>
          <FormElement
            label="Username"
            field="login"
            value={this.state.login}
            onChange={this.handleInputChanged}
          />
          <FormElement
            label="Vorname"
            field="firstname"
            value={this.state.firstname}
            onChange={this.handleInputChanged}
          />
          <FormElement
            label="Nachname"
            field="lastname"
            value={this.state.lastname}
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
            <button onClick={this.handleSubmit}>Account eröffnen</button>
          </div>
        </form>
        {error && <p>Es ist ein Fehler aufgetreten!</p>}
      </div>
    );
  }
}

export default Signup;
