const express = require("express");
const router = express.Router();

const { UserController } = require("../controller/User");

router.post("/register", UserController.Register);

router.post("/login", UserController.Login);

exports.UserRouter = router;
