export const typeDefs = `#graphql
  type Book {
    id: ID!
    name: String!
    shortDescription: String
    authors: [Author!]!
  }

  type Author {
    id: ID!
    name: String!
    books: [Book!]!
  }

  type Query {
    books(pageSize: Int, page: Int): [Book]
    book(id: ID!): Book
    authors(pageSize: Int, page: Int): [Author]
    author(id: ID!): Author
  }

  type Mutation {
    createBook(name: String!, shortDescription: String, authorIds: [ID!]): Book
    updateBook(id: ID!, name: String, shortDescription: String, authorIds: [ID!]): Book
    deleteBook(id: ID!): Boolean
    createAuthor(name: String!, bookIds: [ID!]): Author
    updateAuthor(id: ID!, name: String, bookIds: [ID!]): Author
    deleteAuthor(id: ID!): Boolean
}
`;
