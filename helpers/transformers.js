const DataLoader = require('dataloader');
const { dateToString } = require('./date');

const User = require('../models/user');
const Event = require('../models/event');

const eventLoader = new DataLoader(async (eventIds) => {
  const events = await Event.find({ _id: { $in: eventIds } });

  return events.map(transformEvent); // eslint-disable-line no-use-before-define
});

const userLoader = new DataLoader(async (userIds) => {
  const users = await User.find({ _id: { $in: userIds } });

  return users.map(transformUser); // eslint-disable-line no-use-before-define
});

const transformEvent = ({ _doc, _doc: { date, creator } }) => ({
  ..._doc,
  date: dateToString(date),
  creator: () => userLoader.load(creator),
});

const transformBooking = ({
  _doc,
  _doc: {
    user, event, createdAt, updatedAt,
  },
}) => ({
  ..._doc,
  user: () => userLoader.load(user),
  event: () => eventLoader.load(event),
  createdAt: dateToString(createdAt),
  updatedAt: dateToString(updatedAt),
});

const transformUser = ({ _doc, _doc: { createdEvents } }) => ({
  ..._doc,
  password: null,
  createdEvents: () => eventLoader.loadMany(createdEvents),
});

module.exports.transformUser = transformUser;
module.exports.transformEvent = transformEvent;
module.exports.transformBooking = transformBooking;
