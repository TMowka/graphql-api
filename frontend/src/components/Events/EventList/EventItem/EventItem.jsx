import React from 'react';
import './EventItem.css';

const eventItem = ({
  id, title, price, date, isOwn, onViewDetails,
}) => (
    <li className="events__list-item">
      <div>
        <h1>{title}</h1>
        <h2>${price} - {new Date(date).toLocaleDateString()}</h2>
      </div>
      <div>
        {isOwn
          ? <p>Your the owner of this event.</p>
          : <button className="btn" onClick={onViewDetails.bind(null, id)}>View Details</button>}
      </div>
    </li>
  );

export default eventItem;
