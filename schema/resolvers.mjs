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
    book: (root, { id, additionalArgument }) =>
      getDocumentById(Book, id, additionalArgument),
    authors: (root, args) => paginate(Author, args),
    author: (root, { id, additionalArgument }) =>
      getDocumentById(Author, id, additionalArgument),
  },
  Mutation: {
    createBook: (root, data) => createDocument(Book, data),
    updateBook: (root, args) => updateDocument(Book, args.id, args),
    deleteBook: (root, { id }) => deleteDocument(Book, id, 'authorIds', Author),
    createAuthor: (root, data) => createDocument(Author, data),
    updateAuthor: (root, args) => updateDocument(Author, args.id, args),
    deleteAuthor: (root, { id }) => deleteDocument(Author, id, 'bookIds', Book),
  },
  Book: {
    authors: async ({ authorIds }) => {
      return getRelatedDocuments(Author, '_id', authorIds);
    },
  },
  Author: {
    books: async ({ bookIds }) => {
      return getRelatedDocuments(Book, '_id', bookIds);
    },
  },
};