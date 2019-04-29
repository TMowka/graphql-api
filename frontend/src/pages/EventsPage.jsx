import React, { Component } from 'react';
import AuthContext from '../context/authContext';
import './EventsPage.css';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

class EventsPage extends Component {
  titleEl = React.createRef();
  priceEl = React.createRef();
  dateEl = React.createRef();
  descriptionEl = React.createRef();

  state = {
    isCreateOpen: false,
    events: [],
    isLoading: false,
    openedEvent: null,
  };

  static contextType = AuthContext;

  async componentDidMount() {
    await this.fetchEvents();
  }

  async fetchEvents() {
    this.setState({
      isLoading: true,
    });

    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              price
              date
              creator {
                _id
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
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed');
      }

      const { data: { events } } = await response.json();

      this.setState({
        events,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        isLoading: false,
      });
    }
  }

  handleModalOpen = () => {
    this.setState({
      isCreateOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      isCreateOpen: false,
      openedEvent: null,
    });
  };

  handleCreateModalConfirm = async () => {
    const { events } = this.state;

    const title = this.titleEl.current.value;
    const price = parseFloat(this.priceEl.current.value, 10);
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    if (!title.trim().length || price <= 0 || !date.trim().length || !description.trim().length) {
      return;
    }

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: { title: "${title}", description: "${description}", price: ${price}, date: "${date}" }) {
              _id
              title
              description
              price
              date
              creator {
                _id
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

      const { data: { createEvent } } = await response.json();

      this.setState({
        isCreateOpen: false,
        events: [
          ...events,
          createEvent,
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  handleViewDetailsOpen = (eventId) => {
    const { events } = this.state;
    const openedEvent = events.find(e => e._id === eventId);

    this.setState({
      openedEvent,
    });
  };

  handleViewDetailsModalBook = () => {
  };

  render() {
    const {
      isCreateOpen, events, isLoading, openedEvent,
    } = this.state;

    return (
      <>
        {isCreateOpen && (
          <>
            <Backdrop />
            <Modal
              title="Add Event"
              isCancelable
              isConfirmable
              onCancel={this.handleModalClose}
              onConfirm={this.handleCreateModalConfirm}
            >
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.titleEl} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceEl} />
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input type="datetime-local" id="date" ref={this.dateEl} />
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" rows="4" ref={this.descriptionEl} />
                </div>
              </form>
            </Modal>
          </>
        )}
        {openedEvent && (
          <>
            <Backdrop />
            <Modal
              title={openedEvent.title}
              isCancelable
              isConfirmable
              onCancel={this.handleModalClose}
              onConfirm={this.handleViewDetailsModalBook}
              confirmText="Book"
            >
              <h1>{openedEvent.title}</h1>
              <h2>${openedEvent.price} - {new Date(openedEvent.date).toLocaleDateString()}</h2>
              <p>{openedEvent.description}</p>
            </Modal>
          </>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.handleModalOpen}>Create Event</button>
          </div>
        )}
        {isLoading
          ? <Spinner />
          : (
            <EventList
              events={events}
              authUserId={this.context.userId}
              onViewDetails={this.handleViewDetailsOpen}
            />
          )}
      </>
    );
  }
}

export default EventsPage;
