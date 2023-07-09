const passport = require("passport");
const { User } = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;

const PassPortSetup = () => {
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
};

exports.PassPortSetup = PassPortSetup;
