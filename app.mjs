import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema.mjs';

const app = express();
const port = 4321;

app.use(
  '/api',
  graphqlHTTP({
    schema,
  })
);

app.listen(port, () => {
  console.info(`listening at ${port}`);
});
