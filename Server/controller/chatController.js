const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const chatModel = require("../models/chatModel");
const messageModel=require("../models/messageModel")

const generateToken = require("../config/generateToken");

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.sendStatus(500);
    }
console.log(userId,req.user._id,"fdjk");
    var isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    }
    //CREATING NEW CHATS
    let chatData = {
      chatName: "",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await chatModel.create(chatData);
    const fullChat = await chatModel
      .findOne({ _id: createdChat._id })
      .populate("users", "-password");

    res.status(200).send(fullChat);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Problem in fetching chats",
    });
  }
};
// FETCHING ALL CHATS OF USERS

const fetchChats = async (req, res) => {
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);

      });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Problem in fetching chats",
    });
  }
};

// CREATING GROUP CHATS

const createGroupChat = async (req, res) => {
  try {

    if (!req.body.users || !req.body.name) {

      return res.status(400).send({ message: "please fill the all fields" });
    }

    var users = JSON.parse(req.body.users);
    console.log(users);
    if (users.length < 2) {
      return res
        .status(400)
        .send({ message: "More than 2 users are required to form group chat" });
    }
    users.push(req.user);

    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("latestMessage");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Problem in fetching chats",
    });
  }
};

//RENAMING GROUP API

const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          chatName,
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("latestMessage");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat not found");
    } else {
      res.json(updatedChat);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Problem in fetching chats",
    });
  }
};

//ADD USER TO GROUP API

const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const added = await chatModel.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
    .populate("users", "-password")
    .populate("latestMessage");
    if (!added) {
        res.status(404);
        throw new Error("Chat not found");
      } else {
        res.json(added);
      }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Problem in fetching chats",
    });
  }
};

//REMOVING SOME ONE FROM GROUP

const removeFromGroup=async(req,res)=>{
    try{
        const { chatId, userId } = req.body;
        const removed = await chatModel.findByIdAndUpdate(
          chatId,
          { $pull: { users: userId } },
          { new: true }
        )
        .populate("users", "-password")
        .populate("latestMessage");
        if (!removed) {
            res.status(404);
            throw new Error("Chat not found");
          } else {
            res.json(removed);
          }
    } catch (err) {
        console.log(err);
        res.status(500).send({
          success: false,
          message: "Problem in fetching chats",
        });
      }
}


const deleteFun=async(req,res)=>{
// const num=await userModel.deleteMany({});
// res.send("sab saaf");
}
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteFun
};
