import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/authContext';
import './MainNavigation.css';

const mainNavigation = () => (
  <AuthContext.Consumer>
    {({ token, logout }) => (
      <header className="main-navigation">
        <div className="main-navigation__logo">
          <h1>Easy Event</h1>
        </div>
        <nav className="main-navigation__items">
          <ul>
            {!token && (
              <li>
                <NavLink to="/auth">Authenticate</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            {token && (
              <>
                <li>
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    )}
  </AuthContext.Consumer>
);

export default mainNavigation;
