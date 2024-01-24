const User = require("../models/User.model");
const Contact = require("../models/Contact.model");
const CustomError = require("../errors");
const { attachJwtToResponse, createTokenUser } = require("../utils");

const createUser = async (first_name, last_name, email, password) => {
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    role,
  });

  const tokenUser = createTokenUser(user);
  console.log(tokenUser, "Fffffffff");
  return tokenUser;
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);

  const tokens = attachJwtToResponse({ user: tokenUser });

  return { user: tokenUser, tokens };
};
const logout = async (res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
};
module.exports = {
  createUser,
  loginUser,
  logout,
};
