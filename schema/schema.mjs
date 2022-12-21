import Book from '../models/book.mjs';
import Author from '../models/author.mjs';

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

const createDocument = async (Model, data) => {
  try {
    const newDocument = new Model(data);
    const savedDocument = await newDocument.save();
    return savedDocument;
  } catch (error) {
    console.error(error);
    throw new Error(`Error creating ${Model.modelName}`);
  }
};

const paginate = async (Model, { pageSize, page }) => {
  if (pageSize && page) {
    const startIndex = (page - 1) * pageSize;
    return await Model.find().skip(startIndex).limit(pageSize);
  }
  return await Model.find();
};

const getDocumentById = async (Model, id) => {
  return await Model.findOne({ id });
};

const updateDocument = async (Model, id, updatedFields) => {
  try {
    const updatedDocument = await Model.updateOne({ id }, updatedFields);
    if (updatedDocument.nModified === 0) {
      throw new Error(`Document with id ${id} not found`);
    }
    return updatedDocument;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteDocument = async (Model, id, fieldToUpdate, relatedModel) => {
  try {
    const deletedDocument = await Model.findByIdAndDelete(id);
    if (!deletedDocument) {
      throw new Error(`${Model.modelName} with id ${id} not found`);
    }
    await updateRelatedDocuments(
      deletedDocument,
      fieldToUpdate,
      relatedModel,
      Model
    );
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const updateRelatedDocuments = async (
  deletedDocument,
  fieldToUpdate,
  relatedModel,
  Model
) => {
  deletedDocument[fieldToUpdate].forEach(async (relatedId) => {
    const relatedDocument = await relatedModel.findById(relatedId);
    const documentIndex = relatedDocument[fieldToUpdate].indexOf(
      deletedDocument._id
    );
    relatedDocument[fieldToUpdate].splice(documentIndex, 1);
    try {
      await relatedDocument.save();
    } catch (error) {
      await Model.create(deletedDocument);
      throw new Error(error);
    }
  });
};

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
      return await Author.find({ _id: { $in: authorIds } });
    },
  },
  Author: {
    books: async ({ bookIds }) => {
      return await Book.find({ _id: { $in: bookIds } });
    },
  },
};
