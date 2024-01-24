const User = require("../models/User.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const getUserById = async (req) => {
  const user = await User.findOne({ _id: req.params.id })
    .select("-password")
    .populate("contacts");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  return user;
};

const userProfile = async (id) => {
  const user = await User.findOne({ _id: id })
    .select("-password")
    .populate("contacts");
  return user;
};
const userFilter = async (req) => {
  try {
    const filters = req.query;

    // query based on filters
    const query = {};
    if (filters.first_name) query.first_name = filters.first_name;
    if (filters.last_name) query.last_name = filters.last_name;
    if (filters.date_added) {
      query.date_added = { $gte: new Date(filters.date_added) };
    }

    // Execute the query
    const users = await User.find(query).populate("contacts");

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new CustomError.BadRequestError(`unable to fetch ${error}`);
  }
};

const userUpdate = async (data, id) => {
  if (!data) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
  });

  return user;
};

const changePassword = async ({ oldPassword, newPassword, id }) => {
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: id });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
};
module.exports = {
  getUserById,
  userFilter,
  userProfile,
  userUpdate,
  changePassword,
};
