import Book from '../models/book.mjs';
import Author from '../models/author.mjs';

import {
  paginate,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getRelatedDocuments,
} from './utils.mjs';

export const resolvers = {
  Query: {
    books: (root, args) => paginate(Book, args),
    book: (root, { id }) => getDocumentById(Book, id),
    authors: (root, args) => paginate(Author, args),
    author: (root, { id }) => getDocumentById(Author, id),
  },
  Mutation: {
    createBook: (root, data) =>
      createDocument(Book, data, 'authorIds', Author, 'booksIds'),
    updateBook: (root, args) => updateDocument(Book, args.id, args),
    deleteBook: (root, { id }) =>
      deleteDocument(Book, id, 'authorIds', Author, 'booksIds'),
    createAuthor: (root, data) => createDocument(Author, data),
    updateAuthor: (root, args) => updateDocument(Author, args.id, args),
    deleteAuthor: (root, { id }) =>
      deleteDocument(Author, id, 'booksIds', Book, 'authorIds'),
  },
  Book: {
    authors: async ({ authorIds }) => {
      return getRelatedDocuments(Author, '_id', authorIds);
    },
  },
  Author: {
    books: async ({ booksIds }) => {
      return getRelatedDocuments(Book, '_id', booksIds);
    },
  },
};
