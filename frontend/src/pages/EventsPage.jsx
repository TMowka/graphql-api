import React, { Component } from 'react';
import AuthContext from '../context/authContext';
import './EventsPage.css';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class EventsPage extends Component {
  titleEl = React.createRef();
  priceEl = React.createRef();
  dateEl = React.createRef();
  descriptionEl = React.createRef();

  state = {
    isCreateOpen: false,
    events: [],
  };

  static contextType = AuthContext;

  async componentDidMount() {
    await this.fetchEvents();
  }

  async fetchEvents() {
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
                email
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
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleCreateModalOpen = () => {
    this.setState({
      isCreateOpen: true,
    });
  };

  handleCreateModalClose = () => {
    this.setState({
      isCreateOpen: false,
    });
  };

  handleCreateModalConfirm = async () => {
    this.setState({
      isCreateOpen: false,
    });

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

      await this.fetchEvents();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { isCreateOpen, events } = this.state;

    return (
      <>
        {isCreateOpen && (
          <>
            <Backdrop />
            <Modal
              title="Add Event"
              isCancelable
              isConfirmable
              onCancel={this.handleCreateModalClose}
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
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.handleCreateModalOpen}>Create Event</button>
          </div>
        )}
        <ul className="events__list">
          {events.map(({ _id, title }) => (
            <li key={_id} className="events__list-item">{title}</li>
          ))}
        </ul>
      </>
    );
  }
}

export default EventsPage;
