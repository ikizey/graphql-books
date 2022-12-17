import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './schema/schema.mjs';

const app = express();
const port = 4321;

app.all(
  '/api',
  createHandler({
    schema,
  })
);

app.listen(port, () => {
  console.info(`listening at ${port}`);
});
