import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    students: [Student!]
  }

  type Student {
    firstName: String!
    lastName: String!
  }

  type User {
    id: ID!
    username: String!
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
    firstName: 'Robin',
    lastName: 'Wieruch',
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    firstName: 'Dave',
    lastName: 'Davids',
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
    students: () => {
      return studentsArray;
    },
  },
  User: {
    username: user => `${user.firstName} ${user.lastName}`,
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
