const { transformBooking, transformEvent } = require('../../helpers/transformers');

const Booking = require('../../models/booking');
const Event = require('../../models/event');

module.exports = {
  bookings: async () => {
    const result = await Booking.find();

    return result.map(transformBooking);
  },
  bookEvent: async ({ eventId }) => {
    const event = await Event.findById(eventId);

    const newBooking = new Booking({
      user: '5cc20522c93af827cd6094d2',
      event,
    });

    const booking = await newBooking.save();

    return transformBooking(booking);
  },
  cancelBooking: async ({ bookingId }) => {
    const booking = await Booking.findById(bookingId).populate('event');

    if (!booking) {
      throw new Error('Booking not found');
    }

    await Booking.deleteOne({ _id: bookingId });

    return transformEvent(booking.event);
  },
};
