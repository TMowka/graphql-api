import React, { Component } from 'react';

import AuthContext from '../context/authContext';
import Spinner from '../components/Spinner/Spinner';

class BookingPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = AuthContext;

  async componentDidMount() {
    await this.fetchBookings();
  }

  fetchBookings = async () => {
    this.setState({
      isLoading: true,
    });

    const requestBody = {
      query: `
          query {
            bookings {
              _id
              createdAt
              updatedAt
              event {
                _id
                title
                date
              }
            }
          }
        `,
    };

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.context.token}`,
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed');
      }

      const { data: { bookings } } = await response.json();

      this.setState({
        bookings,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);

      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    const { bookings, isLoading } = this.state;

    return (
      <>
        {isLoading
          ? <Spinner />
          : (
            <ul>
              {bookings.map(({ _id, createdAt, event: { title } }) => (
                <li key={_id}>{title} - {new Date(createdAt).toLocaleDateString()}</li>
              ))}
            </ul>
          )}
      </>
    );
  }
}

export default BookingPage;
