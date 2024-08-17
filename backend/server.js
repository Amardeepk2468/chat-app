const express = require("express");
const { createServer } = require("http");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const  messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const {notFound,errorHandler}=require("./middleware/errorMiddleware")
dotenv.config();
connectDB();
const app = express();
const frontend_url = process.env.FRONTEND_URI;
app.use(cors({
  origin : `${frontend_url}`
}));
// app.use(cors({
//   origin : "*"
// }));
const PORT =5000;


app.use(express.json())//to accept json data

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message",messageRoutes)

//This is for handling errors
app.use(notFound)
app.use(errorHandler)
const server=app.listen(PORT, () => {
  console.log(`listening on port${PORT}`);
});


//setting up the socket 
const io=require('socket.io')(
  server,{
    pingTimeout:60000,
    cors:{
    origin:frontend_url,
    // origin : "http://localhost:3000"
    } 
  }
)

//this takes the name of the socket and the call back function
io.on("connection",(socket)=>{
  console.log("connected to socket.io");
  //this function creates a room for chat
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });


  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})
