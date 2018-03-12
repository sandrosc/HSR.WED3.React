// @flow

import React from 'react';
import { formatRelative } from 'date-fns';
import de from 'date-fns/locale/de';

import type { Transaction } from '../api';

export type Props = {
  transactions: Array<Transaction>
};

function TransactionTable(props: Props) {
  const { transactions } = props;
  return (
    <table>
      <thead>
        <tr>
          <th>Von</th>
          <th>Zu</th>
          <th>Menge [CHF]</th>
          <th>Total [CHF]</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr key={transaction.date}>
            <td>{transaction.from}</td>
            <td>{transaction.target}</td>
            <td>{transaction.amount}</td>
            <td>{transaction.total}</td>
            <td>
              {formatRelative(new Date(transaction.date), new Date(), {
                locale: de
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;
