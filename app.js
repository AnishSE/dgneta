require('dotenv').config();
const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const bodyParser      = require('body-parser');
const schedule        = require('node-schedule');
const cors            = require('cors');
const ejsLayouts      = require("express-ejs-layouts");
const wagner          = require('wagner-core');
const helmet          = require('helmet');
const flash           = require('express-flash');
const session         = require('express-session');
const sequelize       = require('./utils/db')(wagner);

var app               = express();

const port = 3003;

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "2C44-4D44-WppQ38S",
  cookie: {
    secure: false
  },
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({limit: '5000mb',extended: true}));
app.use(bodyParser.urlencoded({limit: '5000mb',extended: true}));

/*Setting up layouts*/

/*Setting up layouts*/
app.use(function(req, res, next) {   
  const original_request = req.originalUrl;
  const string_array     = original_request.split('/'); 
  global.baseUrl         = req.protocol + '://' + req.headers.host;  
  res.locals.currentUser = req.session.currentUser;

  if( string_array['1'] == 'admin'  && (string_array['2'] == 'login' || string_array['2'] == 'forgetPassword' || string_array['2'] == 'resetPassword' )){
      app.set('layout', 'layout');
  }else if(string_array['1'] == 'admin'){
      app.set('layout', 'adminLayout');
  }else{
    app.set('layout', 'layout');
  }
  return next();
});

app.use(ejsLayouts); 

require('./utils/dependencies')(wagner);
require("./models")(sequelize, wagner);
require('./manager')(wagner);

app.use(flash());

app.use(function(err, req, res, next) {
  res.locals.message     = err.message;
  res.status(err.status || 500);
  res.render('error');  
});

//Routes
require("./routes")(app, wagner);

app.listen(port, () => console.log(`App listening on port ${port}!`));
