const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    name: String,
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    msgs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
});