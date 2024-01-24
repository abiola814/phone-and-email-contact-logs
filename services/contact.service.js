const User = require("../models/User.model");
const Contact = require("../models/Contact.model");
const CustomError = require("../errors");
const { attachJwtToResponse, createTokenUser } = require("../utils");

const createContact = async (type, value, id) => {
  try {
    // Create a new contact
    const contact = new Contact({ type, value, user: id });
    await contact.save();
    await User.findByIdAndUpdate(
      id,
      { $push: { contacts: contact._id } },
      { new: true }
    ).select("-password");

    return contact;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw new CustomError.BadRequestError(`unable to fetch ${error}`);
  }
};

const updateContact = async (id, data) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, data, {
      new: true,
    }).select("-password");

    return updatedContact;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw new CustomError.BadRequestError(`unable to fetch ${error}`);
  }
};

const getUsersWithContact = async () => {
  try {
    const usersWithContacts = await User.aggregate([
      {
        $lookup: {
          from: "contacts",
          localField: "contacts",
          foreignField: "_id",
          as: "contacts",
        },
      },
      {
        $project: {
          password: 0, // Exclude the password field
        },
      },
    ]);

    return usersWithContacts;
  } catch (error) {
    console.error("Error fetching users with contacts:", error);
    throw new CustomError.BadRequestError(`unable to fetch ${error}`);
  }
};

module.exports = {
  createContact,
  updateContact,
  getUsersWithContact,
};
