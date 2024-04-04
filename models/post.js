const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const PostSchema = new Schema({
    body: String,
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
    },
    {timestamps: true}
);

module.exports = mongoose.model('Post', PostSchema);