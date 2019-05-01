import React from 'react';
import './BookingList.css';

const bookingList = ({ bookings, onCancel }) => {
  return (
    <ul className="bookings__list">
      {bookings.map(({ _id, createdAt, event: { title } }) => (
        <li key={_id} className="bookings__item">
          <div className="bookings__item-data">
            {title} - {new Date(createdAt).toLocaleDateString()}
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={onCancel.bind(null, _id)}>Cancel</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default bookingList;
