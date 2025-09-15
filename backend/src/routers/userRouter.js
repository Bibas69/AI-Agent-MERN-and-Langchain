const express = require("express");
const { createUser, completeUserDetails, loginUser } = require("../controllers/userController");
const router = express.Router();

router.post("/", createUser);

router.post("/complete-details", completeUserDetails);

router.post("/login", loginUser);

module.exports = router;