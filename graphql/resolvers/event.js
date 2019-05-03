const { transformEvent } = require('../../helpers/transformers');

const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
  events: async () => {
    const events = await Event.find().populate('creator');

    return events.map(transformEvent);
  },
  createEvent: async ({
    eventInput: {
      title, description, price, date,
    },
  }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const newEvent = new Event({
      title,
      description,
      price: parseFloat(price, 10) || 0,
      date: new Date(date),
      creator: req.userId,
    });

    const event = await newEvent.save();

    const user = await User.findById(req.userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.createdEvents.push(newEvent);

    await user.save();

    return transformEvent(event);
  },
};
