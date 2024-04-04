const Chat = require('../models/chat');

module.exports.index = async (req,res) => {
    //const chats = await Chat.find({});
    res.render('chats/index'/*, {chats}*/);
}