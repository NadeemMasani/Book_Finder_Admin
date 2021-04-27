const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const libaccountSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    lib: { type: mongoose.Types.ObjectId, required: true, ref: 'Library' }
});
libaccountSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Libaccount', libaccountSchema);