import { Schema, model } from 'mongoose';

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  booksIds: [
    {
      type: String,
      required: true,
    },
  ],
});

const Author = model('Author', authorSchema);

export default Author;
