const jwt = require("jsonwebtoken");


//This function helps in authorization it will give json web token to authorize the user for accesing the resource.
const generateToken = (id) => {
  return jwt.sign({ id },"mynameisamardeep", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
