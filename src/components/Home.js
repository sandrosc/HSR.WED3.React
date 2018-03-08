// @flow

import React from 'react';
import { Link } from 'react-router-dom';

export type Props = {
  isAuthenticated: boolean
};

const Home = ({ isAuthenticated }: Props) => (
  <div>
    {isAuthenticated ? (
      <div>
        <p>Willkommen zurück!</p>
        <Link to={'/dashboard'}>Zum Dashboard</Link>
      </div>
    ) : (
      <div>
        <p>Herzlich willkommen bei der Bank von Rapperswil!</p>
      </div>
    )}
  </div>
);

export default Home;
