import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: false,
  },
  authorIds: [
    {
      type: String,
      required: true,
    },
  ],
});

const Book = model('Book', bookSchema);

export default Book;
