// @flow

import React, { Component } from 'react';
import { de } from 'date-fns/esm/locale';

import TransactionLoader from './TransactionLoader';

export type Props = {
  token: string
};

type State = {
  month: number,
  year: number
};

export default class AllTransactions extends Component<Props, State> {
  state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };

  updateMonth = (e: SyntheticInputEvent<HTMLSelectElement>) => {
    const value = +e.target.value;
    this.setState(state => ({
      ...state,
      month: value
    }));
  };

  updateYear = (e: SyntheticInputEvent<HTMLSelectElement>) => {
    const value = +e.target.value;
    this.setState(state => ({
      ...state,
      year: value
    }));
  };

  render() {
    const { token } = this.props;
    const { month, year } = this.state;
    const months: string[] = de.localize.months();
    const years = [2016, 2017, 2018];
    return (
      <div>
        <h1>Alle Transaktionen</h1>
        <h2>Filter</h2>
        <form className="filter">
          <label>
            Monat
            <div>
              <select value={month} onChange={this.updateMonth}>
                {months.map((monthLoc, monthIndex) => (
                  <option key={monthIndex} value={monthIndex}>
                    {monthLoc}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label>
            Jahr
            <div>
              <select value={year} onChange={this.updateYear}>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </form>
        <TransactionLoader token={token} year={year} month={month} />
      </div>
    );
  }
}
