const { transformBooking, transformEvent } = require('../../helpers/transformers');

const Booking = require('../../models/booking');
const Event = require('../../models/event');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const result = await Booking.find({ user: req.userId });

    return result.map(transformBooking);
  },
  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const event = await Event.findById(eventId);

    const newBooking = new Booking({
      user: req.userId,
      event,
    });

    const booking = await newBooking.save();

    return transformBooking(booking);
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }

    const booking = await Booking.findById(bookingId).populate('event');

    if (!booking) {
      throw new Error('Booking not found');
    }

    await Booking.deleteOne({ _id: bookingId });

    return transformEvent(booking.event);
  },
};
