import { Schema } from 'mongoose';

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  authors: [
    {
      type: String,
      required: true,
    },
  ],
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
