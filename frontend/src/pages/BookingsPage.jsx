import React, { Component } from 'react';

import AuthContext from '../context/authContext';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';

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

  handleCancelBooking = async (bookingId) => {
    const { bookings } = this.state;

    const requestBody = {
      query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
              _id
              title
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

      this.setState({
        bookings: bookings.filter(b => b._id !== bookingId),
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { bookings, isLoading } = this.state;

    return (
      <>
        {isLoading
          ? <Spinner />
          : <BookingList bookings={bookings} onCancel={this.handleCancelBooking} />}
      </>
    );
  }
}

export default BookingPage;
