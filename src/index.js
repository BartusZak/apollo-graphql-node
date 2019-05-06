import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';
import uuidv4 from 'uuid/v4';

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]

    messages: [Message!]!
    message(id: ID!): Message!

    students: [Student!]
  }

  type Mutation {
    createMessage(text: String!): Message!
    updateMessage(id: ID!, text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  type Student {
    firstName: String!
    lastName: String!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
    firstName: 'Robin',
    lastName: 'Wieruch',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    firstName: 'Dave',
    lastName: 'Davids',
    messageIds: [2],
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};

const me = users[1];

const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },

    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },

    students: () => {
      return studentsArray;
    },
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        userId: me.id,
        text,
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);
      return message;
    },

    updateMessage: (parent, { id, text }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        throw new Error('Message does not exist');
      }

      message.text = text;

      return message;
    },

    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;

      if (!message) {
        return false;
      }

      messages = otherMessages;

      return true;
    },
  },

  User: {
    username: user => `${user.firstName} ${user.lastName}`,
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },

  Message: {
    user: message => {
      return users[message.userId];
    },
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
