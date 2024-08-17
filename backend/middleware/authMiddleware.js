const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // console.log("Headers:", req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Log the token
      console.log("Token from header:", token);

      // Decode token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Log decoded token
      console.log("Decoded token:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      // Log fetched user
      console.log("Fetched user:", req.user);

      if (!req.user) {
        console.error("User not found");
        res.status(401);
        throw new Error("Not authorized, token failed");
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
