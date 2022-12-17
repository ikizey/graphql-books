import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: BookType,
    args: { id: { type: GraphQLString } },
    resolve(parent, args) {
      //TODO!
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
