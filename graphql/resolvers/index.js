const userResolver = require('./user');
const eventResolver = require('./event');
const bookingResolver = require('./booking');

module.exports = {
  ...userResolver,
  ...eventResolver,
  ...bookingResolver,
};
