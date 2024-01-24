const mongoose = require("mongoose");
const User = require("./User.model");

const contactSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  //   user: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: true,
  //   }, // Reference to User
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
