const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

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

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
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
        });

        const result = await event.save();

        return result._doc;
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
