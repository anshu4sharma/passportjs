const express = require("express");
const router = express.Router();

const { UserController } = require("../controller/User");

router.post("/register", UserController.Register);

router.post("/login", UserController.Login);
router.get("/logout", UserController.Logout);

router.get("/getallusers", UserController.GetAllUsers);

exports.UserRouter = router;
