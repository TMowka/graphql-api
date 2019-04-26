const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const parseEvents = async (eventIds) => {
  const result = await Event.find({
    _id: {
      $id: eventIds,
    },
  });

  return result.map(res => ({
    ...res._doc,
    date: new Date(res._doc.date).toISOString(),
    creator: parseUser.bind(this, res._doc.creator),
  }));
};

const parseEvent = async (eventId) => {
  const result = await Event.findById(eventId);

  return {
    ...result._doc,
    creator: parseUser.bind(this, result._doc.creator),
  };
};

const parseUser = async (userId) => {
  const result = await User.findById(userId);

  return {
    ...result._doc,
    createdEvents: parseEvents.bind(this, result._doc.createdEvents),
  };
};

const parseBooking = async () => {

};

module.exports = {
  events: async () => {
    const result = await Event.find().populate('creator');

    return result.map(res => ({
      ...res._doc,
      date: new Date(res._doc.date).toISOString(),
      creator: parseUser.bind(this, res._doc.creator),
    }));
  },
  bookings: async () => {
    const result = await Booking.find();
    console.log(result);

    return result.map(res => ({
      ...res._doc,
      user: parseUser.bind(this, res._doc.user),
      event: parseEvent.bind(this, res._doc.event),
      createdAt: new Date(res._doc.createdAt).toISOString(),
      updatedAt: new Date(res._doc.updatedAt).toISOString(),
    }));
  },
  createEvent: async ({ eventInput: { title, description, price, date } }) => {
    const event = new Event({
      title,
      description,
      price: parseFloat(price, 10),
      date: new Date(date),
      creator: '5cc20522c93af827cd6094d2',
    });

    const result = await event.save();

    const user = await User.findById('5cc20522c93af827cd6094d2');

    if (!user) {
      throw new Error('User not found');
    }

    user.createdEvents.push(event);

    await user.save();

    return {
      ...result._doc,
      date: new Date(result._doc.date).toISOString(),
      creator: parseUser.bind(this, result._doc.creator),
    };
  },
  createUser: async ({ userInput: { email, password } }) => {
    let user = await User.findOne({ email });

    if (user) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = new User({
      email,
      password: hashedPassword,
    });

    const result = await user.save();

    return {
      ...result._doc,
      password: null,
    };
  },
  bookEvent: async ({ eventId }) => {
    const event = await Event.findById(eventId);

    const booking = new Booking({
      user: '5cc20522c93af827cd6094d2',
      event,
    });

    const result = await booking.save();

    return {
      ...result._doc,
      user: parseUser.bind(this, result._doc.user),
      event: parseEvent.bind(this, result._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async ({ bookingId }) => {
    const booking = await Booking.findById(bookingId).populate('event');

    if (!booking) {
      throw new Error('Booking not found');
    }

    await Booking.deleteOne({ _id: bookingId });

    return {
      ...booking.event._doc,
      creator: parseUser.bind(this, booking.event._doc.creator),
    };
  },
};
