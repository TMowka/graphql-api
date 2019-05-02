import React, { Component } from 'react';
import AuthContext from '../context/authContext';
import './AuthPage.css';

class AuthPage extends Component {
  emailEl = React.createRef();
  passwordEl = React.createRef();

  state = {
    isLogin: true,
  };

  static contextType = AuthContext;

  handleSubmit = async (event) => {
    event.preventDefault();

    const { isLogin } = this.state;

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (!email.trim().length || !password.trim().length) {
      return;
    }

    let requestBody = {
      query: `
        query login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password,
      },
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation createUser($email: String!, $password: String!) {
            createUser(userInput: { email: $email, password: $password }) {
              _id
              email
            }
          }
        `,
        variables: {
          email,
          password,
        },
      };
    }

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed');
      }

      const { data: { login: { token, userId, tokenExpiration }} } = await response.json();

      if (token) {
        this.context.login(
          token,
          userId,
          tokenExpiration,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  switchHandleMode = () => {
    const { isLogin } = this.state;

    this.setState({
      isLogin: !isLogin,
    });
  };

  render() {
    const { isLogin } = this.state;

    return (
      <form className="auth-form" onSubmit={this.handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchHandleMode}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
