const { dateToString } = require('./date');

const User = require('../models/user');
const Event = require('../models/event');

const getEvents = async (eventIds) => {
  const events = await Event.find({ _id: { $id: eventIds } });

  return events.map(transformEvent); // eslint-disable-line no-use-before-define
};

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);

  return transformEvent(event); // eslint-disable-line no-use-before-define
};

const getUser = async (userId) => {
  const user = await User.findById(userId);

  return transformUser(user); // eslint-disable-line no-use-before-define
};

const transformEvent = ({ _doc, _doc: { date, creator } }) => ({
  ..._doc,
  date: dateToString(date),
  creator: getUser.bind(this, creator),
});

const transformBooking = ({
  _doc,
  _doc: {
    user, event, createdAt, updatedAt,
  },
}) => ({
  ..._doc,
  user: getUser.bind(this, user),
  event: getEvent.bind(this, event),
  createdAt: dateToString(createdAt),
  updatedAt: dateToString(updatedAt),
});

const transformUser = ({ _doc, _doc: { createdEvents } }) => ({
  ..._doc,
  password: null,
  createdEvents: getEvents.bind(this, createdEvents),
});

module.exports.transformUser = transformUser;
module.exports.transformEvent = transformEvent;
module.exports.transformBooking = transformBooking;
