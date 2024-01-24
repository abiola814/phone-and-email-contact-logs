const User = require("../models/User.model");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createContact,
  updateContact,
  getUsersWithContact,
} = require("../services/contact.service");

const newContactView = async (req, res) => {
  const { type, value } = req.body;
  const result = await createContact(type, value, req.user.userId);
  res.status(StatusCodes.OK).json({ result });
};

const changeContact = async (req, res) => {
  const result = await updateContact(req.user.userId, req.body);
  res.status(StatusCodes.OK).json(result);
};

const allUserWithContact = async (req, res) => {
  const allcontact = await getUsersWithContact();
  res.status(StatusCodes.OK).json(allcontact);
};

module.exports = {
  newContactView,
  changeContact,
  allUserWithContact,
};
