const authResolver = require('./auth');
const eventResolver = require('./event');
const bookingResolver = require('./booking');

module.exports = {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver,
};
