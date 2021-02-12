const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local')
const User=require('./models/user')


const app = express();
const environment = process.env.NODE_ENV; // development

//-------------Connect to database---------------------
var db = require('./db.js');
mongoose.connect(db.database, { useNewUrlParser: true });

//-------------App Set----------------------------------
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));


if (environment !== 'production') {
  app.use(morgan('dev'));
}

//------------Passport Configuration----------------------
app.use(require("express-session")({
  secret: "I stopped it.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

//--------------Routes-------------------------------
var storyroute=require('./routes/storyroute');
var loginroute=require('./routes/loginroute');
var registerroute=require('./routes/registerroute');
var userroute=require('./routes/userroute');
var indexroute=require('./routes/indexroute')


app.use('/index',indexroute);
app.use('/register',registerroute);
app.use('/login',loginroute);
app.use('/story',storyroute);
app.use('/user',userroute);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log('Server has started succesfully');
});

module.exports = app;