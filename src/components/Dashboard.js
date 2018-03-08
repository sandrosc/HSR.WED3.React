import React, { Component } from 'react';

import { getTransactions } from '../api';

export type Props = {
  token: String
};

class Dashboard extends Component<Props, {}> {
  componentDidMount() {
    const { token } = this.props;
    getTransactions(token).then(
      value => console.log(value),
      error => console.log(error)
    );
  }

  render() {
    const newTransactionError = false;

    return (
      <div>
        <h1>Dashboard</h1>
        <div className="dashboardContents">
          <form className="newTransaction">
            {/* <label>
            Username
            <input
              onChange={this.handleLoginChanged}
              placeholder="Login"
              value={this.state.login}
            />
          </label>
          <label>
            Passwort
            <input
              onChange={this.handlePasswordChanged}
              placeholder="Password"
              type="password"
              value={this.state.password}
            /> 
          </label>*/}
            <div>
              <button onClick={this.handleSubmit}>Log-in</button>
            </div>
            {newTransactionError && <p>Es ist ein Fehler aufgetreten!</p>}
          </form>
        </div>
        <div />
      </div>
    );
  }
}

export default Dashboard;
