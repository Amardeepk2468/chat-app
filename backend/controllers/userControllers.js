const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken=require("../config/generateToken");


//This is the function to register a user.
const registerUser = asyncHandler(async (req, res) => {
  const body = req.body;
  console.log(body);
  const { name, email, password, pic } = req.body;

  //If any of the email,name,password becomes undefined,then the error is thrown.
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  //If the user is already registered then no need of registering again.
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  //Creating a new user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token:generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});



//This is the function for authorizing the user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
//To check if the user already exists and the password matches correctly
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});



//To get all users of given search result
//Read about this in mongodb
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});


module.exports={registerUser,authUser,allUsers}