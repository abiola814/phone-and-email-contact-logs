const User = require("../models/User.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  getUserById,
  userFilter,
  userProfile,
  changePassword,
  userUpdate,
} = require("../services/user.service");
const {
  createTokenUser,
  attachJwtToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" })
    .select("-password")
    .populate("contacts");
  res.status(StatusCodes.OK).json({ users });
};

const filterByUser = async (req, res) => {
  const data = await userFilter(req);
  res.status(StatusCodes.OK).json({ data });
};

const getSingleUser = async (req, res) => {
  const user = await getUserById(req);
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = await userProfile(req.user.userId);
  res.status(StatusCodes.OK).json({ user });
};
// update user with user.save()
const updateUser = async (req, res) => {
  const { email, first_name, last_name } = req.body;
  const result = await userUpdate(
    email,
    first_name,
    last_name,
    req.user.userId
  );

  res.status(StatusCodes.OK).json({ result });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await changePassword(oldPassword, newPassword, req.user.userId);
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  filterByUser,
};

// update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('Please provide all values');
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachJwtToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
