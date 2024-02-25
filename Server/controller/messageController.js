const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
const chatModel = require("../models/chatModel");

// ROUTE FOR SENDING A MESSAGE

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Some field is empty");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content,
        chat: chatId
    };

    try {
        // Create the message
        var message = await messageModel.create(newMessage);

        // Populate sender field
        message = await messageModel.populate(message, { path: "sender", select: "name pic" });

        // Populate chat field
        message = await messageModel.populate(message, { path: "chat" });

        // Check if message.chat is populated and it's a document
        if (message.chat && typeof message.chat === 'object') {
            // Populate users field in the chat
            message.chat = await chatModel.populate(message.chat, {
                path: "users",
                select: "name pic email"
            });
        }


        // Update the latest message in the chat
        await chatModel.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        });

        res.json(message);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// for fetching all Messagesz

const allMessages=async(req,res)=>{

    try {
        const messages=await messageModel.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400).send(error.message);

    }
}
module.exports = { sendMessage,allMessages };
