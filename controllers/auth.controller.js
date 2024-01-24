const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachJwtToResponse, createTokenUser } = require("../utils");
const { createUser, loginUser } = require("../services/auth.service");

const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const user = await createUser(first_name, last_name, email, password);
  console.log(user);
  attachJwtToResponse({ res, user: user });
  res.status(StatusCodes.CREATED).json({ user: user });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);
  res.status(StatusCodes.OK).json({ user: user });
};
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  logout,
};
