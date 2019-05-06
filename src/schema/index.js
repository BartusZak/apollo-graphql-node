import { gql } from 'apollo-server-express';

export default gql`
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
