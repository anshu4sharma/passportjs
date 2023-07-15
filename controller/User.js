const passport = require("passport");
const { User } = require("../models/User");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

class UserController {
  static async Register(req, res) {
    const { username, password } = req.body;
    console.log(req.body);
    try {
      if (!username || !password) {
        return res.status(400).send("Username and password required");
      }
      const isUserExist = await User.findOne({ username });
      if (isUserExist) {
        return res.status(400).send("That user already exists!");
      }
      const user = await User.create({ username, password });
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
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
      let anshuValue = myCache.get("anshu");
      if (anshuValue !== undefined) {
        return res.json({
          message: anshuValue,
        });
      }
      const anshu = new Promise((resolve, reject) => {
        setTimeout(async() => {
          let users = await User.find({});
          resolve(users);
        }, 3000);
      });
      const result = await anshu;
      myCache.set("anshu", result, 100);
      res.json(result);
    } catch (error) {
      res.json({ message: error });
    }
  }
}

exports.UserController = UserController;
