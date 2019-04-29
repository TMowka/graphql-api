import React from 'react';
import './EventList.css';

import EventItem from './EventItem/EventItem';

const eventList = ({ events, authUserId, onViewDetails, }) => (
  <ul className="events__list">
    {events.map(({
      _id, title, price, date, creator,
    }) => (
        <EventItem
          key={_id}
          id={_id}
          title={title}
          price={price}
          date={date}
          isOwn={authUserId === creator._id}
          onViewDetails={onViewDetails}
        />
      ))}
  </ul>
);

export default eventList;
