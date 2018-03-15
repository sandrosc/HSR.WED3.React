import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const MenuBar = withRouter(
  ({ history, location: { pathname }, isAuthenticated, user, signout }) => {
    if (isAuthenticated && user) {
      return (
        <header>
          <span className="title">
            <Link to="/">Bank of Rapperswil</Link>
          </span>
          <span className="userInfo">
            {user.firstname} {user.lastname} &ndash; {user.accountNr}
          </span>
          <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Alle Transaktionen</Link>
            <a
              href="/logout"
              onClick={event => {
                event.preventDefault();
                signout(() => history.push('/'));
              }}
            >
              Logout
            </a>
          </nav>
        </header>
      );
    } else {
      return (
        <header>
          <span className="title">
            <Link to="/">Bank of Rapperswil</Link>
          </span>
          <nav>
            <Link to={'/login'}>Einloggen</Link>
            <Link to={'/signup'}>Registrieren</Link>
          </nav>
        </header>
      );
    }
  }
);

export default MenuBar;
