const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRoles } = require("../middleware/full-auth");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,

  filterByUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/user.controller");
const {
  newContactView,
  allUserWithContact,
  changeContact,
} = require("../controllers/contact.controller");
router
  .route("/")
  .get(authenticateUser, authorizeRoles("admin", "user"), getAllUsers);
router.route("/filter").get(authenticateUser, filterByUser);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
router
  .route("/contact")
  .post(authenticateUser, newContactView)
  .get(authenticateUser, allUserWithContact);
router.route("/contact/:id").patch(authenticateUser, changeContact);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
