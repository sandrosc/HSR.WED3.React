import React, { Component } from 'react';

import {
  getTransactions,
  getAccount,
  getAccountDetails,
  transfer
} from '../api';
import type { Transaction } from '../api';

import FormElement from './FormElement';
import TransactionTable from './TransactionTable';

const transactionStates = {
  ready: 'ready',
  running: 'running',
  successful: 'successful'
};

type TransactionState = $Keys<typeof transactionStates>;

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
  transactionState: TransactionState,
  transactionError: undefined,
  transactions: Array<Transaction>
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
    transactionState: transactionStates.ready,
    transactionError: undefined,
    transactions: []
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

    this.updateTransactions();
  }

  updateTransactions = () => {
    getTransactions(this.props.token, undefined, undefined, 10).then(value =>
      this.setState(state => ({
        ...state,
        transactions: value.result
      }))
    );
  };

  handleInputChanged = (field: string) => (value: string | number) => {
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

  resetForm = () => {
    this.handleInputChanged('to')('');
    this.handleInputChanged('amount')(0);
    this.resetTransactionState();
  };

  resetTransactionState = () => {
    this.setState(state => ({
      ...state,
      transactionState: transactionStates.ready
    }));
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();
    const { toAccount: { accountNr: targetAccountNr }, amount } = this.state;
    const { token } = this.props;

    this.setState(state => ({
      ...state,
      transactionState: transactionStates.running
    }));

    setTimeout(() => {
      transfer(targetAccountNr, amount, token).then(
        value => {
          this.updateTransactions();
          this.setState(state => ({
            ...state,
            fromAccount: {
              ...state.fromAccount,
              amount: value.total
            },
            transactionState: transactionStates.successful,
            transactionError: undefined
          }));
        },
        error => {
          this.setState(state => ({
            ...state,
            transactionState: transactionStates.ready,
            transactionError: error
          }));
        }
      );
    }, 1000);
  };

  render() {
    const {
      fromAccount,
      to,
      toAccount: { found: toAccountFound, owner: toAccountOwner },
      amount,
      transactionState,
      transactions
    } = this.state;
    const { history } = this.props;
    const maySubmit =
      transactionState === transactionStates.ready && toAccountFound;
    return (
      <div>
        <h1>Dashboard</h1>
        <div className="dashboard">
          <div>
            <h2>Neue Transaktion</h2>
            <form className={`newTransaction ${transactionState}`}>
              <div className="message">
                {transactionState === transactionStates.successful && (
                  <div>
                    <p>Überweisung zu {to} erfolgreich abgeschlossen.</p>
                    <p>Neuer Kontostand: {fromAccount.amount} CHF</p>
                    <button onClick={this.resetForm}>Neue Transaktion</button>
                  </div>
                )}
              </div>
              <FormElement
                label="Von"
                field="from"
                value={`${fromAccount.accountNr} [${fromAccount.amount} CHF]`}
                disabled
              />
              <FormElement
                label="Zu"
                value={to}
                onChange={this.handleInputChanged('to')}
                message={
                  to
                    ? toAccountFound
                      ? toAccountOwner === fromAccount.owner
                        ? 'Accountnr. eingeben'
                        : toAccountOwner
                      : 'Accountnr. nicht gefunden'
                    : 'Accountnr. eingeben'
                }
              />
              <FormElement
                label="Menge"
                value={`${amount}`}
                onChange={this.handleInputChanged('amount')}
                type="number"
                min="0.05"
                message={!amount && 'Menge angeben'}
              />
              <div>
                <button onClick={this.handleSubmit} disabled={!maySubmit}>
                  {transactionState === transactionStates.running
                    ? 'Überweisung läuft...'
                    : 'Überweisen'}
                </button>
              </div>
              {this.state.transactionError && (
                <p>Es ist ein Fehler aufgetreten!</p>
              )}
            </form>
          </div>
          <div>
            <h2>Letzte Transaktionen</h2>
            <TransactionTable transactions={transactions} />
            <button
              style={{ marginTop: '1rem' }}
              onClick={() => history.push('/transactions')}
            >
              Transaktionen
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
