export const schema = `
  type User {
    id: ID!
    name: String
    email: String!
    posts(cursor: ID, limit: Int!): [Post]
  }

  type Post {
    id: ID!
    title: String!
    content: String
    author: User
    comments(cursor: ID, limit: Int!): [Comment]
  }

  type Comment {
    id: ID!
    content: String
    post: Post
    author: User
  }

  type Query {
    posts(cursor: ID, limit: Int!): [Post]
    postByID(id: ID!): Post
    postsByAuthor(authorID: ID!, cursor: ID, limit: Int!): [Post]
  }
`;
