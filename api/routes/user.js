const express = require("express");
const router = express.Router();
const validate = require("express-validation");

const controller = require("../controllers/user");

const { authorize, ADMIN, LOGGED_USER } = require("../middlewares/auth");
const {
  listUser,
  createdUser,
  updateUser,
  replaceUser,
} = require("../validations/user");

router.param("userId", controller.load);
router.get("/", authorize("ADMIN"), controller.listUser);
router.post("/", authorize("ADMIN"), controller.create);
router.get("/profile", authorize(), controller.loggedIn);
router.get("/:userId", authorize(LOGGED_USER), controller.get);
router.put(
  "/:userId",
  authorize(LOGGED_USER),
  validate(replaceUser),
  controller.replace
);
router.patch(
  "/:userId",
  authorize(LOGGED_USER),
  validate(updateUser),
  controller.update
);
router.delete("/:userId", authorize(LOGGED_USER), controller.remove);

// router.get("/", controller.listUser);
// router.post("/", controller.create);
// router.get("/profile", controller.loggedIn);
// router.get("/:userId", controller.get);
// router.put(
//   "/:userId",

//   //   validate(replaceUser),
//   controller.replace
// );
// router.patch(
//   "/:userId",

//   //   validate(updateUser),
//   controller.update
// );
// router.delete("/:userId", controller.remove);

module.exports = router;
