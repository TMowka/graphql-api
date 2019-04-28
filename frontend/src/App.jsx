import React, { Component } from 'react';
import {
  BrowserRouter, Route, Redirect, Switch,
} from 'react-router-dom';
import AuthContext from './context/authContext';
import './App.css';

import MainNavigation from './components/Navigation/MainNavigation';
import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import BookingsPage from './pages/BookingsPage';

class App extends Component {
  state = {
    token: '',
    userId: '',
    tokenExpiration: -1,
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token,
      userId,
      tokenExpiration,
    });
  };

  logout = () => {
    this.setState({
      token: '',
      userId: '',
      tokenExpiration: -1,
    });
  };

  render() {
    const { token, userId, tokenExpiration } = this.state;

    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token,
            userId,
            tokenExpiration,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {!token && <Redirect from="/" to="/auth" exact />}
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/auth" to="/events" exact />}
              {!token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {token && <Route path="/bookings" component={BookingsPage} />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
