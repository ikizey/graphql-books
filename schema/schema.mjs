import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} from 'graphql';
import _ from 'lodash';
// dummy data
const books = [
  { name: '111', genre: 'aaa', id: '1' },
  { name: '222', genre: 'bbb', id: '2' },
  { name: '333', genre: 'ccc', id: '3' },
  { name: '444', genre: 'ddd', id: '2' },
  { name: '555', genre: 'eee', id: '2' },
  { name: '666', genre: 'fff', id: '3' },
];

const authors = [
  { name: 'auth1', age: 44, id: '1', authorId: '1' },
  { name: 'auth2', age: 55, id: '2', authorId: '2' },
  { name: 'auth3', age: 66, id: '3', authorId: '3' },
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.fill(authors, { id: args.id });
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery });

export default schema;
