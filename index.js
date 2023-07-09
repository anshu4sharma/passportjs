const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("./models/User.js");
const ConnectTODB = require("./config/database.js");
const app = express();
const bodyParser = require("body-parser");
require("dotenv/config");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Configure Express middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
ConnectTODB();
// Configure Passport

// Define the local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect Credentials." });
      }
      if (!user.verifyPassword(password)) {
        return done(null, false, { message: "Incorrect Credentials." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize and deserialize user instances
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log("deserializeUser", err);
    done(err);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Define routes
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.create({ username, password });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering new user please try again.");
  }
});

app.post("/login", (req, res, next) => {
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
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
