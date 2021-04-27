const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: Number, required: true },
    category: { type: String, required: true },
    publisher: { type: String, required: true },
    lib: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Library' }]
});
// bookSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Book', bookSchema);