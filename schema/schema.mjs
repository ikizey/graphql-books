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
    bookIds: ['1', '2', ''],
  },
  {
    id: '2',
    name: 'J.K. Rowling',
    bookIds: ['3', '4'],
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
    books: [Book]
    book(id: ID): Book
    authors: [Author]
    author(id: ID): Author
  }
`;

export const resolvers = {
  Query: {
    books() {
      return books;
    },
    book(root, { id }) {
      return books.find((book) => book.id === id);
    },
    authors() {
      return authors;
    },
    author(root, { id }) {
      return authors.find((author) => author.id === id);
    },
  },
  Book: {
    authors: (book) => {
      const authorIds = book.authorIds;
      return authors.filter((author) => authorIds.includes(author.id));
    },
  },
  Author: {
    books: (author) => {
      const authorBookIds = author.bookIds;
      return books.filter((book) => authorBookIds.includes(book.id));
    },
  },
};
