const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");

const connectDB = require("./config/db");

dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

//connect to mongodb atlas
connectDB();

//
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(flash());

//Sessions
app.use(
  session({
    secret: "Broken John",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//add public folder
app.use(express.static(path.join(__dirname + "/public")));

// using body parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//set views to ejs
app.set("view engine", "ejs");

//logs out user
app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

// Routes
app.use("/", require("./routes/cover"));
app.use("/", require("./routes/home"));
app.use("/", require("./routes/login"));
app.use("/", require("./routes/random"));

app.use("/", require("./routes/register"));
app.use("/", require("./routes/search"));
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/favorites"));

// port info
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is listening on: ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
