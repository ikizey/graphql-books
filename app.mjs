import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import { typeDefs, resolvers } from './schema/schema.mjs';

const app = express();
const httpServer = http.createServer(app);
const port = 4321;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(bodyParser.json(), expressMiddleware(server));

app.listen(port, () => {
  console.info(`listening at ${port}`);
});
