const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: async () => {
        const result = await Event.find();

        return result.map(res => res._doc);
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

        return result._doc;
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
    },
    graphiql: true,
  }),
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-bnbzo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.error('An error occurred while connecting to mongoDB', error);
  });
