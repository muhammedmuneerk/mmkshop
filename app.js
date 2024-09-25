// Load environment variables from the .env file
require('dotenv').config(); // Ensure this is at the very top
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const hbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const db = require('./config/connection');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    inc: (value) => parseInt(value) + 1 // Custom helper to increment index
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB
}));
app.use(session({
  secret: "Key",
  cookie: { maxAge: 600000 },
  resave: false,
  saveUninitialized: false
}));

// Connect to MongoDB Atlas
db.connect(async (err) => {
  if (err) {
    console.log("Connection Error:", err);
    process.exit(1); // Exit the process if there's a connection error
  } else {
    console.log("Connected to MongoDB Atlas");
    
    // Start the server here
    const port = process.env.APP_PORT || 3000; // Port defined here
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});

// Use the routers
app.use('/', userRouter);
app.use('/admin', adminRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
