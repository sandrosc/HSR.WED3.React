import React, { Component } from 'react';

class Dashboard extends Component {
  render() {
    const error = false;

    return (
      <div>
        <h1>Dashboard</h1>
        <form>
          <label>
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
          </label>
          <div>
            <button onClick={this.handleSubmit}>Log-in</button>
          </div>
        </form>
        {error && <p>Es ist ein Fehler aufgetreten!</p>}
      </div>
    );
  }
}

export default Dashboard;
