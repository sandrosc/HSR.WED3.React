import React, { Component } from 'react';

import {
  getTransactions,
  getAccount,
  getAccountDetails,
  transfer
} from '../api';

import FormElement from './FormElement';

export type Props = {
  token: string
};

type State = {
  fromAccount: {
    accountNr: string,
    amount: number,
    owner: string
  },
  to: string,
  toAccount: {
    found: false,
    accountNr: string,
    owner: string
  },
  amount: number,
  transactionRunning: boolean,
  transactionError: undefined
};

class Dashboard extends Component<Props, State> {
  state = {
    fromAccount: {
      accountNr: '',
      amount: 0,
      owner: ''
    },
    to: '',
    toAccount: {
      found: false,
      accountNr: '',
      owner: ''
    },
    amount: 0,
    transactionRunning: false,
    transactionError: undefined
  };

  componentDidMount() {
    const { token } = this.props;

    // get from account
    getAccountDetails(token).then(
      value =>
        this.setState(state => ({
          ...state,
          fromAccount: {
            accountNr: value.accountNr,
            amount: value.amount,
            owner: `${value.owner.firstname} ${value.owner.lastname}`
          }
        })),
      error => console.log(error)
    );

    // get transactions
    getTransactions(token).then(
      value => console.log(value),
      error => console.log(error)
    );
  }

  handleInputChanged = (field: string, value: string | number) => {
    this.setState(state => ({ ...state, [field]: value }));
    if (field === 'to') {
      this.handleToUpdated(value);
    }
  };

  handleToUpdated = value => {
    if (!value) return;
    getAccount(value, this.props.token).then(
      value => {
        this.setState(state => ({
          ...state,
          toAccount: {
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
            found: false
          }
        }));
      }
    );
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();
    const { toAccount: { accountNr: targetAccountNr }, amount } = this.state;
    const { token } = this.props;

    this.setState(state => ({ ...state, transactionRunning: true }));

    setTimeout(() => {
      transfer(targetAccountNr, amount, token).then(
        value => {
          this.handleInputChanged('to', '');
          this.handleInputChanged('amount', 0);
          this.setState(state => ({
            ...state,
            fromAccount: {
              ...state.fromAccount,
              amount: value.total
            },
            transactionRunning: false
          }));
        },
        error =>
          this.setState(state => ({
            ...state,
            transactionError: error
          }))
      );
    }, 1000);
  };

  render() {
    const {
      fromAccount,
      to,
      toAccount: { found: toAccountFound, owner: toAccountOwner },
      amount,
      transactionRunning
    } = this.state;
    const maySubmit = !transactionRunning && toAccountFound;
    return (
      <div>
        <h1>Dashboard</h1>
        <div className="dashboard">
          <div>
            <h2>Neue Transaktion</h2>
            <form className="newTransaction">
              <FormElement
                label="Von"
                field="from"
                value={`${fromAccount.accountNr} [${fromAccount.amount} CHF]`}
                disabled
              />
              <FormElement
                label="Zu"
                field="to"
                value={to}
                onChange={this.handleInputChanged}
                message={
                  to
                    ? toAccountFound
                      ? toAccountOwner
                      : 'Accountnr. nicht gefunden'
                    : 'Accountnr. eingeben'
                }
              />
              <FormElement
                label="Menge"
                field="amount"
                value={this.state.amount}
                onChange={this.handleInputChanged}
                type="number"
                message={!amount && 'Menge angeben'}
              />
              <div>
                <button onClick={this.handleSubmit} disabled={!maySubmit}>
                  {transactionRunning ? 'Überweisung läuft...' : 'Überweisen'}
                </button>
              </div>
              {this.state.transactionError && (
                <p>Es ist ein Fehler aufgetreten!</p>
              )}
            </form>
          </div>
          <div>
            <h2>Transaktionen</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
