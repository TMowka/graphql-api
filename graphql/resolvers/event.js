const { transformEvent } = require('../../helpers/transformers');

const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
  events: async () => {
    const events = await Event.find().populate('creator');

    return events.map(transformEvent);
  },
  createEvent: async ({ eventInput: { title, description, price, date } }) => {
    const newEvent = new Event({
      title,
      description,
      price: parseFloat(price, 10),
      date: new Date(date),
      creator: '5cc20522c93af827cd6094d2',
    });

    const event = await newEvent.save();

    const user = await User.findById('5cc20522c93af827cd6094d2');

    if (!user) {
      throw new Error('User not found');
    }

    user.createdEvents.push(newEvent);

    await user.save();

    return transformEvent(event);
  },
};
