var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
const { connectToDatabase } = require('./config/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var quizzesRouter = require('./routes/quizzes');
var questionsRouter = require('./routes/questions');

var app = express();

// Connect DB
connectToDatabase().catch((err) => {
	// eslint-disable-next-line no-console
	console.error('Failed initial DB connection:', err);
	process.exit(1);
});

// CORS middleware for ASS 2 integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quizzes', quizzesRouter);
app.use('/questions', questionsRouter);

// 404 handler
app.use(function (req, res, next) {
	res.status(404).json({ message: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
	// eslint-disable-next-line no-console
	console.error(err);
	if (res.headersSent) return;
	const status = err.name === 'ValidationError' ? 400 : (err.status || 500);
	res.status(status).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
