const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./router/authRoute");
const chatRoutes=require("./router/chatRoutes")
const cors = require("cors");
const messageRoutes=require("./router/messageRoutes");
const {notFound,errorHandler}=require('./middleware/errorMiddleware');
const socket=require("socket.io");

const db = require("./db");

require("dotenv").config();

db();

const app = express();

//for accepting json data
app.use(express.json());

//cors policy

const corsOptions = {
    origin: 'https://chat-website-client.vercel.app/', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204,  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  
  app.use(cors(corsOptions));

  //user api endpoint

app.use("/api/v1/user",authRoute);

//chat api endpoint

app.use("/api/v1/chat",chatRoutes);

// message api end point

app.use("/api/v1/message",messageRoutes)

app.use(notFound);
app.use(errorHandler);

const server=app.listen(process.env.PORT, () => {
  console.log(`listening at port ${process.env.PORT}`);
});
// SOCKET IMPLEMENTATION
const io=socket(server,{
  pingTimeout:60000,

  cors:corsOptions
});
io.on("connected",(socket)=>{
console.log("connected to the socket .io");
socket.on('setup',(userData)=>{
socket.join(userData.id);
console.log(userData);
socket.emit("connected");
})

socket.on('join chat',(room)=>{
  socket.join(room);
  console.log("user joinde romm",room);
})

//send messages functionality

socket.on('new message',(newMessageReceive)=>{
var chat=newMessageReceive.chat;
if(!chat.users){
return console.log('chat.user not defined');
}

chat.users.array.forEach(user => {
  if(user._id===newMessageReceive.sender._id) return;
  socket.in(user._id).emit('message received',newMessageReceive);
});
})

socket.on("typing",(room)=>{
socket.in(room).emit("typing");
})

socket.on("stop typing",(room)=>{
  socket.in(room).emit("stop typing");
  })


  socket.off("setup",()=>{
console.log("user disconnected");
socket.leave(userData.id);
  })
});
