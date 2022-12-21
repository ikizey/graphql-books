import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { typeDefs } from './schema/typeDefs.mjs';
import { resolvers } from './schema/resolvers.mjs';

dotenv.config({ path: `.env.local` });
const mongoUser = process.env.MONGO_USER || '';
const mongoPassword = process.env.MONGO_PASSWORD || '';
const mongoURL = process.env.MONGO_URL || '';

const app = express();
const httpServer = http.createServer(app);
const port = 4321;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(cors(), bodyParser.json(), expressMiddleware(server));

mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@${mongoURL}`);
mongoose.connection.once('open', () => {
  console.log('connected to mongoDB instance');
});

app.listen(port, () => {
  console.info(`listening at ${port}`);
});
