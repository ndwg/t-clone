const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    body: String,
    image: String
        
});

module.exports = mongoose.model('Post', PostSchema)