import React, { Component } from 'react';

import { getTransactions, getAccount } from '../api';

import FormElement from './FormElement';

export type Props = {
  token: string
};

class Dashboard extends Component<Props, {}> {
  state = {
    from: '',
    to: '',
    toAccount: {
      searched: false,
      found: false,
      accountNr: '',
      owner: ''
    },
    amount: 0,
    transactionError: undefined
  };

  componentDidMount() {
    const { token } = this.props;
    getTransactions(token).then(
      value => console.log(value),
      error => console.log(error)
    );
  }

  handleInputChanged = (field, value) => {
    this.setState(state => ({ ...state, [field]: value }));
    if (field === 'to') {
      this.handleToUpdated(value);
    }
  };

  handleToUpdated = value => {
    if (!value) {
      this.setState(state => ({
        ...state,
        toAccount: { ...state.toAccount, searched: false }
      }));
      return;
    }
    getAccount(value, this.props.token).then(
      value => {
        this.setState(state => ({
          ...state,
          toAccount: {
            searched: true,
            found: true,
            accountNr: value.accountNr,
            owner: `${value.owner.firstname} ${value.owner.lastname}`
          }
        }));
      },
      error => {
        this.setState(state => ({
          ...state,
          toAccount: {
            ...state.toAccount,
            searched: true,
            found: false
          }
        }));
      }
    );
  };

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <div className="dashboardContents">
          <form className="newTransaction">
            <FormElement
              label="Von"
              field="from"
              value={this.state.from}
              onChange={this.handleInputChanged}
            />
            <FormElement
              label="Zu"
              field="to"
              value={this.state.to}
              onChange={this.handleInputChanged}
            />
            {this.state.toAccount.searched && (
              <div className="formInfo">
                {this.state.toAccount.found
                  ? this.state.toAccount.owner
                  : 'Accountnr. nicht gefunden'}
              </div>
            )}
            <FormElement
              label="Menge"
              field="amount"
              value={this.state.amount}
              onChange={this.handleInputChanged}
              type="number"
            />
            <div>
              <button onClick={this.handleSubmit}>Überweisen</button>
            </div>
            {this.state.transactionError && (
              <p>Es ist ein Fehler aufgetreten!</p>
            )}
          </form>
        </div>
        <div />
      </div>
    );
  }
}

export default Dashboard;
