import React, { Component } from 'react';

import TransactionTable from './TransactionTable';

import { getTransactions } from '../api';
import type { Transaction } from '../api';

export type Props = {
  token: string,
  month: number,
  year: number
};

type State = {
  transactions: Array<Transaction>
};

export default class TransactionLoader extends Component<Props, State> {
  state = {
    transactions: []
  };

  componentDidMount() {
    this.updateTransactions();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.month !== nextProps.month ||
      this.props.year !== nextProps.year
    ) {
      this.updateTransactions(nextProps);
    }
  }

  updateTransactions = ({ month, year } = this.props) => {
    const startDate = new Date(year, month, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 1, 0, 0, 0, 0);
    // get transactions
    getTransactions(
      this.props.token,
      startDate.toISOString(),
      endDate.toISOString()
    ).then(value =>
      this.setState(state => ({
        ...state,
        transactions: value.result
      }))
    );
  };

  render() {
    const { transactions } = this.state;
    return <TransactionTable transactions={transactions} />;
  }
}
