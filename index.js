const express = require("express");
const session = require("express-session");
const passport = require("passport");
const ConnectTODB = require("./config/database.js");
const { PassPortSetup } = require("./config/passport.js");
const app = express();
const bodyParser = require("body-parser");
const { UserRouter } = require("./routes/User.js");
const PORT = process.env.PORT || 3000;
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Load environment variables
require("dotenv/config");

// Configure Express middleware
app.use(
  session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// connect to database

ConnectTODB();

// configure passport  

PassPortSetup();

app.use("/user", UserRouter);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
