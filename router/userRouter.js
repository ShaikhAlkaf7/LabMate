const express = require("express");
const {
  createUserController,
  searchUserController,
} = require("../Controller/userController.js");

const router = express.Router();

router.post("/create-user", createUserController);
router.get("/search-user", searchUserController);

module.exports = router;
