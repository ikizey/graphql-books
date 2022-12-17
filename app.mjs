import express from 'express';

const app = express();
const port = 4321;

app.listen(port, () => {
  console.info(`listening at ${port}`);
});
