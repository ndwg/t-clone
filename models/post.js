const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    body: String,
    image: String,
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
});

module.exports = mongoose.model('Post', PostSchema)