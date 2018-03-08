import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const MenuBar = withRouter(
  ({ history, location: { pathname }, isAuthenticated, user }) => {
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
            {/* Links inside the App are created using the react-router's Link
          component */}
            <Link to="/">Home</Link>
            <Link to="/dashboard">Kontoübersicht</Link>
            <Link to="/transactions">Zahlungen</Link>
            <a
              href="/logout"
              onClick={event => {
                event.preventDefault();
                this.signout(() => history.push('/'));
              }}
            >
              Logout {user.firstname} {user.lastname}
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
