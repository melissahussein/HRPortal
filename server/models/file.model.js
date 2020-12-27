const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let File = new Schema({
    id: String,
    files: Array
});


module.exports = mongoose.model('file', File, 'files');