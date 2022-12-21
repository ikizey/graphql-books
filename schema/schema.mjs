const books = [
  {
    id: '1',
    name: 'The Adventures of Tom Sawyer',
    shortDescription: 'A classic tale of adventure and mischief',
    authorIds: ['1'],
  },
  {
    id: '2',
    name: 'The Adventures of Huckleberry Finn',
    shortDescription: 'A classic tale of friendship and adventure',
    authorIds: ['1'],
  },
  {
    id: '3',
    name: "Harry Potter and the Philosopher's Stone",
    shortDescription: 'A magical tale of adventure and friendship',
    authorIds: ['2'],
  },
  {
    id: '4',
    name: 'Harry Potter and the Chamber of Secrets',
    shortDescription: 'A magical tale of mystery and adventure',
    authorIds: ['2'],
  },
  {
    id: '5',
    name: 'Harry Potter and the Prisoner of Azkaban',
    shortDescription: 'The third book in the Harry Potter series.',
    authorIds: ['2'],
  },
  {
    id: '6',
    name: 'The Prince and the Pauper',
    shortDescription: 'A tale of mistaken identity.',
    authorIds: ['1'],
  },
];

const authors = [
  {
    id: '1',
    name: 'Mark Twain',
    bookIds: ['1', '2', '6'],
  },
  {
    id: '2',
    name: 'J.K. Rowling',
    bookIds: ['3', '4', '5'],
  },
];

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

export const resolvers = {
  Query: {
    books: (root, { pageSize, page }) => {
      if (pageSize && page) {
        const startIndex = (page - 1) * pageSize;
        return books.slice(startIndex, startIndex + pageSize);
      }
      return books;
    },
    book(root, { id }) {
      return books.find((book) => book.id === id);
    },
    authors: (root, { pageSize, page }) => {
      if (pageSize && page) {
        const startIndex = (page - 1) * pageSize;
        return authors.slice(startIndex, startIndex + pageSize);
      }
      return authors;
    },
    author(root, { id }) {
      return authors.find((author) => author.id === id);
    },
  },
  Mutation: {
    createBook: (root, args) => {
      const newBook = {
        id: String(Math.max(-1, ...books.map((book) => book.id)) + 1),
        name: args.name,
        shortDescription: args.shortDescription,
        authorIds: args.authorIds,
      };
      books.push(newBook);
      return newBook;
    },
    updateBook: (root, args) => {
      const bookIndex = books.findIndex((book) => book.id === args.id);
      if (bookIndex === -1) {
        return {
          id: '-1',
          name: 'not found',
          authorIds: [],
        };
      }
      const updatedBook = {
        ...books[bookIndex],
        ...args,
      };
      books[bookIndex] = updatedBook;
      return updatedBook;
    },
    deleteBook: (root, { id }) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex === -1) {
        return false;
      }
      books.splice(bookIndex, 1);
      return true;
    },
    createAuthor: (root, args) => {
      const newAuthor = {
        id: String(Math.max(-1, ...authors.map((book) => book.id)) + 1),
        name: args.name,
        bookIds: args.bookIds,
      };
      authors.push(newAuthor);
      return newAuthor;
    },
    updateAuthor: (root, { id, name, bookIds }) => {
      const index = authors.findIndex((author) => author.id === id);
      if (index === -1) {
        return {
          id: '-1',
          name: 'not found',
          books: [],
        };
      }
      const updatedAuthor = { ...authors[index], name, bookIds };
      authors[index] = updatedAuthor;
      return updatedAuthor;
    },
    deleteAuthor: (root, { id }) => {
      const index = authors.findIndex((author) => author.id === id);
      if (index === -1) {
        return false;
      }
      authors.splice(index, 1);
      return true;
    },
  },
  Book: {
    authors: ({ authorIds }) => {
      return authors.filter((author) => authorIds.includes(author.id));
    },
  },
  Author: {
    books: ({ bookIds }) => {
      return books.filter((book) => bookIds.includes(book.id));
    },
  },
};
