import React, { Component } from 'react';
import './EventsPage.css';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class EventsPage extends Component {
  state = {
    isCreateOpen: false,
  };

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

  handleCreateModalConfirm = () => {
    this.setState({
      isCreateOpen: false,
    });
  };

  render() {
    const { isCreateOpen } = this.state;

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
              Modal Content
            </Modal>
          </>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.handleCreateModalOpen}>Create Event</button>
        </div>
      </>
    );
  }
}

export default EventsPage;
