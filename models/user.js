const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    bio: String,
    location: String,
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    pfp: ImageSchema
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);