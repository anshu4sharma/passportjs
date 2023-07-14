const passport = require("passport");
const { User } = require("../models/User");

class UserController {
  static async Register(req, res) {
    const { username, password } = req.body;
    console.log(req.body);
    try {
      const isUserExist = await User.findOne({ username });
      if (isUserExist) {
        return res.status(400).send("That user already exists!");
      }
      const user = await User.create({ username, password });
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    }
  }

  static async Login(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    })(req, res, next);
  }

  static async Logout(req, res) {
    req.logout();
    res.status(200).json({ message: "logged out" });
  }

  static async GetAllUsers(req, res) {
    try {
      let users = await User.find({});
      res.json(users);
    } catch (error) {
      res.json({ message: error });
    }
  }
}

exports.UserController = UserController;
